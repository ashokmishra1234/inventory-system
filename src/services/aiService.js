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
        return {
            intent: 'price_inquiry',
            entities: { ...entities, filters: { ...entities.filters } }, // Add special flag if needed? simpler to just treat as price
            requires_database: true,
            user_message: null
        };
    }

    // 2. Price/Availability Query
    if (q.match(/(price|cost|kitne|rupees|rate|dam|daam|hai kya|available|stock|bache|rakha)/)) {
        return {
            intent: 'price_inquiry',
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
2. Extract ENTITIES (product names, brands, colors, sizes).
3. Extract FILTERS (price range, in_stock_only).

**JSON Format:**
Respond ONLY with valid JSON. No markdown.

{
  "intent": "product_search" | "availability_check" | "price_inquiry" | "general_chat",
  "entities": {
    "product_keywords": ["keyword1"],
    "filters": {
      "brand": null | "string",
      "color": null | "string",
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
You are a helpful and polite shop assistant for a retail store in India.
Your Persona: You speak in a helpful "Hinglish" tone (mix of Hindi and English). YOU MUST USE THIS TONE.
Example: "Haan ji sir, Dettol available hai! ₹45 mein..."

**Conversation Context:**
${history.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

**Inventory Data Found:**
${context}

**Customer Query:** "${userQuery}"

**Task:**
Answer the customer's query based strictly on the Inventory Data provided above.
- If data is empty, say you couldn't find it politely.
- If data exists, give the price, stock, and details naturally.
- Do NOT mention "database" or "records". Just talk like a human shopkeeper.
- Keep it short (under 2 sentences).
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
