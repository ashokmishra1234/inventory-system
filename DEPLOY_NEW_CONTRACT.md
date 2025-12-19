# 🚀 Step-by-Step: Deploy New Contract with Your Wallet

## ✅ Prerequisites Check

Before starting, make sure:
- [ ] You have MetaMask installed
- [ ] Your wallet has Sepolia ETH (at least 0.01 ETH)
- [ ] Your wallet address is: `0x66F7246722bB2dA33d45037a24e8655b15437250`

**Need Sepolia ETH?**
Get free from: https://sepoliafaucet.com

---

## 📋 Step-by-Step Deployment

### Step 1: Open Remix IDE

1. Go to: **https://remix.ethereum.org**
2. Wait for it to load

---

### Step 2: Create New Contract File

1. In the left sidebar, click **"File Explorer"** (folder icon)
2. Click the **"+"** icon to create new file
3. Name it: `InventoryAudit.sol`
4. Click "OK"

---

### Step 3: Paste Your Contract Code

Copy and paste this EXACT code into the editor:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract InventoryAudit {
    
    // --- Data Structures ---

    // Defines the structure of a single inventory event
    struct InventoryEvent {
        uint256 id;             // Unique Event ID
        string actionType;      // e.g., "ProductAdded", "StockAdjusted"
        string sku;             // Product Identifier
        int256 quantityChange;  // Positive for Add, Negative for Sale
        string actorId;         // User ID (from Supabase/Auth)
        string metaData;        // JSON string for extra data (e.g., AI Confidence)
        uint256 timestamp;      // Block timestamp
    }

    // --- Storage ---
    
    // Global list of all events for linear auditing
    InventoryEvent[] public allEvents;

    // Mapping to quickly fetch history for a specific product (SKU)
    mapping(string => uint256[]) private skuToEventIds;

    // Owner of the contract (The Admin/Backend System)
    address public owner;

    // --- Events ---
    // Emitted when a new log is added (useful for external listeners)
    event LogAdded(uint256 indexed eventId, string indexed sku, string actionType, uint256 timestamp);

    // --- Modifiers ---
    
    // Ensures only the deployed backend can write to this ledger
    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized: Only Admin can log events");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // --- Core Functions ---

    /**
     * @dev Main function to record an inventory action.
     * Corresponds to "Transaction Creation" workflow.
     */
    function recordAction(
        string memory _actionType,
        string memory _sku,
        int256 _quantityChange,
        string memory _actorId,
        string memory _metaData
    ) public onlyOwner {
        
        uint256 newEventId = allEvents.length;

        // Create the event object
        InventoryEvent memory newEvent = InventoryEvent({
            id: newEventId,
            actionType: _actionType,
            sku: _sku,
            quantityChange: _quantityChange,
            actorId: _actorId,
            metaData: _metaData,
            timestamp: block.timestamp // Automatic proof of time
        });

        // Store in global array
        allEvents.push(newEvent);

        // Map SKU to this Event ID for fast lookup
        skuToEventIds[_sku].push(newEventId);

        // Emit standard Solidity event
        emit LogAdded(newEventId, _sku, _actionType, block.timestamp);
    }

    /**
     * @dev Fetch the entire audit history for a specific Product (SKU).
     * Corresponds to "Data Fetching" workflow.
     */
    function getHistoryBySku(string memory _sku) public view returns (InventoryEvent[] memory) {
        uint256[] memory eventIds = skuToEventIds[_sku];
        InventoryEvent[] memory history = new InventoryEvent[](eventIds.length);

        for (uint256 i = 0; i < eventIds.length; i++) {
            history[i] = allEvents[eventIds[i]];
        }

        return history;
    }

    /**
     * @dev Get total count of events recorded.
     */
    function getTotalEvents() public view returns (uint256) {
        return allEvents.length;
    }
}
```

Press `Ctrl + S` to save.

---

### Step 4: Compile the Contract

1. Click **"Solidity Compiler"** icon in left sidebar (looks like "S")
2. **Important:** Select compiler version: **`0.8.18`**
3. Click **"Compile InventoryAudit.sol"** button
4. ✅ You should see a green checkmark

**If you see errors:**
- Make sure compiler version is exactly `0.8.18`
- Check that you copied the entire contract code

---

### Step 5: Connect MetaMask

1. Click **"Deploy & Run Transactions"** icon (looks like Ethereum logo)
2. **IMPORTANT:** In "Environment" dropdown, select:
   - **"Injected Provider - MetaMask"**
3. MetaMask will pop up
4. **Select your wallet:** `0x66F7246722bB2dA33d45037a24e8655b15437250`
5. Click "Connect"
6. ✅ You should see your wallet address displayed

**Verify:**
- Network shows: "Sepolia (11155111)"
- Account shows: `0x66F7...7250`

---

### Step 6: Deploy the Contract

1. Under "Contract" dropdown, select **"InventoryAudit"**
2. Click the orange **"Deploy"** button
3. MetaMask will pop up showing:
   ```
   Contract Deployment
   Estimated gas: ~500,000
   Gas fee: ~0.001 ETH
   ```
4. Click **"Confirm"** in MetaMask
5. ⏳ Wait 10-30 seconds for deployment

**You'll see:**
```
creation of InventoryAudit pending...
[block: XXXXX txIndex: XX]
contract DEPLOYED at address: 0x...
```

---

### Step 7: Copy Contract Address

1. Look at **"Deployed Contracts"** section (bottom left)
2. You'll see: **"INVENTORYAUDIT AT 0x..."**
3. Click the **copy icon** next to the address
4. ✅ Contract address copied!

**It will look like:**
```
0xABC123def456...
```

---

### Step 8: Update Your .env File

1. Open: `d:\projects\Startup\inventory-system\.env`
2. Find the line:
   ```env
   CONTRACT_ADDRESS=0xf621D2132E0321fB0089b4B9dc292167576f6186
   ```
3. Replace with your NEW contract address:
   ```env
   CONTRACT_ADDRESS=0xYOUR_NEW_CONTRACT_ADDRESS_FROM_STEP_7
   ```
4. Save the file

---

### Step 9: Restart Backend

1. Stop the current backend:
   ```bash
   # Press Ctrl+C in the backend terminal
   # Or run:
   ./stop-servers.bat
   ```

2. Start backend again:
   ```bash
   ./start-server.bat
   ```

3. ✅ Check the output:
   ```
   ✅ Blockchain connected successfully
   📍 Contract Address: 0xYOUR_NEW_ADDRESS
   🔗 Network: Sepolia Testnet
   💰 Wallet balance: X.XX ETH
   📊 Total blockchain events: 0
   ```

**No more errors!**

---

### Step 10: Test It!

1. Open frontend: http://localhost:5173
2. Login
3. Click "My Inventory"
4. Add a test product:
   ```
   Name: Test Product
   SKU: TEST-001
   Price: 100
   Quantity: 5
   ```
5. Click "Save"

**Check backend console:**
```
🔗 Recording to blockchain: ProductAdded | SKU: TEST-001
⏳ Transaction sent: 0x...
✅ Transaction confirmed in block XXXXX
```

**✅ Success! No errors!**

---

### Step 11: Verify on Blockchain

1. Go to "Blockchain Audit" page
2. Total Events should show: **1**
3. Click "View on Etherscan"
4. ✅ You'll see your NEW contract with your transaction!

---

## ✅ Verification Checklist

After deployment, verify:
- [ ] New contract deployed successfully
- [ ] Contract address copied
- [ ] `.env` updated with new address
- [ ] Backend restarted
- [ ] No errors in console
- [ ] Test product added successfully
- [ ] Blockchain transaction confirmed
- [ ] Event count increased on blockchain page

---

## 🆘 Troubleshooting

### Issue: "Insufficient funds"
**Solution:** Get Sepolia ETH from https://sepoliafaucet.com

### Issue: "Wrong network"
**Solution:** Switch MetaMask to Sepolia network

### Issue: "Contract not found"
**Solution:** Make sure you copied the full address (starts with 0x)

### Issue: Backend still shows old address
**Solution:** 
1. Stop all servers: `./stop-servers.bat`
2. Verify `.env` has new address
3. Restart: `./start-server.bat`

---

## 🎉 Success Criteria

You'll know it worked when:
- ✅ Backend starts without blockchain errors
- ✅ Can add products without transaction reverts
- ✅ Backend console shows: "✅ Transaction confirmed"
- ✅ Blockchain page shows increasing event count
- ✅ New contract visible on Etherscan

---

**Ready? Let's do this!** 🚀

**Start at Step 1 and work through each step carefully.**

Let me know when you've deployed the new contract and I'll help you verify it's working!
