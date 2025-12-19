# Blockchain Setup Guide

## 🎯 Quick Start

You've deployed the `InventoryAudit` smart contract! Now follow these steps to connect it to your backend.

---

## Step 1: Install Dependencies

```bash
cd d:\projects\Startup\inventory-system
npm install ethers
```

---

## Step 2: Configure Environment Variables

Edit your `.env` file and add:

```env
# Blockchain Configuration
BLOCKCHAIN_ENABLED=true
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
BACKEND_PRIVATE_KEY=0xYOUR_BACKEND_WALLET_PRIVATE_KEY
CHAIN_ID=11155111
```

### Getting the Values:

**1. ETHEREUM_RPC_URL:**
- **Option A (Infura):**  
  1. Go to [https://infura.io](https://infura.io)
  2. Sign up and create a project
  3. Copy the Sepolia endpoint URL
  
- **Option B (Alchemy):**  
  1. Go to [https://www.alchemy.com](https://www.alchemy.com)
  2. Create a Sepolia app
  3. Copy the HTTPS endpoint

**2. CONTRACT_ADDRESS:**
- Copy the contract address from your deployment transaction
- It will look like: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8`

**3. BACKEND_PRIVATE_KEY:**
- This is the private key of the wallet that deployed the contract
- **⚠️ NEVER share this or commit it to Git!**
- Export from MetaMask: Account Details → Export Private Key

**4. CHAIN_ID:**
- **Sepolia Testnet:** 11155111
- **Ethereum Mainnet:** 1
- **Polygon:** 137

---

## Step 3: Test the Connection

Start your backend:

```bash
npm run dev
```

You should see:

```
✅ Blockchain connected successfully
📍 Contract Address: 0x...
🔗 Network: Sepolia Testnet
📊 Total blockchain events: 0
💰 Wallet balance: 0.5 ETH
```

---

## Step 4: Test API Endpoints

### Get Blockchain Stats

```bash
curl http://localhost:5000/blockchain/stats
```

Expected response:
```json
{
  "enabled": true,
  "totalEvents": 0,
  "contractAddress": "0x...",
  "network": "Sepolia Testnet"
}
```

### Add a Product (Auto-logs to Blockchain)

```bash
curl -X POST http://localhost:5000/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "custom_name": "Test Product",
    "sku": "TEST-001",
    "price": 100,
    "quantity": 10
  }'
```

Check console - you should see:
```
🔗 Recording to blockchain: ProductAdded | SKU: TEST-001
⏳ Transaction sent: 0x...
✅ Transaction confirmed in block 12345678
```

### Get Blockchain History for SKU

```bash
curl http://localhost:5000/blockchain/history/TEST-001
```

---

## Step 5: Verify on Blockchain Explorer

Visit [https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS](https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS)

You'll see:
- All transactions
- Events emitted
- Contract state

---

## Files Created

✅ `/src/config/contractABI.json` - Smart contract interface  
✅ `/src/config/blockchain.js` - Blockchain connection setup  
✅ `/src/services/blockchainService.js` - Business logic for blockchain interactions  
✅ `/src/routes/blockchainRoutes.js` - API endpoints for blockchain queries  
✅ Updated `/src/controllers/inventoryController.js` - Auto-logs to blockchain  
✅ Updated `/src/app.js` - Registered blockchain routes  
✅ Updated `/.env.example` - Added blockchain variables  

---

## API Endpoints Added

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/blockchain/stats` | GET | Get blockchain connection status |
| `/blockchain/history/:sku` | GET | Get audit history for a SKU |
| `/blockchain/event/:id` | GET | Get specific event by ID |
| `/blockchain/verify` | POST | Verify transaction hash |

---

## How It Works

### Automatic Blockchain Logging

When you perform inventory actions, the backend:

1. **Writes to Database** (Supabase) - FAST  
   User gets immediate response

2. **Writes to Blockchain** (Async) - SLOWER  
   Immutable audit trail created in background

Example:
```javascript
// In inventoryController.js
const { data } = await supabase.insert(...); // DB write
blockchainService.recordActionAsync(...);    // Blockchain write (async)
res.json(data); // Instant response to user
```

### Event Types Logged

- `ProductAdded` - When new product added to inventory
- `StockAdjusted` - When quantity changes
- `ProductRemoved` - When product deleted

---

## Cost Considerations

### Testnet (Sepolia):
- ✅ **FREE** - Get test ETH from faucets
- ✅ Perfect for development and testing
- Faucet: [https://sepoliafaucet.com](https://sepoliafaucet.com)

### Mainnet (Ethereum):
- ⚠️ **EXPENSIVE** - $3-10 per transaction
- 💡 **Use Polygon instead** - 1000x cheaper
- 💡 **Or Layer 2** (Arbitrum, Optimism) - 100x cheaper

---

## Troubleshooting

### "Blockchain not enabled"
- Check `BLOCKCHAIN_ENABLED=true` in `.env`
- Restart the server

### "Unauthorized: Only Admin can log events"
- The wallet private key doesn't match the contract owner
- Deploy contract with the same wallet as `BACKEND_PRIVATE_KEY`

### "Insufficient funds"
- Your wallet has no ETH
- Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com)

### "Invalid CONTRACT_ADDRESS format"
- Address must start with `0x`
- Must be 42 characters long

---

## Next Steps

1. ✅ **Test locally** with Sepolia testnet
2. ✅ **Deploy frontend** to query blockchain endpoints
3. ✅ **Add event listeners** for real-time updates (optional)
4. ✅ **Switch to Polygon** for lower gas fees (production)

---

## Security Checklist

- [x] `.env` file in `.gitignore`
- [ ] Separate wallets for dev/staging/prod
- [ ] Use environment-specific env files
- [ ] Monitor wallet balance alerts
- [ ] Set gas price limits
- [ ] Use multi-sig for production

---

**Congratulations! Your blockchain integration is complete!** 🎉

Your inventory system now has an immutable audit trail that no one can tamper with.
