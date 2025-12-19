const blockchainConfig = require('../config/blockchain');

/**
 * Blockchain Service Layer
 * Provides high-level functions to interact with the InventoryAudit smart contract
 */

class BlockchainService {
  
  /**
   * Record an inventory action to the blockchain
   * @param {string} actionType - e.g., "ProductAdded", "StockAdjusted", "ProductRemoved"
   * @param {string} sku - Product identifier
   * @param {number} quantityChange - Change in quantity (positive or negative)
   * @param {string} actorId - User ID from Supabase
   * @param {object} metaData - Additional data (will be JSON stringified)
   * @returns {object} Transaction receipt or null if blockchain disabled
   */
  async recordAction(actionType, sku, quantityChange, actorId, metaData = {}) {
    // Skip if blockchain is disabled
    if (!blockchainConfig.isEnabled()) {
      console.log('🔕 Blockchain disabled - skipping recordAction');
      return null;
    }

    try {
      const contract = blockchainConfig.getContract();
      
      // Convert metadata to JSON string
      const metaDataString = JSON.stringify(metaData);

      console.log(`🔗 Recording to blockchain: ${actionType} | SKU: ${sku}`);

      // Call smart contract function
      const tx = await contract.recordAction(
        actionType,
        sku,
        quantityChange,
        actorId,
        metaDataString,
        {
          gasLimit: 500000 // Increased to prevent Out of Gas errors
        }
      );

      console.log(`⏳ Transaction sent: ${tx.hash}`);

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'success' : 'failed'
      };

    } catch (error) {
      console.error('❌ Blockchain recordAction failed:', error.message);
      
      // Graceful degradation - don't break the app if blockchain fails
      return {
        error: error.message,
        status: 'failed'
      };
    }
  }

  /**
   * Async wrapper to record action without blocking
   * Use this when you don't want to wait for blockchain confirmation
   */
  recordActionAsync(actionType, sku, quantityChange, actorId, metaData = {}) {
    // Fire and forget - runs in background
    this.recordAction(actionType, sku, quantityChange, actorId, metaData)
      .then(result => {
        if (result && result.status === 'success') {
          console.log(`✅ Blockchain logged: ${actionType} | ${sku}`);
        }
      })
      .catch(error => {
        console.error(`❌ Async blockchain log failed:`, error.message);
      });
  }

  /**
   * Get complete audit history for a specific product (SKU)
   * @param {string} sku - Product identifier
   * @returns {Array} Array of inventory events
   */
  async getHistoryBySku(sku) {
    if (!blockchainConfig.isEnabled()) {
      return { error: 'Blockchain not enabled' };
    }

    try {
      const contract = blockchainConfig.getContract();
      
      console.log(`🔍 Fetching blockchain history for SKU: ${sku}`);
      
      const history = await contract.getHistoryBySku(sku);

      // Convert BigInt to regular numbers and parse metadata
      const formattedHistory = history.map(event => ({
        id: Number(event.id),
        actionType: event.actionType,
        sku: event.sku,
        quantityChange: Number(event.quantityChange),
        actorId: event.actorId,
        metaData: this.parseMetaData(event.metaData),
        timestamp: Number(event.timestamp),
        date: new Date(Number(event.timestamp) * 1000).toISOString()
      }));

      return formattedHistory;

    } catch (error) {
      console.error('❌ getHistoryBySku failed:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Get total count of events recorded on blockchain
   * @returns {number} Total event count
   */
  async getTotalEvents() {
    if (!blockchainConfig.isEnabled()) {
      return { error: 'Blockchain not enabled' };
    }

    try {
      const contract = blockchainConfig.getContract();
      const total = await contract.getTotalEvents();
      return Number(total);
    } catch (error) {
      console.error('❌ getTotalEvents failed:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Get a specific event by ID
   * @param {number} eventId - Event ID
   * @returns {object} Event details
   */
  async getEventById(eventId) {
    if (!blockchainConfig.isEnabled()) {
      return { error: 'Blockchain not enabled' };
    }

    try {
      const contract = blockchainConfig.getContract();
      const event = await contract.allEvents(eventId);

      return {
        id: Number(event.id),
        actionType: event.actionType,
        sku: event.sku,
        quantityChange: Number(event.quantityChange),
        actorId: event.actorId,
        metaData: this.parseMetaData(event.metaData),
        timestamp: Number(event.timestamp),
        date: new Date(Number(event.timestamp) * 1000).toISOString()
      };

    } catch (error) {
      console.error('❌ getEventById failed:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Helper to parse metadata JSON string
   */
  parseMetaData(metaDataString) {
    try {
      return JSON.parse(metaDataString);
    } catch {
      return metaDataString; // Return as-is if not JSON
    }
  }

  /**
   * Check if blockchain is enabled
   */
  isEnabled() {
    return blockchainConfig.isEnabled();
  }
}

// Export singleton instance
module.exports = new BlockchainService();
