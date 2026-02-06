"use client";
import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';

export default function Navbar() {
    const { cart, wishlist, searchQuery, setSearchQuery } = useShop();

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 top-0 glass-effect border-b border-gray-100/50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center text-white text-xl shadow-lg transition-transform group-hover:rotate-12">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <span className="font-extrabold text-2xl tracking-tighter text-gray-900">Tech<span className="text-brand-500">Armor</span></span>
                    </Link>

                    {/* Search */}
                    <div className="hidden md:flex flex-grow max-w-md relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-500 transition-colors">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Keress a termékek között..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-surface-50 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all shadow-inner hover:shadow-sm"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link href="/wishlist" className="w-10 h-10 rounded-full hover:bg-surface-50 flex items-center justify-center text-gray-600 transition-all relative">
                            {wishlist.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                            <i className="fa-regular fa-heart text-lg"></i>
                        </Link>
                        <Link href="/cart" className="w-10 h-10 rounded-full hover:bg-surface-50 flex items-center justify-center text-gray-600 transition-all relative">
                            {cart.reduce((a, b) => a + b.qty, 0) > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-brand-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">{cart.reduce((a, b) => a + b.qty, 0)}</span>}
                            <i className="fa-solid fa-bag-shopping text-lg"></i>
                        </Link>
                        <button className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <i className="fa-solid fa-user text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
