const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// Singleton instance implementation pattern
let instance = null;

class AIService {
  constructor() {
    if (instance) return instance;
    
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ GEMINI_API_KEY is not configured. AI features will not work.');
      this.model = null;
    } else {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using gemini-2.5-flash (Newest available in your list)
        this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }
    
    instance = this;
  }

  async detectIntent(userQuery, history = []) {
    // 1. Try Local Regex Detection first (Save API Quota)
    const localIntent = this._detectIntentLocally(userQuery);
    if (localIntent) {
        console.log('⚡ Local Intent Detected:', localIntent.intent);
        return localIntent;
    }

    // 2. Fallback to Gemini API if available
    if (!this.model) {
      // throw new Error('AI Service not initialized');
      return this._fallbackResponse("AI Brain missing");
    }

    try {
      const prompt = this._buildIntentPrompt(userQuery, history);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this._parseResponse(text);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this._fallbackResponse(error.message);
    }
  }

  // Optimize common queries to save API calls (Rate Limit Protection)
  _detectIntentLocally(query) {
    const q = query.toLowerCase();
    
    // Entity Extraction (Basic)
    const keywords = q.match(/\b(dettol|biscuit|pen|soap|sugar|rice|oil)\b/gi) || [];
    const entities = { 
        product_keywords: keywords, 
        filters: {} 
    };

    // 1. Discount Query
    if (q.match(/(discount|disc|offer|kam|less|concession)/)) {
        // Extract requested value if present (e.g., "10% discount" or "50 rs less")
        const numberMatch = q.match(/(\d+)/);
        const isPercent = q.includes('%') || q.includes('percent');
        const requestedValue = numberMatch ? parseInt(numberMatch[0]) : null;

        return {
            intent: 'discount_inquiry', // Specific intent for UI targeting
            entities: { 
                ...entities, 
                filters: { ...entities.filters },
                requested_discount: requestedValue, // Pass this to frontend
                discount_type: isPercent ? 'percent' : 'flat'
            },
            requires_database: true,
            user_message: null
        };
    }

    // 2. Price/Availability Query
    if (q.match(/(price|cost|kitne|rupees|rate|dam|daam|hai kya|available|stock|bache|rakha)/)) {
        return {
            intent: 'availability_check', // Changed from generic price_inquiry
            requires_database: true,
            entities,
            user_message: null
        };
    }
    
    // If keywords found but unknown intent -> Assume Search
    if (keywords.length > 0) {
        return {
            intent: 'product_search',
            requires_database: true,
            entities,
            user_message: null
        };
    }

    return null; // Logic flow continues to API
  }

  _fallbackResponse(errorMsg) {
      return {
        intent: 'unknown',
        sub_intent: 'error_fallback',
        entities: { product_keywords: [], filters: {} },
        user_message: `I understood your request, but my brain is tired (Quota Exceeded). But I can still look things up manually! (Debug: ${errorMsg})`
      };
  }

  _buildIntentPrompt(userQuery, history) {
    // Basic history formatting
    const historyText = history.slice(-5).map(msg => 
        `- ${msg.role}: "${msg.content}"`
    ).join('\n');

    return `
You are an AI assistant for a retail inventory system. Extract structured data from the user's query.

**Conversation History:**
${historyText}

**Customer Query:** "${userQuery}"

**Instructions:**
1. Identify the INTENT (product_search, availability_check, price_inquiry, general_chat).
2. Extract ENTITIES:
   - "product_name": The FULL specific product name (e.g. "Redmi Note 9", "Milton Bottle").
   - "attributes": Specific details (e.g. "Red", "5%", "1kg").
3. Extract FILTERS (price range, in_stock_only).

**JSON Format:**
Respond ONLY with valid JSON. No markdown.

{
  "intent": "product_search" | "availability_check" | "price_inquiry" | "general_chat" | "discount_inquiry",
  "entities": {
    "product_name": "string (full specific name)" | null,
    "attributes": ["string"] | [],
    "filters": {
      "brand": null | "string",
      "price_range": { "min": null, "max": null },
      "in_stock_only": boolean
    }
  },
  "user_message": null | "string (if chatting)",
  "requires_database": boolean
}
`;
  }

  async generateResponse(userQuery, data, history = []) {
    if (!this.model) return null;

    try {
        const context = JSON.stringify(data, null, 2);
        const prompt = `
You are a smart and persuasive shopkeeper for a retail store in India.
Your Persona: You speak in a helpful "Hinglish" tone (mix of Hindi and English).
You are a "Master Negotiator".

**Conversation Context:**
${history.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

**Inventory Data Found:**
${context}

**Customer Query:** "${userQuery}"

**Instructions:**
1. **Exact Match:** If the user asked for a specific product (e.g., "Redmi Note 9") and it is in the data, give the price vs market price (if known) or just the best price.
2. **Alternative/Negotiation:** If the user asked for "Red Milton Bottle" but Data only has "Blue Milton Bottle" (or similar), YOU MUST:
   - Acknowledge the missing item ("Red wala toh nahi hai...").
   - Strong Pitch for the available item ("...par ye Blue wala solid hai! Same quality, 24hr cooling.").
   - Highlight features from the data (custom_name, description).
3. **Discount:** If user asks for discount:
   - Use the 'requested_discount' context if available.
   - If user asks 5% and max is 10%, say "Done! 5% discount laga diya."
   - If user asks 20% and max is 10%, say "Nahi sir, max 10% hi de paunga. Par deal acchi hai!"

**Constraints:**
- Do NOT mention "database" or "records".
- Keep it natural, conversational, and persuasive.
`;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('AI Generation Error:', error);
        return null; // Fallback to static message if generation fails
    }
  }

  _parseResponse(text) {
    try {
        // Clean markdown if present
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error('Failed to parse AI response:', text);
        throw new Error('Invalid JSON response from AI');
    }
  }
}

module.exports = new AIService();
