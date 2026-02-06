export interface Product {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    category: string;
    image: string;
    images: string[];
    description: string;
    stock?: number;
}

export interface CartItem extends Product {
    qty: number;
}

export interface Order {
    id: string;
    name: string;
    address: string;
    total: number;
    status: string;
    date: string;
    email?: string; // Added for Admin/Customer tracking
    items: { name: string; qty: number; price: number }[];
}

export interface ShopState {
    products: Product[];
    cart: CartItem[];
    wishlist: string[];
    orders: Order[];
    searchQuery: string;
    currentCategory: string;
    demoMode: boolean;
    settings: {
        bannerEnabled: boolean;
        bannerText: string;
        bannerColor: string;
    };
}
