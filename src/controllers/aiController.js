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

        console.log('🤖 AI Response Entities:', JSON.stringify(entities, null, 2));

        // --- TWO-PHASE SEARCH STRATEGY ---
        let data = [];
        let error = null;

        // Phase 1: Strict Search (If product_name is provided)
        if (entities.product_name) {
            console.log('🔍 Phase 1: Strict Search for:', entities.product_name);
            let strictQuery = queryBuilder.ilike('custom_name', `%${entities.product_name}%`);
            
            // Apply other filters to strict query
            if (entities.filters?.price_range?.max) strictQuery = strictQuery.lte('price', entities.filters.price_range.max);
            if (entities.filters?.in_stock_only) strictQuery = strictQuery.gt('quantity', 0);

            const result = await strictQuery.limit(5);
            if (result.error) throw result.error;
            data = result.data;
        }

        // Phase 2: Fallback / Broad Search (If Phase 1 found nothing OR no specific name)
        if (!data || data.length === 0) {
            console.log('🔍 Phase 2: Broad/Fallback Search');
            // Reset query builder
            let broadQuery = supabase.from('retailer_inventory').select('*').eq('retailer_id', req.user.id);
            
            // logic: search for the first word of product_name or use attributes
            let searchTerm = null;
            if (entities.product_name) {
                searchTerm = entities.product_name.split(' ')[0]; // e.g. "Redmi", "Milton"
            } else if (entities.product_keywords && entities.product_keywords.length > 0) {
                searchTerm = entities.product_keywords[0];
            }

            if (searchTerm) {
                 broadQuery = broadQuery.ilike('custom_name', `%${searchTerm}%`);
            }

            // Apply filters
            if (entities.filters?.price_range?.max) broadQuery = broadQuery.lte('price', entities.filters.price_range.max);
            if (entities.filters?.in_stock_only) broadQuery = broadQuery.gt('quantity', 0);
            
            const result = await broadQuery.limit(10);
            if (result.error) throw result.error;
            data = result.data;
        }
        

        
        systemResponse.data = data;

        // --- DISCOUNT ESCALATION LOGIC ---
        if (aiResponse.intent === 'discount_inquiry' && data.length > 0) {
            const product = data[0]; 
            // Check for explicitly requested discount (either from local regex or AI/attributes)
            let requested = aiResponse.entities.requested_discount;
            
            // Fallback: try to parseInt from attributes if not set (e.g. "50%")
            if (!requested && aiResponse.entities.attributes) {
                const attr = aiResponse.entities.attributes.find(a => a.includes('%'));
                if (attr) requested = parseInt(attr);
            }

            // Default max discount from DB or 0
            const maxDiscount = product.discount_rules?.max_percent || 0;

            // If user asked for a specific amount and it exceeds limit
            if (requested && requested > maxDiscount) {
                console.log(`⚠️ Escalation Triggered: Request ${requested}% > Max ${maxDiscount}%`);
                
                const escalationId = `ESCL-${Date.now()}`;
                
                const { error: insertError } = await supabase
                    .from('discount_escalations')
                    .insert({
                        escalation_id: escalationId,
                        product_id: product.id,
                        product_name: product.custom_name || product.name,
                        requested_discount: requested,
                        allowed_discount: maxDiscount,
                        retailer_id: req.user.id,
                        status: 'PENDING'
                    });

                if (!insertError) {
                     // Override response for escalation
                     systemResponse.type = "ESCALATION_CREATED";
                     systemResponse.message = `Requested discount (${requested}%) exceeds the allowed limit (${maxDiscount}%). An escalation request (#${escalationId}) has been sent for approval.`;
                     systemResponse.escalationId = escalationId;
                     systemResponse.status = "PENDING";
                     systemResponse.allowedDiscount = maxDiscount;
                     
                     // Return immediately (Skip AI personality / Negotiation)
                     return res.json(systemResponse);
                } else {
                    console.error('Failed to create escalation:', insertError);
                    
                    // Return error to user to help debugging (since we are in dev mode)
                    systemResponse.message = `⚠️ **System Error:** Could not process escalation request.\n\n**Reason:** ${insertError.message || "Database Insert Failed"}.\n\n*Target Table:* \`discount_escalations\`\n*Hint:* Did you run the migration SQL?`;
                    return res.json(systemResponse);
                }
            }
        }
        
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
