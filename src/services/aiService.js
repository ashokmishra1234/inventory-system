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
        // Use a model optimized for speed and cost, similar to flash-lite
        this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
    
    instance = this;
  }

  async detectIntent(userQuery, history = []) {
    if (!this.model) {
      throw new Error('AI Service not initialized - Missing API Key');
    }

    try {
      const prompt = this._buildIntentPrompt(userQuery, history);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this._parseResponse(text);
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback response
      return {
        intent: 'unknown',
        sub_intent: 'error_fallback',
        entities: { product_keywords: [], filters: {} },
        user_message: "I'm having trouble connecting to my brain right now. Please try again."
      };
    }
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
