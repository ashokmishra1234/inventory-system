const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, admin, manager } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.post('/', protect, manager, createProduct); // Managers and Admins can create
router.put('/:id', protect, manager, updateProduct);
router.delete('/:id', protect, admin, deleteProduct); // Only Admin can delete

module.exports = router;
