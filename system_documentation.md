# Inventory Management System - Technical Documentation

## 1. High-Level System Overview

**Problem Solved:**
This system helps businesses track inventory levels, manage product details, and maintain security through audit logs. It replaces manual spreadsheet tracking with a secure, multi-user web application that enforces Role-Based Access Control (RBAC).

**Overall Architecture:**
The system follows a classic **Client-Server Architecture**:

- **Frontend (Client):** A Single Page Application (SPA) built with React. It handles the user interface and user interactions.
- **Backend (Server):** A REST API built with Node.js and Express. It handles business logic, security validation, and data processing.
- **Database:** Supabase (PostgreSQL) is used for persistent storage of data and user credentials (via Supabase Auth).

**Technology Stack:**

- **Frontend:** React 18, Vite 5, Tailwind CSS 3, Axios, React Router 6, React Hook Form, Lucide Icons.
- **Backend:** Node.js (v22), Express.js, Joi (Validation), Helmet/Cors (Security).
- **Database:** PostgreSQL (Supabase), Supabase Auth.
- **Tools:** PowerShell, npm.

---

## 2. Project Folder Structure

The project is a **Monorepo-style** structure where the root contains the backend, and a subfolder contains the frontend.

```text
inventory-management-system/
├── frontend/                  # [Frontend] React Application
│   ├── src/
│   │   ├── api/               # API Clients (Axios setup)
│   │   ├── components/ui/     # Reusable UI components (Button, Card, Modal)
│   │   ├── context/           # Global State (AuthContext)
│   │   ├── layouts/           # Page Wrappers (DashboardLayout, AuthLayout)
│   │   ├── pages/             # Route Pages (Login, Dashboard, Products)
│   │   ├── types/             # TypeScript Interfaces
│   │   ├── utils/             # Helpers (cn for tailwind merge)
│   │   ├── App.tsx            # Main Router setup
│   │   └── main.tsx           # React Entry point
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Build configuration
│
├── src/                       # [Backend] Node.js Application
│   ├── config/                # Database connection (supabase.js)
│   ├── controllers/           # Business Logic functions
│   ├── middleware/            # Request Interceptors (authMiddleware)
│   ├── routes/                # API Route Definitions
│   └── server.js              # Backend Entry point
│
├── .env                       # Environment Secrets (Keys, URLs)
├── package.json               # Backend dependencies
└── schema.sql                 # Database Structure Definitions
```

---

## 3. Backend Architecture (Deep Explanation)

**Entry Point:** `src/server.js`
This file initializes the Express app, connects middleware, and starts the server on Port 5000.

**Middleware Flow:**

1.  **Security**: `helmet()` (Secure Headers) and `cors()` (Allow Frontend Access).
2.  **Parsing**: `express.json()` (Parses incoming JSON bodies).
3.  **Logging**: `morgan('dev')` (Logs HTTP requests to terminal).
4.  **Routes**: Traffic is directed to specific route files (`/auth`, `/products`, `/logs`).
5.  **Error Handling**: A global error handler catches crashes and sends clean JSON errors to the client.

**Key Components:**

- **Controllers (`src/controllers/`)**: These contain the actual logic. Example: `productController.js` has `getAllProducts`, `createProduct`. They validate input using **Joi** before talking to the DB.
- **Services/Models**: In this architecture, we use the Supabase Client securely inside the controllers to act as the Data Access Layer.

**Environment Variables:**
The backend relies on `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to talk to the database with full privileges.

---

## 4. Frontend Architecture (Deep Explanation)

**Entry Point:** `frontend/src/main.tsx`
It mounts the React Application into the DOM and wraps it with providers (like `AuthProvider` and `Toaster`).

**State Management:**

- **AuthContext (`src/context/AuthContext.tsx`)**: The most critical piece of state. It holds the `User` object (name, email, role) and provides `login()`, `signup()`, and `logout()` functions to the entire app. It persists the session using `localStorage`.
- **Local State**: Individual pages (like Products) use `useState` for transient data (search input, modal visibility).

**Routing:**
**React Router** handles navigation. We use **Layout Routes** (`AuthLayout` for public pages, `DashboardLayout` for private pages) to wrap content with common sidebars/headers.

**Rendering:**
The UI uses **Tailwind CSS** for styling, ensuring a modern look. `React Hook Form` handles complex form inputs (like the "Add Product" modal) with `Zod` validation to prevent bad data from ever reaching the backend.

---

## 5. Frontend ↔ Backend Communication

**The Bridge:** `frontend/src/api/client.ts`
This file creates a centralized **Axios Instance**.

**Configuration:**

- **Base URL**: `http://localhost:5000` (The Backend Address).
- **Interceptors**: Before every request, an interceptor automatically checks for a `token` in LocalStorage and injects it into the `Authorization` header.

**Request Flow:**

1.  **Frontend**: User clicks "Save".
2.  **Axios**: Attached Header `Authorization: Bearer <TOKEN>`.
3.  **Payload**: Sends JSON data `{ name: "Gadget", price: 100 }`.
4.  **Backend**: `authenticateToken` middleware reads the header, verifies the signature, and accepts the request.

---

## 6. Authentication & Authorization

**Flow:**

1.  **Login**: User sends Email/Pass → Backend validates with Supabase → Returns **JWT Access Token** + **User Profile**.
2.  **Session**: Frontend saves Token to `localStorage` and User Object to State.
3.  **Protection**:
    - **Frontend**: `App.tsx` has a `<ProtectedRoute>` wrapper. If no user is found in Context, it kicks them back to `/login`.
    - **Backend**: Endpoints like `DELETE /products/:id` check `req.user.role`. If it's not 'admin', it returns `403 Forbidden`.

**Security Note:**
We use `SUPABASE_SERVICE_ROLE_KEY` on the backend, which bypasses Row Level Security (RLS), allowing the backend to act as the supreme authority. The frontend never sees this key.

---

## 7. Database Design

**Type:** Relational (PostgreSQL).

**Tables:**

1.  **`users`**: Extends Supabase Auth. Stores `id` (FK to auth.users), `name`, `email`, and `role` ('admin', 'manager', 'viewer').
2.  **`products`**: The core inventory. `id`, `name`, `sku`, `price`, `quantity`, `location`.
3.  **`logs`**: The audit trail. `id`, `action` ('add', 'update', 'remove'), `quantity` (change amount), `source` (who did it), `timestamp`.

**Relationships:**

- The `users` table is tightly coupled with `auth.users` via the UUID.
- `logs` records historically reference the user's name via the `source` column.

---

## 8. Environment Setup & Running

**Prerequisites:** Node.js v20+, npm.

**Setup Steps:**

1.  **Backend Setup**:

    ```powershell
    cd inventory-management-system
    npm install
    # Ensure .env has SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET, PORT
    ```

2.  **Frontend Setup**:
    ```powershell
    cd frontend
    npm install
    ```

**Running the Project:**
You need **two** terminals running simultaneously.

1.  Terminal 1 (Backend): `npm start` (Runs on port 5000)
2.  Terminal 2 (Frontend): `npm run dev` (Runs on port 5173)

**Access:** Open browser at `http://localhost:5173`.

---

## 9. End-to-End Flow Example: "Adding a Product"

**Scenario**: An Admin wants to add a "Super Widget".

1.  **UI Action**: Admin clicks "Add Product" button. React opens the `Modal` component.
2.  **Input**: Admin types "Super Widget", Price "50". Frontend `Zod` schema validates inputs are numbers/strings.
3.  **API Call**: Admin clicks "Save". `onSubmit` function calls `client.post('/products', data)`.
4.  **Network**: Browser sends `POST http://localhost:5000/products` with Headers `Authorization: Bearer <jwt>`.
5.  **Backend (Middleware)**: `authenticateToken.js` decodes the token. "Is this a valid user?" -> Yes. Attaches `req.user`.
6.  **Backend (Controller)**: `productController.js` -> `createProduct` function runs.
    - Inserts "Super Widget" into the `products` table.
    - **Simultaneously** inserts a record into `logs` table: "Action: Add, Source: Admin Name".
7.  **Response**: Backend sends `201 Created` JSON response.
8.  **UI Update**: Frontend receives success. Closes Modal. Calls `fetchProducts()` to refresh the standard list, showing the new item immediately.

---

## 10. Key Design Decisions

1.  **Separation of Concerns**: We kept backend and frontend completely separate. This allows you to replace the frontend (e.g., with a Mobile App) without touching the backend logic.
2.  **Backend-Centric Logic**: We do not let the frontend talk to the DB directly (even though Supabase allows it). We proxy everything through our Express API. This gives us total control over validation, logging, and hiding sensitive data.
3.  **Stability**: We chose **React 18** and **Tailwind 3** (stable versions) instead of bleeding-edge versions to prevent compatibility headaches.
4.  **Role Security**: We implemented security at both layers. Hidden buttons on the UI for UX, but strict 403 checks on the API for actual security.
