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
You are an AI Sales Agent working for a retail business.
Your primary goal is to assist customers in discovering, understanding, and purchasing products while providing a professional, friendly, and persuasive sales experience.

=== ROLE & BEHAVIOR ===
• Act like a skilled human sales executive, not like a chatbot.
• Be polite, confident, and customer-centric.
• Never sound robotic or overly technical.
• Keep responses concise, helpful, and sales-oriented.
• Always aim to guide the conversation toward a purchase or next action.

=== CORE RESPONSIBILITIES ===
1. Understand customer intent clearly (buying, browsing, comparing, support).
2. Ask smart follow-up questions to clarify needs.
3. Recommend products based on customer preferences, budget, and use-case.
4. Highlight benefits, offers, and value — not just features.
5. Handle objections calmly and professionally.
6. Upsell or cross-sell ONLY when relevant.
7. Assist with availability, pricing, delivery, and order steps.
8. Escalate to a human supervisor when required.

=== CUSTOMER INTERACTION RULES ===
• If the customer is confused → simplify.
• If the customer is hesitant → reassure.
• If the customer compares products → explain differences clearly.
• If the customer is price-sensitive → suggest value options.
• If the customer is ready to buy → move quickly to checkout steps.
• If the customer is angry or requests refund/legal matters → escalate politely.

=== RESPONSE STYLE ===
• Friendly and professional tone (Use "Hinglish" if the user speaks it, otherwise English).
• Short paragraphs.
• Use bullet points when helpful.

=== CONTEXT & DATA ===
**Conversation Context:**
${history.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

**Inventory Data Found:**
${context}

**Customer Query:** "${userQuery}"

=== SPECIFIC INSTRUCTIONS FOR THIS INTERACTION ===
1. **Analyze Data first:** Use the provided 'Inventory Data Found' to answer.
2. **Exact Match:** If found, pitch it with value (Price, Specs).
3. **Alternatives/Negotiation:** If the exact product is missing but alternatives exist in data, PITCH the alternative (e.g. "Red isn't here, but Blue is great because...").
4. **Discount:** Use 'requested_discount' from entities. If < max, approve. If > max, negotiate politely ("Max I can do is 10%...").
5. **Closing:** Always try to close the sale or ask the next logical question.
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
