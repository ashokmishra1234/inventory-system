# Environment Configuration Guide

## 📋 What You Need to Fill in `.env`

Your `.env` file should have these variables. Here's what each one means and where to get it:

---

## ✅ Required for Backend (Already Set)

```env
PORT=5000
```
**What it is:** Port number for the backend server  
**Action:** ✅ Keep as is (no change needed)

---

## ✅ Required for Supabase (You Need to Fill)

### 1. SUPABASE_URL
```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
```

**What it is:** Your Supabase project URL  
**Where to get it:**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the **Project URL**

---

### 2. SUPABASE_ANON_KEY
```env
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**What it is:** Public API key (safe for frontend)  
**Where to get it:**
1. Same page as above (Settings → API)
2. Copy **anon public** key
3. It's a long JWT token

---

### 3. SUPABASE_SERVICE_ROLE_KEY
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**What it is:** Private API key (backend only, bypasses RLS)  
**Where to get it:**
1. Same page (Settings → API)
2. Copy **service_role secret** key
3. ⚠️ NEVER expose this to frontend!

---

### 4. JWT_SECRET
```env
JWT_SECRET=your-secret-key-here
```

**What it is:** Secret for JWT token signing  
**What to use:** 
- **Option A:** Use the same value as `SUPABASE_SERVICE_ROLE_KEY`
- **Option B:** Generate a random string: `openssl rand -base64 32`

---

## 🔗 Optional: Blockchain Configuration

### 5. BLOCKCHAIN_ENABLED
```env
BLOCKCHAIN_ENABLED=false
```

**What it is:** Toggle to enable/disable blockchain logging  
**Options:**
- `false` - Blockchain disabled (default)
- `true` - Blockchain enabled

**Action:** Keep `false` until you configure the other blockchain variables

---

### 6. ETHEREUM_RPC_URL
```env
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

**What it is:** Ethereum network endpoint  
**Where to get it:**

**Option A: Infura (Recommended)**
1. Go to [https://infura.io](https://infura.io)
2. Sign up (free)
3. Create a new project
4. Select "Web3 API"
5. Go to project → Settings → Endpoints
6. Copy the **Sepolia** endpoint URL
   - Example: `https://sepolia.infura.io/v3/a1b2c3d4...`

**Option B: Alchemy**
1. Go to [https://www.alchemy.com](https://www.alchemy.com)
2. Create an app
3. Choose "Ethereum" → "Sepolia" testnet
4. Copy the HTTPS endpoint

---

### 7. CONTRACT_ADDRESS
```env
CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8
```

**What it is:** Your deployed smart contract address  
**Where to get it:**
1. This is the address you got when you deployed the `InventoryAudit` contract
2. It starts with `0x` and is 42 characters long
3. You can find it in:
   - Your deployment transaction receipt
   - MetaMask transaction history
   - Etherscan (if you have the transaction hash)

**Example:** `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8`

---

### 8. BACKEND_PRIVATE_KEY
```env
BACKEND_PRIVATE_KEY=0xabcdef1234567890...
```

**What it is:** Private key of the wallet that deployed the contract  
**Where to get it:**
1. Open MetaMask
2. Click the account that deployed the contract
3. Click the 3 dots → Account Details
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key (starts with `0x`)

**⚠️ CRITICAL SECURITY:**
- NEVER share this key
- NEVER commit it to Git
- This wallet needs ETH to pay gas fees

---

### 9. CHAIN_ID
```env
CHAIN_ID=11155111
```

**What it is:** Ethereum network identifier  
**Options:**
- `11155111` - Sepolia testnet (FREE, recommended for testing)
- `1` - Ethereum mainnet (EXPENSIVE)
- `137` - Polygon mainnet (CHEAP)
- `80001` - Polygon Mumbai testnet (FREE)

**Action:** Keep `11155111` for Sepolia testnet

---

## 📝 Your `.env` File Should Look Like This

```env
# Backend Configuration
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZ...
JWT_SECRET=your-secret-key-or-same-as-service-role-key

# Blockchain Configuration (Optional)
BLOCKCHAIN_ENABLED=false
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
BACKEND_PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY
CHAIN_ID=11155111
```

---

## ✅ Checklist

### Required (To Run Backend):
- [ ] `SUPABASE_URL` - From Supabase dashboard
- [ ] `SUPABASE_ANON_KEY` - From Supabase dashboard
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - From Supabase dashboard
- [ ] `JWT_SECRET` - Same as service role key or generate random

### Optional (To Enable Blockchain):
- [ ] Create Infura/Alchemy account
- [ ] `ETHEREUM_RPC_URL` - From Infura/Alchemy
- [ ] `CONTRACT_ADDRESS` - Your deployed contract address
- [ ] `BACKEND_PRIVATE_KEY` - From MetaMask (wallet that deployed contract)
- [ ] Fund wallet with Sepolia ETH from [faucet](https://sepoliafaucet.com)
- [ ] Set `BLOCKCHAIN_ENABLED=true`

---

## 🚀 Quick Start

### Test Without Blockchain (Database Only)
1. Fill only the Supabase variables
2. Keep `BLOCKCHAIN_ENABLED=false`
3. Run `npm run dev`
4. ✅ Backend works with database only

### Enable Blockchain Later
1. Get Infura key
2. Add your contract address
3. Add your private key
4. Get test ETH from faucet
5. Set `BLOCKCHAIN_ENABLED=true`
6. Restart server
7. ✅ All inventory actions now log to blockchain!

---

## 🆘 Need Help?

### Get Sepolia Test ETH (FREE)
- [Sepolia Faucet](https://sepoliafaucet.com)
- [Alchemy Faucet](https://sepoliafaucet.com/)
- Need 0.1 ETH to start

### Verify Your Setup
```bash
npm run dev
```

**Expected output:**
```
Server running on port 5000
✅ Blockchain connected successfully  # (if enabled)
📍 Contract Address: 0x...
💰 Wallet balance: 0.5 ETH
```

---

*Save this file as reference when configuring your `.env`*
