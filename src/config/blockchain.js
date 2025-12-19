const { ethers } = require("ethers");
const contractABI = require("./contractABI.json");

/**
 * Blockchain Configuration
 * Handles connection to Ethereum network and smart contract initialization
 */

class BlockchainConfig {
  constructor() {
    this.enabled = process.env.BLOCKCHAIN_ENABLED === "true";
    this.provider = null;
    this.wallet = null;
    this.contract = null;

    if (this.enabled) {
      this.initialize();
    } else {
      console.log(
        "⚠️  Blockchain disabled. Set BLOCKCHAIN_ENABLED=true to enable."
      );
    }
  }

  initialize() {
    try {
      // Validate required environment variables
      this.validateEnvVars();

      // Connect to Ethereum network
      this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);

      // Create wallet instance from private key
      this.wallet = new ethers.Wallet(
        process.env.BACKEND_PRIVATE_KEY,
        this.provider
      );

      // Initialize contract instance
      this.contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        contractABI,
        this.wallet
      );

      console.log("✅ Blockchain connected successfully");
      console.log(`📍 Contract Address: ${process.env.CONTRACT_ADDRESS}`);
      console.log(
        `🔗 Network: ${
          process.env.ETHEREUM_RPC_URL.includes("sepolia")
            ? "Sepolia Testnet"
            : "Custom Network"
        }`
      );

      // Test connection
      this.testConnection();
    } catch (error) {
      console.error("❌ Blockchain initialization failed:", error.message);
      this.enabled = false; // Disable if init fails
    }
  }

  validateEnvVars() {
    const required = [
      "ETHEREUM_RPC_URL",
      "CONTRACT_ADDRESS",
      "BACKEND_PRIVATE_KEY",
    ];

    const missing = required.filter((varName) => !process.env[varName]);

    if (missing.length > 0) {
      throw new Error(`Missing blockchain env vars: ${missing.join(", ")}`);
    }

    // Validate contract address format
    if (!ethers.isAddress(process.env.CONTRACT_ADDRESS)) {
      throw new Error("Invalid CONTRACT_ADDRESS format");
    }
  }

  async testConnection() {
    try {
      const totalEvents = await this.contract.getTotalEvents();
      console.log(`📊 Total blockchain events: ${totalEvents.toString()}`);

      const balance = await this.provider.getBalance(this.wallet.address);
      console.log(`💰 Wallet balance: ${ethers.formatEther(balance)} ETH`);

      if (balance === 0n) {
        console.warn(
          "⚠️  Warning: Wallet has zero balance! Transactions will fail."
        );
      }
    } catch (error) {
      console.error("⚠️  Connection test failed:", error.message);
    }
  }

  getContract() {
    if (!this.enabled || !this.contract) {
      throw new Error("Blockchain not enabled or contract not initialized");
    }
    return this.contract;
  }

  isEnabled() {
    return this.enabled;
  }
}

// Singleton pattern - create one instance
const blockchainConfig = new BlockchainConfig();

module.exports = blockchainConfig;
