const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { searchCatalog, getWholesalerInfo } = require('../controllers/catalogController');
const { getMyInventory, addToInventory, updateInventory, removeInventory, getEscalations } = require('../controllers/inventoryController');

// Catalog Routes (Common DB)
router.get('/catalog', protect, searchCatalog);
router.get('/catalog/:id/wholesaler', protect, getWholesalerInfo);

// Inventory Routes (Private DB)
router.route('/inventory')
    .get(protect, getMyInventory)
    .post(protect, addToInventory);

router.route('/inventory/:id')
    .put(protect, updateInventory)
    .put(protect, updateInventory)
    .delete(protect, removeInventory);

// Escalation Routes
router.get('/escalations', protect, getEscalations);

// Image Analysis Route (Multer Config)
const multer = require('multer');
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
const { chat, analyzeImage } = require('../controllers/aiController');

router.post('/ai/analyze-image', protect, upload.single('image'), analyzeImage);

module.exports = router;
