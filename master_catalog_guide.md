# Master Catalog Guide

This document explains the **Master Catalog** (Common Database), how it works, and how Admins manage it.

## 1. What is the Master Catalog?

The `master_catalog` is a **Shared Global Database** that sits above all retailers.

- **Think of it like**: A wholesale listing or a "Global Product Definition" list.
- **Purpose**: To ensure standardized product names, SKUs, and categories across the system.
- **Data Stored**: SKU, Name, Category, Standard Price, and Wholesaler Information.

## 2. Search Flow (How it works)

When a Retailer clicks "Add Product", the search happens in this order:

1.  **Frontend**: User types "iPhone" in the search box.
2.  **API Call**: Frontend sends `GET /api/catalog?search=iPhone` to the Backend.
3.  **Database Query**: The Backend queries the **Common DB table** (`master_catalog`).
    - _Note_: It does **NOT** search other retailers' private inventories. Retailer A cannot see what Retailer B has.
4.  **Result**:
    - **Found**: Returns the item details + Wholesaler Info.
    - **Not Found**: Returns empty. The Retailer is then prompted to "Create Custom Item" (which is stored ONLY in their private DB).

## 3. Can Admins Add to Master Catalog?

### Current Status: **Database Only**

As of the current version (Phase 2):

- **YES**, items can be stored in the Master Catalog.
- **BUT**, there is **no button** on the Frontend UI for "Add to Master Catalog".

### How to Add Items (For Now)

Since you are the **System Admin**, you must add them directly in the Database (Supabase Dashboard).

**Steps:**

1.  Go to Supabase Dashboard -> **Table Editor**.
2.  Select `master_catalog`.
3.  Click **Insert Row**.
4.  Fill in:
    - `sku`: "1001-DET"
    - `name`: "Dettol Antiseptic Liquid"
    - `category`: "Health"
    - `wholesaler_info`: `{"name": "Global Pharma", "contact": "555-0100"}`
    - `standard_price`: 45.00
5.  Click **Save**.
    _Now, all retailers searching for "Dettol" will find this item._

## 4. Why this restrictions?

We restrict "Write" access to the Master Catalog to prevent pollution. If every retailer could add to the Global List, it would become messy with duplicates like "Iphone 13", "iPhone 13 128gb", "Apple iPhone 13".
Only the Head Office (Admin) should define the Official List.

## 5. Summary of Actions

| Action                   | Who Can Do It?                  | Where?                       |
| :----------------------- | :------------------------------ | :--------------------------- |
| **Action**               | **Who**                         | **Where**                    |
| Search Catalog           | All Retailers (Managers/Admins) | Frontend ("Add Product")     |
| View Catalog             | All Retailers                   | Frontend                     |
| **Add New Catalog Item** | **Admin Only**                  | **Supabase Dashboard (SQL)** |
| **Edit Catalog Item**    | **Admin Only**                  | **Supabase Dashboard (SQL)** |
