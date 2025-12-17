# Stock Logic: Master Catalog vs. Retailer Inventory

This document explains the relationship between the Admin's "Master Catalog" and the Manager's "Inventory", and answers whether a Manager can have 'more' stock.

## 1. The Core Distinction

To understand the quantities, we must distinguish between the **Definition** and the **Physical Stock**.

### A. Master Catalog (Admin Managed)

- **Role**: The "Menu" or "Dictionary".
- **Data**: SKU, Name, Description, Standard Price.
- **Quantity**: **NONE**. The Master Catalog does _not_ track how many items exist in the world. It just defines _what_ the item is.
- _Analogy_: Like a car brochure. It lists "Model X", but doesn't say how many are parked in your garage.

### B. Retailer Inventory (Manager Managed)

- **Role**: The "Warehouse" or "Shelf".
- **Data**: Quantity (Stock), Selling Price.
- **Quantity**: **Tracked**. (e.g., 30 units, 49 units).
- _Analogy_: Your actual garage. You have 2 Model X cars.

---

## 2. Answering Your Question

**Scenario**:

- Manager A has "Dettol": Quantity **30**.
- Manager B has "Dettol": Quantity **49**.
- Admin (Master Catalog): Quantity **N/A** (Not Applicable).

**Question**: "Is it possible the manager have more quantity as compared to admin inventory?"

**Answer**: **YES (Technically)**.

- Because the **Master Catalog (Admin)** has **0 (or Undefined)** physical stock. It is just a list of names.
- So, **EVERY** Retailer has "more" physical stock than the Master Catalog, because the Master Catalog isn't a warehouse.

### Scenario B: If Admin ALSO has a Shop

If the Admin user creates their _own_ personal shop (e.g., "Head Office Outlet") and adds Dettol to it:

- **Admin's Shop**: Dettol Qty = **10**.
- **Manager's Shop**: Dettol Qty = **49**.
- **Result**: Yes, the Manager has more. This is perfectly allowed. **Each shop is independent.**

---

## 3. Visual Flow

```mermaid
graph TD
    A[Admin (Master Catalog)] -->|Defines "Dettol"| B(System Definition)
    style B fill:#f9f,stroke:#333,stroke-width:2px
    B -- No Quantity stored here --

    C[Manager A (Shop 1)] -->|Buys Stock| D[Inventory: 30 Units]
    E[Manager B (Shop 2)] -->|Buys Stock| F[Inventory: 49 Units]

    D -.->|Linked to| B
    F -.->|Linked to| B
```

## 4. Key Takeaways regarding Restrictions

1.  **Independence**: Manager A's stock (49) has **nothing** to do with Manager B's stock (30).
2.  **No Ceiling**: The Admin does _not_ set a "Total System Limit". Manager A can buy 1,000,000 units if they want.
3.  **Source**: Managers usually buy from an external "Wholesaler" (defined in the catalog info), not from the Admin directly.

## 5. Metadata

- **Master Catalog Table**: `master_catalog` (Cols: id, name, sku). **NO Quantity Column**.
- **Inventory Table**: `retailer_inventory` (Cols: quantity, price). **Has Quantity Column**.
