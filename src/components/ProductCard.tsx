"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Next.js Image component for optimization
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart, toggleWishlist, wishlist } = useShop();
    const isLiked = wishlist.includes(product.id);

    // Image fallback (simple placeholder if url is broken/empty, though Nextjs Image handles external domains if configured)
    // Note: External domains meant we must configure next.config.js usually.
    // For now we assume Unsplash is allowed or we use standard <img> for speed if not configured.
    // Let's use standard img for simplicity with external URLs unless we configure domains.
    // Actually, sticking to <img> is safer for random external URLs without config overhead right now, 
    // but Next.js encourages <Image>. I'll use <img className> for now to match legacy behavior exactly but inside JSX.

    return (
        <div className="group bg-white rounded-3xl p-4 border border-gray-100 hover:border-brand-100 transition-all hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1 duration-300 relative product-card">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-surface-50">
                <button
                    onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all z-10 shadow-sm"
                >
                    <i className={`${isLiked ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart transition-transform active:scale-95`}></i>
                </button>
                <Link href={`/products/${product.id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                </Link>
                {product.salePrice && (
                    <div className="absolute bottom-3 left-3 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/20">
                        Sale
                    </div>
                )}
            </div>
            <Link href={`/products/${product.id}`}>
                <div className="mb-4">
                    <div className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2">{product.category}</div>
                    <h3 className="font-bold text-gray-900 leading-tight group-hover:text-brand-500 transition-colors line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                </div>
            </Link>
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    {product.salePrice ? (
                        <>
                            <span className="text-xs text-gray-400 line-through font-medium">{product.price.toLocaleString('hu-HU')} Ft</span>
                            <span className="text-lg font-black text-gray-900">{product.salePrice.toLocaleString('hu-HU')} Ft</span>
                        </>
                    ) : (
                        <span className="text-lg font-black text-gray-900">{product.price.toLocaleString('hu-HU')} Ft</span>
                    )}
                </div>
                <button
                    onClick={() => addToCart(product)}
                    className="w-12 h-12 rounded-full bg-brand-900 text-white flex items-center justify-center shadow-lg hover:bg-brand-500 transition-all hover:scale-110 active:scale-95"
                >
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    );
}
