"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

export default function WishlistPage() {
    const { products, wishlist } = useShop();
    const wishlistItems = products.filter(p => wishlist.includes(p.id));

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
                    <Link href="/" className="hover:text-brand-500">Kezdőlap</Link>
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                    <span className="text-gray-900">Kedvencek</span>
                </div>

                <h1 className="text-3xl font-black mb-12 tracking-tight text-gray-900">Kedvelt Termékek</h1>

                {wishlistItems.length === 0 ? (
                    <div className="py-32 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-4xl">
                            <i className="fa-regular fa-heart"></i>
                        </div>
                        <h2 className="text-2xl font-black mb-4 text-gray-900 text-center">Nincs kedvenc terméked</h2>
                        <Link href="/" className="inline-block btn-primary mx-auto px-12 py-4 shadow-xl">Böngészés</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {wishlistItems.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
