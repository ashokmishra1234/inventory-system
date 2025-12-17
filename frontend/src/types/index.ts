export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
}

export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
  };
}

export interface MasterCatalogItem {
    id: string;
    sku: string;
    name: string;
    category: string;
    standard_price: number;
    wholesaler_info?: {
        name: string;
        contact: string;
    };
}

export interface RetailerInventoryItem {
    id: string;
    retailer_id: string;
    catalog_item_id?: string;
    custom_name?: string;
    sku: string;
    quantity: number;
    price: number;
    low_stock_threshold: number;
    discount_rules?: {
        max_percent: number;
        approval_required: boolean;
    };
    master_catalog?: MasterCatalogItem;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    quantity: number;
    location?: string;
}

export interface Log {
    id: string;
    action: 'add' | 'remove' | 'update';
    quantity: number;
    source: string;
    timestamp: string;
    products?: {
        name: string;
        sku: string;
    }
}
