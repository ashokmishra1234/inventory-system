# 🎯 Quick Start Cheat Sheet

## 1️⃣ Start the System (2 steps)

```bash
# Terminal 1: Backend
cd d:\projects\Startup\inventory-system
./start-server.bat

# Terminal 2: Frontend  
cd d:\projects\Startup\inventory-system\frontend
pnpm dev
```

**Open:** http://localhost:5173

---

## 2️⃣ First Time Setup (30 seconds)

1. Click "Sign Up"
2. Fill: Name, Email, Password
3. Select Role: `Retailer`
4. Click "Create Account"
5. ✅ You're in!

---

## 3️⃣ Add Your First Product (1 minute)

1. Click **"My Inventory"** → **"+ Add New Item"**
2. Fill in:
   ```
   Name: Test Product
   SKU: TEST-001
   Price: 100
   Quantity: 10
   ```
3. Click "Save"
4. ✅ Saved to database (instant)
5. 🔗 Logging to blockchain (background)

**Check backend console:**
```
🔗 Recording to blockchain: ProductAdded | SKU: TEST-001
✅ Transaction confirmed
```

---

## 4️⃣ View Blockchain Proof (30 seconds)

1. Click **"Blockchain Audit"** in sidebar
2. See:
   - Status: ✅ Active
   - Total Events: 1 (increased!)
   - Your contract address
3. Click "View on Etherscan"
4. See your transaction on blockchain!

---

## 5️⃣ Process a Sale (1 minute)

1. Click **"Billing / POS"**
2. Click on your product to add to cart
3. Choose payment:
   - **Cash:** Click "Pay Cash" → Done!
   - **Online:** Use card `4111 1111 1111 1111`
4. ✅ Sale complete
5. 🔗 Logged to blockchain

---

## 6️⃣ View Complete History

1. Go to **"Blockchain Audit"**
2. Events increased to 2!
3. Click "View on Etherscan"
4. See all your actions:
   - Product added
   - Sale completed

**All permanent and tamper-proof!** 🎉

---

## 🔗 Quick Links

- **App:** http://localhost:5173
- **Blockchain:** http://localhost:5173/blockchain
- **Your Contract:** https://sepolia.etherscan.io/address/0xf621D2132E0321fB0089b4B9dc292167576f6186

---

## 🛑 Stop Everything

```bash
./stop-servers.bat
```

---

**That's it! Your blockchain inventory system is running!** 🚀
