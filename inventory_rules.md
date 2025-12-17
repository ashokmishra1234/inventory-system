# Inventory Rules & Restrictions Guide

This document outlines the system limits, validations, and "barriers" enforced when managing inventory as an Admin or Manager.

## 1. Quantity & Stock Barriers

Is there a limit on how much stock you can add?

- **Upper Limit (Maximum)**:

  - **No Hard Barrier**: The system allows you to enter any catalog quantity (e.g., 10,000 units).
  - **Technical Limit**: The database stores quantity as an `INTEGER`, so the theoretical max is 2,147,483,647.
  - _Usage_: Retailers can freely stock large warehouses without restriction.

- **Lower Limit (Minimum)**:
  - **Barrier Enforced**: **0 (Zero)**.
  - **Rule**: You cannot enter a negative quantity.
  - _Validation Code_: `quantity: min(0)` is enforced at both the API level and the Input form.

## 2. Pricing Rules

- **Negative Prices**: **Blocked**. You cannot sell an item for less than $0.00.
- **Upper Price Limit**: No hard limit. (You can sell an item for $1,000,000).

## 3. Discount Controls

Retailers often worry about staff giving too many discounts. We enforce specific rules:

- **Max Discount %**: **100%**. Use logic in `src/controllers/inventoryController.js`.
  - The system validates `min(0)` and `max(100)`.
- **Approval Rule**:
  - There is a configured field: `approval_required`.
  - **Logic**: If a discount rule is set with `max_percent > 20`, the system automatically flags `approval_required: true` (Logic in `AddInventoryForm.tsx`).
  - _Effect_: Future "Sales Agent" AI will see this flag and **refuse** to offer higher discounts without your manual override.

## 4. Role-Based Restrictions

- **Viewers (Staff)**:
  - **Barrier**: 100% Blocked. They cannot Add, Edit, or Delete anything.
  - They can only _see_ the quantity.
- **Managers (Retailers)**:
  - **Barrier**: None (Subject to the rules above).
- **Admins**:
  - **Barrier**: None.

## 5. Summary Table

| Field         | Min Value | Max Value | Default | Notes                       |
| :------------ | :-------- | :-------- | :------ | :-------------------------- |
| **Quantity**  | 0         | 2 Billion | 0       | Cannot be negative.         |
| **Price**     | $0.00     | Unlimited | -       | Must be >= 0.               |
| **Discount**  | 0%        | 100%      | 0%      | AI requires approval > 20%. |
| **Threshold** | 0         | Unlimited | 5       | Triggers "Low Stock" alert. |
