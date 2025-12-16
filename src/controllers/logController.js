const supabase = require('../config/supabase');
const logInventoryAction = require('../utils/logUtils');
const Joi = require('joi');

const getLogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inventory_logs')
      .select('*, products(name, sku)')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createLog = async (req, res) => {
  // Manual log entry (e.g., from external audit)
  const schema = Joi.object({
    product_id: Joi.string().uuid().required(),
    action: Joi.string().valid('add', 'remove', 'update').required(),
    quantity: Joi.number().integer().required(),
    source: Joi.string().valid('web', 'desktop', 'ai', 'api').default('api')
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { product_id, action, quantity, source } = req.body;

  try {
    await logInventoryAction(product_id, action, quantity, source);
    res.status(201).json({ message: 'Log entry created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLogs, createLog };
