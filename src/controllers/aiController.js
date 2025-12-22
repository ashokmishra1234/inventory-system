const aiService = require('../services/aiService');
const sqlGenerator = require('../services/sqlGeneratorService');
const supabase = require('../config/supabase');

const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    // 1. Detect Intent using Gemini
    const aiResponse = await aiService.detectIntent(message, history);

    let systemResponse = {
      message: aiResponse.user_message || "Here is what I found:",
      data: null,
      intent: aiResponse.intent,
      entities: aiResponse.entities // Pass entities (including requested_discount)
    };

    // 2. If valid search intent, generate and run SQL
    if (aiResponse.requires_database && aiResponse.intent !== 'error_fallback') {
      try {
        const sqlQuery = sqlGenerator.generateSql(aiResponse);
        console.log('🤖 AI Generated SQL:', sqlQuery);

        // Execute via Supabase RPC or direct raw query if enabled, 
        // BUT Supabase JS client doesn't support raw SQL easily without RPC.
        // STRATEGY: We will map the 'conditions' logic to Supabase Filter Builder in a perfect world,
        // but for this 'Agent' port, we might need a custom RPC or a dynamic builder.
        // SIMPLIFICATION: We will use the Text Search approach since we can't accept raw SQL securely from client.
        // Wait, since we are on Backend, we can use the Service Role to run RPC or use dynamic filtering.
        
        // BETTER APPROACH FOR NODE.JS + SUPABASE: Build query dynamically using Supabase Query Builder
        // instead of raw SQL string. Refactoring logic slightly on the fly here to be safer/easier.
        
        // BETTER APPROACH: Query 'retailer_inventory' which holds the actual data shown in dashboard
        
        let queryBuilder = supabase.from('retailer_inventory').select('*').eq('retailer_id', req.user.id);
        const { entities } = aiResponse;

        // Apply filters
        console.log('🤖 AI Response:', JSON.stringify(aiResponse, null, 2));

        // Apply filters
        if (entities.product_keywords && entities.product_keywords.length) {
            const kw = entities.product_keywords[0]; 
            // Search in custom_name OR description (if it exists, otherwise just custom_name)
            // retailer_inventory usually has 'custom_name'
            queryBuilder = queryBuilder.ilike('custom_name', `%${kw}%`);
        }

        if (entities.filters) {
            const f = entities.filters;
            if (f.price_range?.max) queryBuilder = queryBuilder.lte('price', f.price_range.max);
            if (f.price_range?.min) queryBuilder = queryBuilder.gte('price', f.price_range.min);
            if (f.in_stock_only) queryBuilder = queryBuilder.gt('quantity', 0);
        }

        const { data, error } = await queryBuilder.limit(10);
        
        if (error) throw error;
        systemResponse.data = data;
        
        // 3. Generate Natural Language Response using RAG
        const naturalResponse = await aiService.generateResponse(
            message, 
            data, 
            history
        );

        if (naturalResponse) {
            systemResponse.message = naturalResponse;
        } else if (!data.length) {
             systemResponse.message = "I couldn't find any products matching that description.";
        }

      } catch (dbError) {
        console.error('Database Search Error:', dbError);
        systemResponse.message = "I understood your request, but had trouble searching the database.";
      }
    }

    res.json(systemResponse);

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  chat
};
