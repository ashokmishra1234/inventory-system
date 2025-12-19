# Server Management Commands

## 🛑 Stop All Servers

### Quick Way (Recommended)
Just run:
```bash
./stop-servers.bat
```

Or double-click `stop-servers.bat` in Windows Explorer

---

### PowerShell Command
```powershell
Stop-Process -Name node -Force
```

This stops ALL Node.js processes (backend + frontend)

---

### Stop Specific Ports

**Stop Backend (Port 5000):**
```powershell
Get-NetTCPConnection -LocalPort 5000 | Select -ExpandProperty OwningProcess | Stop-Process -Force
```

**Stop Frontend (Port 5173):**
```powershell
Get-NetTCPConnection -LocalPort 5173 | Select -ExpandProperty OwningProcess | Stop-Process -Force
```

---

## 🚀 Start Servers

### Start Backend
```bash
./start-server.bat
```
Or:
```bash
pnpm start
```

### Start Frontend
```bash
cd frontend
pnpm dev
```

---

## 📊 Check Running Servers

**Check all Node processes:**
```powershell
Get-Process node
```

**Check what's on port 5000:**
```powershell
Get-NetTCPConnection -LocalPort 5000
```

**Check what's on port 5173:**
```powershell
Get-NetTCPConnection -LocalPort 5173
```

---

## 🔄 Restart Servers

### Quick Restart
```bash
# Stop all
./stop-servers.bat

# Start backend
./start-server.bat

# Start frontend (in new terminal)
cd frontend
pnpm dev
```

---

## ⚡ Quick Reference

| Script | Purpose |
|--------|---------|
| `start-server.bat` | Start backend (auto-kills old processes) |
| `stop-servers.bat` | Stop ALL servers |

**Tip:** Always use these scripts to avoid port conflicts!
