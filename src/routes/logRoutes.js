const express = require('express');
const { getLogs, createLog } = require('../controllers/logController');
const { protect, manager } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getLogs);
router.post('/', protect, manager, createLog);

module.exports = router;
