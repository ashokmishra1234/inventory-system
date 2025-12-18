# Retail Inventory & Sales Assistant Platform - Official Documentation

**Version:** 2.0 (Multi-Tenant Architecture)
**Target Audience:** Retailers, Shop Managers, System Administrators, & Developers.

---

## 1. Platform Overview

### What is it?

This platform is a smart **Inventory Management & Point of Sale (POS) System** designed for modern retailers. It combines traditional stock keeping with advanced features like a shared "Master Catalog" and future-ready AI capabilities to help sell better.

### What problem does it solve?

Retailers often struggle with:

- Messy product data (typing "iPhone" 50 different ways).
- Knowing "Do we have this in stock?" instantly.
- Managing discounts without losing money.
- Connecting with suppliers efficiently.

### Who is it for?

- **Retailers (Managers)**: To run their shop, manage stock, and sell.
- **Admins (Head Office)**: To define the global product list and monitor the system.

---

## 2. User Roles

| Role                 | New Name                    | Description                                                                                                                                     |
| :------------------- | :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Retailer**         | _(Formerly Viewer/Manager)_ | The Shop Owner or Staff. Access to **Private Inventory** only. Can sell, add stock, and set prices for their own shop.                          |
| **System Admin**     | **Admin**                   | The Platform Controller. Manages the **Master Catalog** (Global List). Can see system-wide logs but cannot see a retailer's private sales data. |
| **AI Agent**         | _(Future)_                  | A smart assistant that acts on behalf of the Retailer. It can "Suggest Discounts" or "Draft Orders" based on permissions given by the Retailer. |
| **External Systems** | **API / IoT**               | Smart shelves or Scanners that talk to the platform automatically.                                                                              |

---

## 3. System Architecture (Simplified)

We built this system like a secure bank vault with a friendly front door.

1.  **Frontend (The Storefront)**: This is the website you see (`React/Vite`). It looks fast, clean, and runs in your browser. It asks the backend for data.
2.  **Backend (The Manager)**: This is the brain (`Node.js/Express`). It receives requests ("Add Stock", "Log In") and checks if you are allowed to do them.
3.  **Database (The Vault)**: This is where data lives (`Supabase`). It is split into strictly private lockers (Retailers) and a public noticeboard (Master Catalog).
4.  **Hosting**: The system lives in the cloud (`Vercel/Netlify`), so you can access it from anywhere.

---

## 4. Database Design (Crucial)

We use a **Two-Database Model** to balance efficiency and privacy.

### A. Private Database (`retailer_inventory`)

- **What it stores**: Your Stock count, Your Custom Prices, Your Sales History.
- **Who accesses it**: **ONLY YOU** (The specific Retailer).
- **Why Private?**: Retailer A should never know that Retailer B is selling "Dettol" for cheaper.
- **Security**: Protected by "Row Level Security" (RLS). Even if Retailer A tries to hack, the database physically blocks access to B's data.

### B. Common Database (`master_catalog`)

- **What it stores**: The "Definition" of items (Name, SKU, Category, Standard Price, Supplier Info).
- **Who accesses it**: Everyone can **READ**. Only Admins can **WRITE**.
- **Why Shared?**: To stop everyone from typing "Dettol 500ml" differently. We define it once, and everyone links to it.
- **Why can't Retailers edit?**: To keep the data clean. If 100 people edit the same definition, it becomes a mess.

---

## 5. Product Add Flow (Step-by-Step)

How a Retailer puts items on the shelf:

1.  **Click "Add Product"**: Retailer opens the form.
2.  **Search Master**: They type "iPhone 15".
3.  **System Check**:
    - _Found in Master?_ -> System pulls all details (Name, Image, SKU). Retailer just adds "Quantity: 10". **(Fast)**
    - _Not Found?_ -> System asks Retailer to create a "Local Product". This item exists ONLY in their private shop. **(Flexible)**
4.  **Save**: The item appears in "My Inventory".

---

## 6. Discount & Negotiation Flow

How we handle pricing deals:

1.  **Configuration**: Retailer sets a rule: _"Maximum Discount: 15%"_.
2.  **The Ask**: A customer asks for a 20% discount.
3.  **AI Check (Future)**: The AI checks the rule.
    - _Result_: "Sorry, 15% is my limit."
4.  **Approval**: If the deal is huge, the AI can alert the Manager: _"Customer wants 20% for bulk buy. Approve?"_
5.  **Manager Action**: Manager clicks "Approve" -> Transaction proceeds.

---

## 7. Sales Flow (End-to-End)

1.  **Customer Request**: "I want 2 Dettols."
2.  **Stock Check**: System checks Private DB. "We have 45."
3.  **Bill Gen**: System creates invoice #1001 for $90.
4.  **Update**: Private DB decreases Dettol count from 45 -> 43.
5.  **Handover**: **Human Staff** gives the items to the customer.
    - _Note_: The AI manages the _data_, it does not move _physical_ objects.

---

## 8. External Integrations

- **APIs**: Other apps can connect (e.g., Accounting Software pulling sales data).
- **Webhooks**: Real-time alerts (e.g., Send SMS when order placed).
- **IoT**: Smart Shelves can auto-update stock count.
- **OCR**: Take a photo of a paper Supplier Bill -> System auto-adds stock.

---

## 9. AI Agent (Future Scope)

The "Brain" we are preparing for:

- **Analyst**: "You sold 50% more Dettol this week. Buy more."
- **Negotiator**: handling customer chat within set limits.
- **Watchdog**: "Stock is low (5 units). Should I email Global Pharma?"

---

## 10. Security & Control

- **Authentication**: Secure Logins (JWT).
- **Role-Based Access**:
  - _Staff_: Can only View.
  - _Manager_: Can Edit/Sell.
  - _Admin_: Can Audit System.
- **RLS (The Forcefield)**: A database rule that says _"If UserID != OwnerID, BLOCK ACCESS"_ at the deepest level. This is why Retailers are safe from each other.

---

## 11. UI / UX Overview

- **Dashboard**: A cockpit showing Daily Sales, Low Stock Alerts, and Action Items.
- **Inventory Page**: Clean table of what you have. Edit price/qty inline.
- **Add Product Flow**: A wizard (Search -> Details -> Confirm) to prevent mistakes.
- **Design**: Dark/Light mode, Professional "POS" look (Big buttons, clear text), responsive for Tablets/Laptops.
