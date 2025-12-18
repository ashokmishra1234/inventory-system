# Razorpay Integration Guide (Billing Module)

This document outlines the technical plan to add **Billing & Online Payments** to the Inventory System using **Razorpay**.

## 1. Overview

We will create a **Point of Sale (POS)** interface where the Manager can:

1.  Add items to a "Cart".
2.  Calculate Total Bill.
3.  Choose Payment Mode: **Cash** or **Online (Razorpay)**.
4.  If Online: Launch Razorpay Payment Gateway.
5.  On Success: Record the Transaction and Deduct Stock.

## 2. Database Changes

We need a new table to store sales/transaction history.

### New Table: `transactions`

| Column                | Type      | Description                                                    |
| :-------------------- | :-------- | :------------------------------------------------------------- |
| `id`                  | UUID      | Primary Key                                                    |
| `retailer_id`         | UUID      | Link to the Shop                                               |
| `total_amount`        | Decimal   | Final Bill Value                                               |
| `payment_mode`        | Text      | 'cash', 'upi', 'card' (Razorpay)                               |
| `razorpay_order_id`   | Text      | (Optional) From Razorpay                                       |
| `razorpay_payment_id` | Text      | (Optional) From Razorpay                                       |
| `status`              | Text      | 'pending', 'completed', 'failed'                               |
| `items`               | JSONB     | Snapshot of items sold `[{"sku": "A", "qty": 1, "price": 10}]` |
| `created_at`          | Timestamp | Date of Sale                                                   |

## 3. Backend Implementation (Node.js)

### Dependencies

- `npm install razorpay crypto`

### New API Routes (`/api/payment`)

#### A. Create Order (`POST /api/payment/create-order`)

- **Input**: `amount` (in INR)
- **Logic**:
  1.  Initialize Razorpay Instance.
  2.  Call `razorpay.orders.create({ amount, currency: 'INR' })`.
  3.  Return `order_id` to Frontend.

#### B. Verify Payment (`POST /api/payment/verify`)

- **Input**: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`
- **Logic**:
  1.  Use `crypto` to generate HMAC-SHA256 signature.
  2.  Compare with `razorpay_signature`.
  3.  If Valid:
      - Insert record into `transactions` table.
      - **CRITICAL**: Loop through `items` and **reduce stock** in `retailer_inventory`.
  4.  Return Success.

## 4. Frontend Implementation (React)

### New Page: `Billing.tsx`

- **UI**:
  - Search Bar (Find Products).
  - Cart List (Items added).
  - "Pay Now" Button.
- **Razorpay Integration**:
  - Load via `<script src="https://checkout.razorpay.com/v1/checkout.js">`.
  - On "Pay Now":
    1.  Call Backend `create-order`.
    2.  Open Razorpay Modal with `order_id`.
    3.  On Success (`handler` function): Call Backend `verify`.

## 5. Security & Environment Keys

You will need to add these to your `.env` (and Vercel):

- `RAZORPAY_KEY_ID`: public_key...
- `RAZORPAY_KEY_SECRET`: secret_key...

## 6. Implementation Steps

1.  **DB**: Run SQL to create `transactions` table.
2.  **Backend**: Add Razorpay routes.
3.  **Frontend**: Build the POS/Billing Page.
