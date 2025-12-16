const supabase = require('../config/supabase');
const Joi = require('joi');
const logInventoryAction = require('../utils/logUtils');

const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) return res.status(404).json({ message: 'Product not found' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    sku: Joi.string().required(),
    description: Joi.string().allow('', null),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().integer().min(0).default(0),
    location: Joi.string().allow('', null)
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { data, error: dbError } = await supabase
      .from('products')
      .insert([req.body])
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);

    // Auto-log initial inventory
    if (data.quantity > 0) {
      await logInventoryAction(data.id, 'add', data.quantity, 'api');
    }

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  
  try {
    // 1. Fetch current product to compare quantity
    const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    
    if (fetchError || !currentProduct) return res.status(404).json({ message: 'Product not found' });

    // 2. Update product
    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // 3. Log if quantity changed
    if (req.body.quantity !== undefined && req.body.quantity !== currentProduct.quantity) {
        const diff = req.body.quantity - currentProduct.quantity;
        const action = diff > 0 ? 'add' : 'remove';
        // Log absolute difference
        await logInventoryAction(data.id, action, Math.abs(diff), 'api');
    } else if (JSON.stringify(req.body) !== JSON.stringify(currentProduct)) {
        // Log general update? The requirement says action (add, remove, update). 
        // If we just updated price/desc, maybe log 'update' with 0 qty?
        // Let's log 'update' with 0 quantity to signify details change.
        await logInventoryAction(data.id, 'update', 0, 'api');
    }

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
