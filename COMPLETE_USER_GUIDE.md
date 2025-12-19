# 🚀 Complete User Guide: Blockchain-Integrated Inventory System

## 📋 Table of Contents
1. [Starting the System](#starting-the-system)
2. [User Registration & Login](#user-registration--login)
3. [Adding Products (Blockchain Logged)](#adding-products-blockchain-logged)
4. [Managing Inventory](#managing-inventory)
5. [Viewing Blockchain Audit Trail](#viewing-blockchain-audit-trail)
6. [Processing Sales (POS)](#processing-sales-pos)
7. [Verifying on Blockchain](#verifying-on-blockchain)
8. [Complete Workflows](#complete-workflows)

---

## 🎯 Starting the System

### Step 1: Start Backend Server

**Option A: Using Helper Script (Recommended)**
```bash
cd d:\projects\Startup\inventory-system
./start-server.bat
```

**Option B: Manual Start**
```bash
cd d:\projects\Startup\inventory-system
pnpm start
```

**Expected Output:**
```
✅ Blockchain connected successfully
📍 Contract Address: 0xf621D2132E0321fB0089b4B9dc292167576f6186
🔗 Network: Sepolia Testnet
💰 Wallet balance: 0.0397 ETH
Server running on port 5000
```

---

### Step 2: Start Frontend

**In a NEW terminal:**
```bash
cd d:\projects\Startup\inventory-system\frontend
pnpm dev
```

**Expected Output:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

### Step 3: Open Browser

Navigate to: **http://localhost:5173**

---

## 👤 User Registration & Login

### First Time Setup

1. **Go to:** http://localhost:5173

2. **Click "Sign Up"**

3. **Fill in the form:**
   - Name: `Your Name`
   - Email: `you@example.com`
   - Password: `password123`
   - Role: Select `Retailer`

4. **Click "Create Account"**

5. **You'll be auto-logged in** and redirected to Dashboard

---

### Returning Users

1. **Go to:** http://localhost:5173/login

2. **Enter credentials:**
   - Email: `you@example.com`
   - Password: `password123`

3. **Click "Login"**

---

## 📦 Adding Products (Blockchain Logged)

### Workflow: Add Your First Product

1. **Click "My Inventory"** in the sidebar

2. **Click "+ Add New Item"** button

3. **Fill in Product Details:**
   ```
   Product Name: Samsung Galaxy M10
   SKU: SB-M10-001
   Price: 12,999
   Quantity: 10
   Low Stock Alert: 5
   ```

4. **Click "Save"**

5. **What Happens (Behind the Scenes):**
   ```
   User clicks Save
       ↓
   ✅ Saved to Supabase Database (instant)
       ↓
   ✅ You see success message
       ↓
   🔗 Backend logs to blockchain (async)
       ↓
   ⛓️ Transaction sent to Sepolia network
       ↓
   ✅ Confirmed on blockchain (~10-30 seconds)
   ```

6. **Check Backend Console:**
   ```
   🔗 Recording to blockchain: ProductAdded | SKU: SB-M10-001
   ⏳ Transaction sent: 0x123abc...
   ✅ Transaction confirmed in block 6789012
   ```

7. **Your product is now:**
   - ✅ In the database (visible immediately)
   - ✅ On the blockchain (immutable record)

---

## 📊 Managing Inventory

### Update Stock (Also Blockchain Logged)

1. **Go to "My Inventory"**

2. **Find the product** you want to update

3. **Click "Edit" button**

4. **Change quantity:**
   - Old: `10`
   - New: `50`

5. **Click "Update"**

6. **Blockchain logs:**
   ```
   🔗 Recording to blockchain: StockAdjusted | SKU: SB-M10-001
   Old Quantity: 10
   New Quantity: 50
   Change: +40
   ```

---

### Delete Product (Blockchain Logged)

1. **Find product** in inventory

2. **Click "Delete" button**

3. **Confirm deletion**

4. **Blockchain logs:**
   ```
   🔗 Recording to blockchain: ProductRemoved | SKU: SB-M10-001
   Actor: your-user-id
   Reason: Deleted by user
   ```

---

## 🔗 Viewing Blockchain Audit Trail

### Access Blockchain Dashboard

1. **Click "Blockchain Audit"** in sidebar

2. **You'll see:**

   **Status Card:**
   - Status: ✅ Active (green)
   - Total Events: 3 (increases with each action)
   - Network: Sepolia Testnet
   - Contract: 0xf621D2132E0321fB0089b4B9dc292167576f6186

   **Information:**
   - What is blockchain audit (explanation)
   - What actions are logged
   - Benefits (immutability, transparency, etc.)

3. **Click "View on Etherscan"**
   - Opens blockchain explorer
   - Shows all your transactions
   - Public proof of all actions

---

## 💳 Processing Sales (POS/Billing)

### Complete Sales Flow

1. **Click "Billing / POS"** in sidebar

2. **Select products** to sell:
   - Click on product to add to cart
   - Adjust quantities if needed

3. **Review Cart:**
   - Total amount calculated
   - Taxes (if applicable)

4. **Choose Payment Method:**
   
   **Option A: Cash Payment**
   - Click "Pay Cash"
   - Sale recorded instantly
   - Stock automatically reduced
   - ✅ Blockchain logs transaction

   **Option B: Online Payment (Razorpay)**
   - Click "Pay Online"
   - Razorpay payment modal opens
   - Enter test card details:
     ```
     Card: 4111 1111 1111 1111
     Expiry: Any future date
     CVV: 123
     ```
   - Payment processed
   - Stock automatically reduced
   - ✅ Blockchain logs transaction

5. **What Gets Logged:**
   ```
   ✅ Database: Transaction record
   🔗 Blockchain: Payment event with items
   ```

---

## 🔍 Verifying on Blockchain

### View Your Transactions on Etherscan

1. **Go to Blockchain page**

2. **Click "View on Etherscan"**

3. **On Etherscan, you'll see:**
   - **Transactions tab:** All your write operations
   - **Events tab:** All logged events
   - **Contract tab:** Smart contract code

4. **Click on any transaction:**
   ```
   Transaction Hash: 0x123abc...
   Status: Success ✅
   Block: 6789012
   From: Your wallet
   To: Contract address
   Gas Used: 150,000
   ```

5. **View Event Details:**
   ```
   Event: LogAdded
   eventId: 0
   sku: SB-M10-001
   actionType: ProductAdded
   timestamp: 1734598034
   ```

---

## 📝 Complete Workflows

### Workflow 1: New Product Lifecycle

```
1. Add Product
   ├─ Saved to database
   ├─ Logged to blockchain: ProductAdded
   └─ Event #1 created

2. Update Stock (restock)
   ├─ Updated in database
   ├─ Logged to blockchain: StockAdjusted
   └─ Event #2 created

3. Sell Product (billing)
   ├─ Transaction in database
   ├─ Stock reduced
   ├─ Logged to blockchain: PaymentCompleted
   └─ Event #3 created

4. Delete Product (discontinue)
   ├─ Removed from database
   ├─ Logged to blockchain: ProductRemoved
   └─ Event #4 created
```

**Blockchain Audit Trail:**
- Event #1: Product added with 10 qty
- Event #2: Stock adjusted to 50 qty
- Event #3: Sold 5 units
- Event #4: Product discontinued

**All events are permanent and tamper-proof!**

---

### Workflow 2: Daily Operations

**Morning:**
1. Login to system
2. Check inventory levels
3. Add new stock received
   - ✅ Each addition logged to blockchain

**During Day:**
4. Process sales via POS
   - Cash sales: Instant
   - Online payments: Razorpay
   - ✅ Each sale logged to blockchain

**Evening:**
5. View "Blockchain Audit" page
6. See total events for the day
7. Verify on Etherscan (optional)

**End of Month:**
8. Export blockchain history
9. Use for:
   - Audit reports
   - Tax compliance
   - Investor transparency

---

### Workflow 3: Multi-User Scenario

**Retailer 1:**
- Adds products: `[A, B, C]`
- Blockchain logs: Actor = Retailer1-ID

**Retailer 2:**
- Adds products: `[X, Y, Z]`
- Blockchain logs: Actor = Retailer2-ID

**Admin:**
- Views all blockchain events
- Can trace who did what, when
- Complete audit trail

---

## 🎯 Key Features in Action

### 1. **Immutability**
- Once logged, cannot be changed
- Perfect audit trail
- Compliance-ready

**Try it:**
1. Add a product
2. Wait for blockchain confirmation
3. Try to modify that blockchain record
4. **Result:** Impossible! It's permanent

### 2. **Transparency**
- All events publicly verifiable
- Anyone can check Etherscan
- Build customer trust

**Try it:**
1. Add a product
2. Share Etherscan link with investor
3. They can verify your inventory actions
4. **Result:** Increased trust

### 3. **Auditability**
- Complete history of all actions
- Who, what, when for every change
- Regulatory compliance

**Try it:**
1. Perform multiple actions
2. Go to Blockchain page
3. See event count increase
4. Click "View on Etherscan"
5. **Result:** Complete audit log

---

## 🛠️ Troubleshooting

### Issue: "Blockchain shows 0 events"
**Solution:**
1. Check backend is running
2. Add a product to trigger logging
3. Wait 10-30 seconds
4. Refresh blockchain page

### Issue: "Cannot connect to blockchain"
**Solution:**
1. Check `.env` has correct values
2. Verify `BLOCKCHAIN_ENABLED=true`
3. Restart backend server

### Issue: "Transaction pending forever"
**Solution:**
1. Check wallet has Sepolia ETH
2. Get more from: https://sepoliafaucet.com
3. Restart backend

---

## 📊 System URLs

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:5173 |
| Login | http://localhost:5173/login |
| Dashboard | http://localhost:5173/ |
| Inventory | http://localhost:5173/inventory |
| Billing | http://localhost:5173/billing |
| Blockchain | http://localhost:5173/blockchain |
| Backend API | http://localhost:5000 |
| Blockchain Stats | http://localhost:5000/blockchain/stats |
| Your Contract | https://sepolia.etherscan.io/address/0xf621D2132E0321fB0089b4B9dc292167576f6186 |

---

## 🎊 Congratulations!

You now have a **fully functional blockchain-integrated inventory system**!

**What you can do:**
- ✅ Manage inventory with database speed
- ✅ Have tamper-proof blockchain audit trail
- ✅ Process payments (cash + online)
- ✅ Verify everything on public blockchain
- ✅ Comply with regulations
- ✅ Build customer trust

**Next Steps:**
1. Add real products
2. Process real sales
3. View blockchain history
4. Deploy to production
5. Scale your business!

---

*Your inventory system is production-ready!* 🚀
