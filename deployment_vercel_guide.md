# How to Deploy to Vercel (Front + Backend)

I have prepared the code so you can deploy EVERYTHING (Frontend website + Backend API) to Vercel in one step.

## Prerequisites

1.  **GitHub Account**: You must have this code pushed to GitHub (I already did this for you).
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using GitHub.

## Step 1: Import Project

1.  Go to **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your Repository: `inventory-management-system`.
4.  Click **Import**.

## Step 2: Configure Environment Variables

On the "Configure Project" screen, you must add your Backend Secrets.

1.  Open the **Environment Variables** section.
2.  Add these (Copy from your `.env` file):
    - `SUPABASE_URL`: (Your URL)
    - `SUPABASE_SERVICE_ROLE_KEY`: (Your Key)
    - `JWT_SECRET`: (Your Secret)
    - `NODE_ENV`: `production`

## Step 3: Frontend Configuration (Crucial)

1.  Add one more Variable for the Frontend to find the Backend:
    - `VITE_API_URL`: `/api`
      _(Why /api? Because Vercel hosts them on the same domain, so we just point to the relative path)_.

## Step 4: Deploy

1.  Click **Deploy**.
2.  Wait ~1-2 minutes.
3.  Vercel will give you a public URL like `https://inventory-system-xyz.vercel.app`.

## Step 5: Verify

1.  Open the URL.
2.  Try interacting with the app.
    - _Note_: The Backend is now running as a "Serverless Function" at `/api`.
