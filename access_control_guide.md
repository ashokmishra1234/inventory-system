# User Role Access & Verification Guide

This guide explains the permissions for each user role in the Inventory Management System and how to verify them.

## 1. Role Definitions

In the current Multi-Tenant architecture, roles are defined in the `users` table.

| Role        | Title            | Permissions                                                                               |
| :---------- | :--------------- | :---------------------------------------------------------------------------------------- |
| **Viewer**  | Staff            | **Read-Only**: Can view Inventory and Dashboard. Cannot Add, Edit, or Delete items.       |
| **Manager** | Retailer (Owner) | **Full Shop Access**: Can Add, Edit, Delete private inventory. Can search Master Catalog. |
| **Admin**   | System Admin     | **System Access**: Can view Audit Logs. Can manage Master Catalog (DB only currently).    |

> **Note**: New signups are assigned the **Manager** role by default, so they can immediately set up their shop.

---

## 2. Access Breakdown

### A. Viewer (Staff)

- **Accessible Pages**: Dashboard (`/`), My Inventory (`/inventory`).
- **Restricted**:
  - No "Add Product" button.
  - No "Edit/Delete" icons in the Inventory table.
  - No "Audit Logs" link in the sidebar.

### B. Manager (Retailer)

- **Accessible Pages**: Dashboard (`/`), My Inventory (`/inventory`).
- **Capabilities**:
  - **Add Product**: Can search Master Catalog or create local items.
  - **Edit**: Can inline-edit Price and Quantity.
  - **Delete**: Can remove items (with confirmation).
- **Restricted**:
  - No "Audit Logs" link.

### C. Admin (System)

- **Accessible Pages**: All of the above + Audit Logs (`/logs`).
- **Capabilities**:
  - Full visibility into system logs.

---

## 3. How to Verify (Live Testing)

Since the frontend dynamically adjusts based on your role, you can verify this by modifying your user record in the database.

### Prerequisites

1.  Ensure you have a user account created (Sign up at `/signup`).
2.  Have the **Supabase Dashboard** open access to the `users` table.

### Scenario 1: Verify "Manager" (Default)

1.  **Login** to the app.
2.  Go to **My Inventory**.
3.  **Check**: You should see the "+ Add Product" button at the top right.
4.  **Check**: You should see "Edit (Pencil)" and "Delete (Trash)" icons next to items.
5.  **Action**: Try adding an item. It should work.

### Scenario 2: Verify "Viewer" (Restricted)

1.  **Go to Supabase** -> Table Editor -> `users`.
2.  Find your user row.
3.  Change the `role` column from `'manager'` to `'viewer'`.
4.  **Go back to the App** and **Refresh** the page (or Logout/Login to force a strict refresh).
5.  **Check**:
    - The "+ Add Product" button is **GONE**.
    - The Edit/Delete icons in the table are **GONE**.
    - You can still view the Dashboard and Inventory list.

### Scenario 3: Verify "Admin" (System)

1.  **Go to Supabase**.
2.  Change your `role` to `'admin'`.
3.  **Refresh** the App.
4.  **Check**: Look at the Sidebar (Left Menu).
5.  You should now see a new link: **Audit Logs**.
6.  Click it to view system-wide activity.

---

## 4. API Security (Double Check)

Even if a malicious user tries to force an API call (e.g., using Postman), the Backend protects the data:

- **Viewer** trying to `POST /api/inventory`:
  - _Upcoming_: We will enforce strict role checks on the backend for extra security (currently relies on RLS ownership, but explicit role middleware is best practice).
- **Retailer A** trying to access **Retailer B**'s data:
  - **Blocked by RLS**: The database policy `auth.uid() = retailer_id` ensures physically impossible access.
