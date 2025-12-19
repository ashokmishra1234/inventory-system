# Quick Start Guide

## 🚀 Starting the Server

### Easy Way (Recommended)
Just double-click or run:
```bash
./start-server.bat
```

This script will:
1. ✅ Kill any existing processes on port 5000
2. ✅ Wait for port to be released
3. ✅ Start the server cleanly

---

### Manual Way
```bash
# Kill processes on port 5000
Get-NetTCPConnection -LocalPort 5000 | Select -ExpandProperty OwningProcess | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Start server
pnpm start
```

---

## 🔍 Check if Server is Running

```bash
curl http://localhost:5000/
```

Expected response:
```json
{
  "message": "Inventory Management API is running"
}
```

---

## 🛑 Stopping the Server

Press `Ctrl + C` in the terminal where the server is running

---

## ⚠️ Troubleshooting

### "Port already in use"
**Cause:** Another instance of the server is running

**Solution:** Run `start-server.bat` or manually kill the process:
```powershell
Get-NetTCPConnection -LocalPort 5000 | Select -ExpandProperty OwningProcess | Stop-Process -Force
```

### Check what's using port 5000
```powershell
Get-NetTCPConnection -LocalPort 5000
```

---

## 📊 Verify Blockchain is Working

After server starts, check blockchain status:
```bash
curl http://localhost:5000/blockchain/stats
```

You should see:
```json
{
  "enabled": true,
  "totalEvents": 0,
  "contractAddress": "0xf621D2132E0321fB0089b4B9dc292167576f6186",
  "network": "Sepolia Testnet"
}
```

---

## 🎯 Next: Start Frontend

In a **new terminal**:
```bash
cd frontend
pnpm dev
```

Frontend will run on: http://localhost:5173

---

**Tip:** Always use `start-server.bat` to avoid port conflicts!
