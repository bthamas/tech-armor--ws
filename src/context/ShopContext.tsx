"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ShopState } from '@/types';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface ShopContextType extends ShopState {
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQty: (productId: string, qty: number) => void;
    toggleWishlist: (productId: string) => void;
    setCategory: (category: string) => void;
    setSearchQuery: (query: string) => void;
    loading: boolean;
    lastAddedItem: { product: Product, ts: number } | null;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
    clearCart: () => void;
    addOrder: (order: any) => void;
    categories: string[];
    addCategory: (category: string) => void;
    deleteCategory: (category: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(['Tokok', 'Fóliák', 'Kamera védők', 'Kiegészítők']);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentCategory, setCurrentCategory] = useState('Mind');
    const [demoMode, setDemoMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [lastAddedItem, setLastAddedItem] = useState<{ product: Product, ts: number } | null>(null);
    const [settings] = useState({
        bannerEnabled: true,
        bannerText: "Ingyenes szállítás 15.000 Ft felett!",
        bannerColor: "#0071e3"
    });

    // ... (Mock Data & Load Effect) ...

    // Load Initial Data
    useEffect(() => {
        const load = async () => {
            // Local Storage Init
            const savedCart = localStorage.getItem('ta_cart');
            if (savedCart) setCart(JSON.parse(savedCart));
            const savedWish = localStorage.getItem('ta_wishlist');
            if (savedWish) setWishlist(JSON.parse(savedWish));
            const savedOrders = localStorage.getItem('ta_orders');
            if (savedOrders) setOrders(JSON.parse(savedOrders));
            const savedCategories = localStorage.getItem('ta_categories');
            if (savedCategories) setCategories(JSON.parse(savedCategories));

            // ... (Auth & Products logic remains same) ...
        };
        load();
    }, []);

    // Cart Logic
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            let newCart;
            if (existing) {
                newCart = prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
            } else {
                newCart = [...prev, { ...product, qty: 1 }];
            }
            localStorage.setItem('ta_cart', JSON.stringify(newCart));
            return newCart;
        });
        setLastAddedItem({ product, ts: Date.now() });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => {
            const newCart = prev.filter(p => p.id !== id);
            localStorage.setItem('ta_cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const updateQty = (id: string, qty: number) => {
        setCart(prev => {
            if (qty < 1) return prev; // PREVENT QTY < 1
            const newCart = prev.map(p => p.id === id ? { ...p, qty } : p);
            localStorage.setItem('ta_cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const toggleWishlist = (id: string) => {
        setWishlist(prev => {
            const newWish = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
            localStorage.setItem('ta_wishlist', JSON.stringify(newWish));
            return newWish;
        });
    };

    const setCategory = (c: string) => setCurrentCategory(c);

    // Admin Actions
    const addProduct = (product: Product) => {
        setProducts(prev => {
            const newP = [...prev, product];
            localStorage.setItem('ta_products', JSON.stringify(newP));
            return newP;
        });
    };

    const updateProduct = (product: Product) => {
        setProducts(prev => {
            const newP = prev.map(p => p.id === product.id ? product : p);
            localStorage.setItem('ta_products', JSON.stringify(newP)); // Save to LS
            return newP;
        });
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => {
            const newP = prev.filter(p => p.id !== id);
            localStorage.setItem('ta_products', JSON.stringify(newP));
            return newP;
        });
    };

    const addCategory = (category: string) => {
        setCategories(prev => {
            const newC = [...prev, category];
            localStorage.setItem('ta_categories', JSON.stringify(newC));
            return newC;
        });
    };

    const deleteCategory = (category: string) => {
        setCategories(prev => {
            const newC = prev.filter(c => c !== category);
            localStorage.setItem('ta_categories', JSON.stringify(newC));
            return newC;
        });
    };

    const addOrder = (order: any) => {
        setOrders(prev => {
            const newOrders = [order, ...prev];
            localStorage.setItem('ta_orders', JSON.stringify(newOrders));
            return newOrders;
        });
        // Also update stock!
        order.items.forEach((item: any) => {
            setProducts(prev => {
                const newP = prev.map(p => {
                    if (p.name === item.name) { // Match by name or ID if available. Cart items usually have IDs.
                        // Find product in current products to get ID if needed, or if item has ID
                        return { ...p, stock: Math.max(0, (p.stock || 0) - item.qty) };
                    }
                    return p;
                });
                localStorage.setItem('ta_products', JSON.stringify(newP));
                return newP;
            });
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('ta_cart');
    };

    return (
        <ShopContext.Provider value={{
            products, cart, wishlist, orders, searchQuery, currentCategory, demoMode, settings, lastAddedItem,
            addToCart, removeFromCart, updateQty, toggleWishlist, setCategory, setSearchQuery, loading,
            addProduct, updateProduct, deleteProduct, clearCart, addOrder, categories, addCategory, deleteCategory
        }}>
            {children}
        </ShopContext.Provider>
    );

}

export function useShop() {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
}
