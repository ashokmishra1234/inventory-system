const supabase = require('../config/supabase');
const Joi = require('joi');

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
        res.json({ message: 'Item removed' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed' });
    }
};

module.exports = { getMyInventory, addToInventory, updateInventory, removeInventory };
