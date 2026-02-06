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
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
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

    // Mock Data
    const mockProducts: Product[] = [
        // Tokok (4 db)
        { id: "mk1", name: "Carbon Fiber MagSafe Case - iPhone 15", price: 9990, salePrice: 7990, category: "Tokok", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800", images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800", "https://images.unsplash.com/photo-1586105251261-72a756613a01?w=800", "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?w=800"], description: "Prémium szénszálas kialakítás MagSafe kompatibilitással.", stock: 100 },
        { id: "mk2", name: "Liquid Silicone Soft-Touch Case", price: 6990, category: "Tokok", image: "https://images.unsplash.com/photo-1603313011101-31405e54d688?w=800", images: ["https://images.unsplash.com/photo-1603313011101-31405e54d688?w=800", "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800"], description: "Selymes tapintású, ütésálló szilikon tok.", stock: 100 },
        { id: "mk3", name: "Rugged Armor Extreme Defense", price: 11990, category: "Tokok", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800", images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800"], description: "Katonai szintű védelem a legextrémebb helyzetekre.", stock: 100 },
        { id: "mk4", name: "Minimalist Clear Back Case", price: 5490, category: "Tokok", image: "https://images.unsplash.com/photo-1576133600321-4d375a0048e4?w=800", images: ["https://images.unsplash.com/photo-1576133600321-4d375a0048e4?w=800"], description: "Kristálytiszta hátlap, amely kiemeli a telefon színét.", stock: 100 },
        // Fóliák (4 db)
        { id: "mk5", name: "Devia 9H Nano Glass Pro", price: 4990, category: "Fóliák", image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800", images: ["https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800", "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=800"], description: "Karcálló nano-üveg technológia a kijelző épségéért.", stock: 100 },
        { id: "mk6", name: "Matte Privacy Screen Protector", price: 5990, category: "Fóliák", image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800", images: ["https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800"], description: "Betekintés elleni védelem és ujjlenyomat-mentes felület.", stock: 100 },
        { id: "mk7", name: "Ultra-Clear HD Protection", price: 3990, category: "Fóliák", image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800", images: ["https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800"], description: "Láthatatlan védelem kristálytiszta minőségben.", stock: 100 },
        { id: "mk8", name: "Anti-Blue Light Shield", price: 5490, category: "Fóliák", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800", images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800"], description: "Szűri a kék fényt, megvédve a szemeket a fáradástól.", stock: 100 },
        // Kamera védők (4 db)
        { id: "mk9", name: "Sapphire Lens Guard Ring", price: 3490, category: "Kamera védők", image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800", images: ["https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800"], description: "Egyedi gyűrűk a lencsék teljes körű védelmére.", stock: 100 },
        { id: "mk10", name: "Full Camera Area Protector", price: 2990, category: "Kamera védők", image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800", images: ["https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800"], description: "A teljes kameraszigetet lefedő edzett üveg védelem.", stock: 100 },
        { id: "mk11", name: "Alu-Pro Lens Frame", price: 4490, category: "Kamera védők", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800", images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800"], description: "Alumínium keretes védelem a karcok ellen.", stock: 100 },
        { id: "mk12", name: "Bling Diamond Camera Cover", price: 3990, category: "Kamera védők", image: "https://images.unsplash.com/photo-1586105251261-72a756613a01?w=800", images: ["https://images.unsplash.com/photo-1586105251261-72a756613a01?w=800"], description: "Csillogó kövekkel díszített prémium védőgyűrűk.", stock: 100 }
    ];

    // Load Initial Data
    useEffect(() => {
        const load = async () => {
            // Local Storage Init
            const savedCart = localStorage.getItem('ta_cart');
            if (savedCart) setCart(JSON.parse(savedCart));
            const savedWish = localStorage.getItem('ta_wishlist');
            if (savedWish) setWishlist(JSON.parse(savedWish));

            // Auth & Products
            onAuthStateChanged(auth, async (u) => {
                if (u) {
                    try {
                        // Fetch real products if auth
                        const querySnapshot = await getDocs(collection(db, "artifacts", "egyedi-ws", "public", "data", "products"));
                        const pData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                        if (pData.length > 0) {
                            setProducts(pData);
                            setDemoMode(false);
                        } else {
                            setProducts(mockProducts);
                            setDemoMode(false); // Auth is active but empty DB, use mock as seed
                        }
                    } catch (e) {
                        console.error("Fetch failed", e);
                        setProducts(mockProducts);
                        setDemoMode(true);
                    }
                } else {
                    setProducts(mockProducts);
                    setDemoMode(true);
                }
                setLoading(false);
            });
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
            // In real app: await addDoc(collection(db, ...), product);
            return newP;
        });
    };

    const updateProduct = (product: Product) => {
        setProducts(prev => {
            const newP = prev.map(p => p.id === product.id ? product : p);
            return newP;
        });
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <ShopContext.Provider value={{
            products, cart, wishlist, orders, searchQuery, currentCategory, demoMode, settings, lastAddedItem,
            addToCart, removeFromCart, updateQty, toggleWishlist, setCategory, setSearchQuery, loading,
            addProduct, updateProduct, deleteProduct
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
