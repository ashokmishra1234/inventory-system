# How to Generate Razorpay API Keys

Follow these exact steps to get your **Test Keys** for the system.

## 1. Log in to Razorpay

- Go to [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)
- Log in with your account.

## 2. Switch to "Test Mode"

- Look at the **Top Navigation Bar**.
- You will see a toggle switch that says **"Live Mode"** or **"Test Mode"**.
- **Switch it to "Test Mode"**. (The dashboard header usually turns orange/yellow).

## 3. Go to Settings

- On the **Left Sidebar**, scroll down to the bottom.
- Click on **Settings** (Gear Icon).

## 4. Generate Keys

1.  In the Settings menu, click on the tab **API Keys**.
2.  Click the button **"Generate Test Key"**.
3.  A popup will appear with two codes:
    - **Key ID**: (e.g., `rzp_test_1DP5mmOlF5G5ag`)
    - **Key Secret**: (e.g., `s4FE5a...`)
4.  **Download** or **Copy** these immediately. You won't be able to see the Secret again.

## 5. Add to Your Project (Environment Variables)

### A. For Local Testing (`.env` file)

Open your `.env` file and verify/add these lines:

```env
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

_(Also, for the Frontend to work locally, you need this one too)_:

```env
VITE_RAZORPAY_KEY_ID=your_key_id_here
```

### B. For Vercel Deployment

1.  Go to your Project on Vercel.
2.  Click **Settings** -> **Environment Variables**.
3.  Add the same 3 keys there:
    - `RAZORPAY_KEY_ID`
    - `RAZORPAY_KEY_SECRET`
    - `VITE_RAZORPAY_KEY_ID`
4.  **Redeploy** your latest commit for the changes to take effect.
