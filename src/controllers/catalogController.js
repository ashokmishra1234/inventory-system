const supabase = require('../config/supabase');

// @desc    Search Master Catalog
// @route   GET /api/catalog?search=iphone
// @access  Private (Retailers)
const searchCatalog = async (req, res) => {
  const { search } = req.query;

  try {
    let query = supabase
      .from('master_catalog')
      .select('*')
      .limit(20);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get Wholesaler Info for Restock
// @route   GET /api/catalog/:id/wholesaler
// @access  Private
const getWholesalerInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
        .from('master_catalog')
        .select('wholesaler_info, standard_price')
        .eq('id', id)
        .single();
    
    if (error) throw error;

    res.json(data);
  } catch (err) {
      res.status(404).json({ message: 'Item not found in master catalog' });
  }
}

module.exports = { searchCatalog, getWholesalerInfo };
