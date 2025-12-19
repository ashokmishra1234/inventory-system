const express = require('express');
const blockchainService = require('../services/blockchainService');
const router = express.Router();

/**
 * Blockchain Routes
 * Provides read-only access to blockchain audit data
 */

// @route   GET /blockchain/history/:sku
// @desc    Get complete audit history for a product
// @access  Public (consider adding auth in production)
router.get('/history/:sku', async (req, res, next) => {
  try {
    const { sku } = req.params;
    
    if (!sku) {
      return res.status(400).json({ message: 'SKU is required' });
    }

    const history = await blockchainService.getHistoryBySku(sku);

    if (history.error) {
      return res.status(500).json({ 
        message: 'Failed to fetch blockchain history',
        error: history.error 
      });
    }

    res.json({
      sku,
      totalEvents: history.length,
      events: history
    });

  } catch (error) {
    next(error);
  }
});

// @route   GET /blockchain/event/:id
// @desc    Get a specific event by ID
// @access  Public
router.get('/event/:id', async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await blockchainService.getEventById(eventId);

    if (event.error) {
      return res.status(404).json({ 
        message: 'Event not found',
        error: event.error 
      });
    }

    res.json(event);

  } catch (error) {
    next(error);
  }
});

// @route   GET /blockchain/stats
// @desc    Get blockchain statistics
// @access  Public
router.get('/stats', async (req, res, next) => {
  try {
    const totalEvents = await blockchainService.getTotalEvents();

    if (totalEvents.error) {
      return res.status(500).json({ 
        message: 'Failed to fetch blockchain stats',
        error: totalEvents.error 
      });
    }

    res.json({
      enabled: blockchainService.isEnabled(),
      totalEvents,
      contractAddress: process.env.CONTRACT_ADDRESS,
      network: process.env.ETHEREUM_RPC_URL?.includes('sepolia') ? 'Sepolia Testnet' : 'Custom Network'
    });

  } catch (error) {
    next(error);
  }
});

// @route   POST /blockchain/verify
// @desc    Verify if a transaction hash exists
// @access  Public
router.post('/verify', async (req, res, next) => {
  try {
    const { transactionHash } = req.body;

    if (!transactionHash) {
      return res.status(400).json({ message: 'Transaction hash is required' });
    }

    // In a real implementation, you'd verify the transaction on-chain
    // For now, just return success
    res.json({
      verified: true,
      transactionHash,
      message: 'Transaction verification endpoint - implement full verification logic here'
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
