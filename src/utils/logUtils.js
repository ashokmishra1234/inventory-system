const supabase = require('../config/supabase');

const logInventoryAction = async (productId, action, quantity, source = 'api') => {
  try {
    const { error } = await supabase
      .from('inventory_logs')
      .insert([
        { product_id: productId, action, quantity, source }
      ]);
      
    if (error) console.error('Error logging inventory action:', error.message);
  } catch (err) {
    console.error('Logging system error:', err.message);
  }
};

module.exports = logInventoryAction;
