"use client";
import React, { useEffect, useState } from 'react';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

export default function FloatingCart() {
    const { cart, lastAddedItem } = useShop();
    const [expanded, setExpanded] = useState(false);
    const [previewItem, setPreviewItem] = useState<any>(null);

    // Watch for new items added to cart
    useEffect(() => {
        if (lastAddedItem) {
            setPreviewItem(lastAddedItem.product);
            setExpanded(true);
            const timer = setTimeout(() => {
                setExpanded(false);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [lastAddedItem]);

    const totalQty = cart.reduce((a, b) => a + b.qty, 0);

    if (totalQty === 0 && !expanded) return null; // Hide if empty and not showing preview (unless we want it always visible like legacy? Legacy had class 'hidden' initially)

    const bgImage = previewItem ? (previewItem.images?.[0] || previewItem.image) : (cart.length > 0 ? (cart[cart.length - 1].images?.[0] || cart[cart.length - 1].image) : '');

    return (
        <Link
            href="/cart"
            id="floating-cart-bubble"
            className={`fixed bottom-6 right-6 z-[100] h-14 bg-brand-900 text-white shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${expanded ? 'w-[280px] !rounded-[20px]' : 'w-14 rounded-full'}`}
        >
            {/* Inner Container for Content (masked) */}
            <div className={`relative w-full h-full overflow-hidden ${expanded ? 'rounded-[20px]' : 'rounded-full'}`}>
                {/* Background Image (faded) */}
                {bgImage && (
                    <img
                        src={bgImage}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${expanded ? 'opacity-100' : 'opacity-40'}`}
                        alt="Cart Background"
                    />
                )}

                {/* Standard UI (Icon) - Hidden when expanded */}
                <div className={`relative z-10 flex items-center justify-center w-full h-full transition-opacity duration-300 ${expanded ? 'opacity-0 hidden' : 'opacity-100'}`}>
                    <i className="fa-solid fa-cart-shopping text-lg"></i>
                </div>

                {/* Preview UI - Visible when expanded */}
                <div className={`absolute left-0 top-0 w-full h-full px-4 py-3 bg-brand-900/80 backdrop-blur-sm transition-opacity duration-300 flex items-center ${expanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    {previewItem && (
                        <div className="flex items-center gap-3 text-left w-full">
                            <img src={previewItem.images?.[0] || previewItem.image} className="w-10 h-10 rounded-lg object-cover bg-white/10 flex-shrink-0" alt="" />
                            <div className="overflow-hidden min-w-0">
                                <div className="text-[9px] text-brand-500 font-black uppercase mb-0.5 whitespace-nowrap">Sikeresen hozzáadva!</div>
                                <div className="text-[10px] font-bold truncate text-white">{previewItem.name}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Badge (Outside overflow-hidden container) */}
            {!expanded && totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm z-20">
                    {totalQty}
                </span>
            )}
        </Link>
    );
}
