# Data Types & Field Guide

This document explains the **Data Types** used in the system, specifically what to enter when adding items either in the **Database (Master Catalog)** or the **App (Inventory)**.

## 1. Master Catalog (Admin - Manual DB Entry)

When adding items directly in the **Supabase Dashboard**, use this guide.

| Field               | Data Type | What to Input?                                | Example                                       |
| :------------------ | :-------- | :-------------------------------------------- | :-------------------------------------------- |
| **id**              | `UUID`    | **LEAVE BLANK** (Select "Auto" or "Generate") | _(System Generated)_                          |
| **sku**             | `Text`    | Unique Helper Code (Must be unique)           | `1001-DET`                                    |
| **name**            | `Text`    | The Product Title                             | `Dettol Liquid 500ml`                         |
| **category**        | `Text`    | Broad Grouping                                | `Health`                                      |
| **wholesaler_info** | `JSONB`   | Structured Data (See format below)            | `{"name": "ABC Corp", "contact": "555-1234"}` |
| **standard_price**  | `Decimal` | Number with 2 decimal places                  | `45.00`                                       |

> **Critical Note on ID**: You _never_ need to type the ID manually. Supabase has a setting `default: uuid_generate_v4()`. If the dashboard asks, look for an "Auto" switch or just leave it empty/null, and the database will fill it.

### JSON Format for Wholesaler

You must enter valid JSON syntax:

```json
{
  "name": "Supplier Name",
  "contact": "Phone Number",
  "min_order": 50
}
```

---

## 2. Retailer Inventory (Manager - App Entry)

When using the **"Add Product" Form** in the application, the system handles the types, but here are the limits:

| Field               | System Type | Input Restriction                      | Example             |
| :------------------ | :---------- | :------------------------------------- | :------------------ |
| **Name**            | `Text`      | Required. Any text.                    | `My Special Dettol` |
| **SKU**             | `Text`      | Required.                              | `MY-SHOP-001`       |
| **Selling Price**   | `Decimal`   | Number. Positive ($0+).                | `49.99`             |
| **Initial Stock**   | `Integer`   | **Whole Numbers Only**. No 1.5. Min 0. | `100`               |
| **Low Stock Alert** | `Integer`   | Whole Number.                          | `10`                |
| **Max Discount**    | `Float`     | Number (0 to 100).                     | `15.5`              |

---

## 3. Database Technical Specs (Schema)

For Admins verifying directly in SQL:

#### `master_catalog`

- `id`: uuid (PK, Default v4)
- `wholesaler_info`: jsonb
- `created_at`: timestamptz (Auto)

#### `retailer_inventory`

- `retailer_id`: uuid (FK -> retailers.id)
- `quantity`: int (Default 0)
- `discount_rules`: jsonb
