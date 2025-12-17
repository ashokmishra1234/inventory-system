# Sourcing & Ordering Guide

You asked: _"Where is the manager ordering it from?"_

## 1. The Source: "Wholesaler Info"

When a Manager adds an item from the Master Catalog, they are essentially linking to a "Preferred Supplier" defined by the Admin.

**Where is this stored?**
In the **Master Catalog**, every item has a field called `wholesaler_info`.

**Example Data**:

```json
{
  "name": "Global Pharma Distributors",
  "contact": "orders@globalpharma.com",
  "phone": "555-0199",
  "sku_code": "GP-DET-500"
}
```

## 2. The Ordering Process (Workflow)

Currently, the system works as a **Information Tool**, not an Automatic Ordering Robot.

### Step 1: Low Stock Alert

The Manager sees a red "Low Stock" alert on their dashboard for "Dettol".

### Step 2: Check Source

The Manager clicks the item to see details.

- **System Shows**: _"Supplier: Global Pharma (555-0199)"_

### Step 3: The Order (Offline Action)

The Manager performs the actual order outside the system:

- **Call**: Calls 555-0199.
- **Email**: Emails the supplier.
- **Portal**: Logs into Global Pharma's website.

### Step 4: Restock (System Action)

When the delivery truck arrives 2 days later:

1.  Manager opens "My Inventory".
2.  Clicks "Edit" on Dettol.
3.  Updates Quantity from **5** -> **55**.

---

## 3. Why isn't it automatic?

Automatic ordering requires connecting to thousands of different suppliers' systems (APIs), which is complex.

- **Current Phase**: The system tells you **WHO** to call.
- **Future (AI Phase)**: The AI Agent could draft the email to `orders@globalpharma.com` for you to approve.

## 4. Summary

| Question                    | Answer                                                    |
| :-------------------------- | :-------------------------------------------------------- |
| **Who do I order from?**    | The **Wholesaler** listed in the Catalog Item.            |
| **Does the system order?**  | No, it gives you the **Phone Number/Email**.              |
| **When do I update items?** | You manually update the count **when the truck arrives**. |
