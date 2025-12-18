# How to Share Localhost with a Friend (LAN Method)

Since `localhost` only means "This Computer", your friend cannot see it. You need to expose your computer's IP address on your WiFi network.

## Step 1: Find your IP Address

1.  Open a new terminal (Command Prompt).
2.  Type `ipconfig` and press Enter.
3.  Look for **IPv4 Address**. It will look like `192.168.1.15` (or similar).
    - _Note this number down._

## Step 2: Configure the Backend Access

Your frontend needs to know to talk to your IP, not "localhost".

1.  Open `frontend/src/api/client.ts`.
2.  Change the `baseURL`:

    ```javascript
    // Change this line:
    // baseURL: 'http://localhost:5000/api'

    // To your IP (Example):
    baseURL: "http://192.168.1.15:5000/api";
    ```

    _(Replace 192.168.1.15 with your actual IP found in Step 1)_.

## Step 3: Run the Frontend with Network Access

By default, Vite blocks external access. You must unlock it.

1.  Stop the current frontend terminal (`Ctrl+C`).
2.  Run this command:
    ```bash
    npm run dev -- --host
    ```
    _Note the extra dashes and "host" flag._

## Step 4: Share the Link

The terminal will now show something like:

```
  > Local:    http://localhost:5173/
  > Network:  http://192.168.1.15:5173/
```

1.  Send the **Network URL** (`http://192.168.1.15:5173`) to your friend.
2.  **Important**: Your friend must be connected to the **SAME WiFi** network as you.

---

### Warning: Firewall

If it still doesn't load for them, your Windows Firewall might be blocking it.

- **Quick Fix**: When you run `--host` for the first time, Windows usually asks "Allow access?". Click **Allow** (Private Networks).
