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
