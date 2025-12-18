# Offline Payment & Manager Approval Guide

This document explains the security workflow for **Offline Payments** (Cash, Cheque, or POS Terminal Swipes not integrated via API).

## 1. The Policy

> **Rule**: "Accepting Cash requires Manager Trust."

To prevent theft or incorrect cash handling, **Ordinary Staff (Viewers/Cashiers)** cannot finalize a Cash Sale without approval. Only a **Manager** or **Admin** can confirm receipt of cash.

## 2. The Workflow

### Scenario A: User is a MANAGER

1.  **Create Bill**: Adds items to cart. Total: $500.
2.  **Checkout**: Selects "Cash Payment".
3.  **Action**: System checks Role (`isManager?`).
    - ✅ **Result**: Pass.
4.  **Completion**: Sale recorded. Stock deducted.

### Scenario B: User is STAFF (Viewer/Cashier)

1.  **Create Bill**: Adds items to cart. Total: $500.
2.  **Checkout**: Selects "Cash Payment".
3.  **Action**: System checks Role (`isManager?`).
    - ❌ **Result**: Fail.
4.  **Approval Modal**: The system shows a "Manager Approval Needed" popup.
    - **Input**: Manager must enter their **PIN** or **Password**.
5.  **Validation**: System verifies the PIN.
    - ✅ **Success**: Transaction Approved.
    - ❌ **Fail**: Transaction blocked.

## 3. Technical Implementation

### Database

- **Table**: `transactions`
- **Column**: `approved_by` (UUID of the Manager who authorized it).

### Backend Logic (`/api/payment/offline`)

- **Input**: `cart_items`, `manager_id` (optional), `manager_pin` (optional).
- **Pseudo-Code**:
  ```javascript
  if (currentUser.role !== "manager") {
    if (!validatePin(manager_id, manager_pin)) {
      return Error("Manager Approval Required");
    }
  }
  // Proceed to Record Sale
  ```

## 4. Audit Logs

Every offline transaction creates a log:

- _"Cash Sale of $500. Created by Alice (Staff). Approved by Bob (Manager)."_
