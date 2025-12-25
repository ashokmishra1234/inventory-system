const supabase = require('../config/supabase');
const Joi = require('joi');
const blockchainService = require('../services/blockchainService');

// @desc    Get My Inventory
// @route   GET /api/inventory
// @access  Private (Retailer)
const getMyInventory = async (req, res) => {
  try {
    // Current user's ID is the retailer_id (RLS enforced)
    const { data, error } = await supabase
      .from('retailer_inventory')
      .select(`
        *,
        master_catalog (
            sku,
            name,
            category,
            wholesaler_info
        )
      `)
      .eq('retailer_id', req.user.id); // Double check, though RLS handles it

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add Item to Inventory (From Catalog or Custom)
// @route   POST /api/inventory
// @access  Private
const addToInventory = async (req, res) => {
  const schema = Joi.object({
    catalog_item_id: Joi.string().uuid().optional(), // Link to Master
    custom_name: Joi.string().required(),
    sku: Joi.string().required(),
    price: Joi.number().required().min(0),
    quantity: Joi.number().integer().min(0).default(0),
    low_stock_threshold: Joi.number().integer().min(0).default(5),
    discount_rules: Joi.object({
        max_percent: Joi.number().min(0).max(100).default(0),
        approval_required: Joi.boolean().default(false)
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
      const { data, error: dbError } = await supabase
        .from('retailer_inventory')
        .insert([{
            ...req.body,
            retailer_id: req.user.id // Link to this user
        }])
        .select()
        .single();
    
    if (dbError) throw dbError;

    // Log to blockchain (async - don't wait)
    blockchainService.recordActionAsync(
      'ProductAdded',
      req.body.sku,
      req.body.quantity || 0,
      req.user.id,
      {
        productName: req.body.custom_name,
        price: req.body.price,
        catalogLinked: !!req.body.catalog_item_id
      }
    );

    res.status(201).json(data);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// @desc    Update Inventory (Price/Qty/Discount)
// @route   PUT /api/inventory/:id
// @access  Private
const updateInventory = async (req, res) => {
    const { id } = req.params;
    
    try {
        const { data, error } = await supabase
            .from('retailer_inventory')
            .update(req.body)
            .eq('id', id)
            .eq('retailer_id', req.user.id) // Security check
            .select()
            .single();

        if (error) throw error;
        
        // Log to blockchain if quantity changed
        if (req.body.quantity !== undefined) {
            blockchainService.recordActionAsync(
                'StockAdjusted',
                data.sku,
                req.body.quantity - (data.quantity || 0), // Calculate change
                req.user.id,
                {
                    oldQuantity: data.quantity,
                    newQuantity: req.body.quantity,
                    reason: 'Manual adjustment'
                }
            );
        }
        
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: 'Update failed' });
    }
};

// @desc    Delete Item
// @route   DELETE /api/inventory/:id
// @access  Private
const removeInventory = async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('retailer_inventory')
            .delete()
            .eq('id', id)
            .eq('retailer_id', req.user.id); // Security check

        if (error) throw error;
        
        // Log to blockchain
        blockchainService.recordActionAsync(
            'ProductRemoved',
            id, // Use ID as SKU identifier
            0,
            req.user.id,
            {
                reason: 'Deleted by user'
            }
        );
        
        res.json({ message: 'Item removed' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed' });
    }
};

// @desc    Get Discount Escalations
// @route   GET /api/escalations
// @access  Private
const getEscalations = async (req, res) => {
    try {
        console.log(`🔍 Fetching escalations for Retailer ID: ${req.user.id}`);

        const { data, error } = await supabase
            .from('discount_escalations')
            .select('*')
            .eq('retailer_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("❌ Fetch Error:", error);
            throw error;
        }

        console.log(`✅ Found ${data?.length || 0} escalations.`);
        res.json(data);
    } catch (err) {
        console.error("❌ Controller Error:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getMyInventory, addToInventory, updateInventory, removeInventory, getEscalations };
