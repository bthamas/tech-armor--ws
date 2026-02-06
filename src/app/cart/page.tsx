"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

export default function CartPage() {
    const { cart, updateQty, removeFromCart } = useShop();

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const threshold = 15000;
    const remaining = Math.max(0, threshold - total);
    const isFree = remaining <= 0;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
                    <Link href="/" className="hover:text-brand-500">Kezdőlap</Link>
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                    <span className="text-gray-900">Kosár</span>
                </div>

                <h1 className="text-3xl font-black mb-12 tracking-tight text-gray-900">Kosár</h1>

                {cart.length === 0 ? (
                    <div className="py-32 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-4xl">
                            <i className="fa-solid fa-basket-shopping"></i>
                        </div>
                        <h2 className="text-2xl font-black mb-4 text-gray-900 text-center">A kosarad üres</h2>
                        <Link href="/" className="inline-block btn-primary mx-auto px-12 py-4 shadow-xl">Válogatás folytatása</Link>
                    </div>
                ) : (
                    <>
                        <div className={`bg-surface-50 p-8 rounded-[2.5rem] mb-12 border border-gray-100 shadow-sm relative overflow-hidden transition-all duration-500 ${isFree ? 'ring-2 ring-green-500/20' : ''}`}>
                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${isFree ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white text-gray-400'}`}>
                                    <i className={`fa-solid ${isFree ? 'fa-check' : 'fa-truck'}`}></i>
                                </div>
                                <div>
                                    <div className="font-black text-gray-900 text-lg">
                                        {isFree ? 'Ingyenes szállítás!' : `Még ${remaining.toLocaleString('hu-HU')} Ft az ingyenes szállításig`}
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">{isFree ? 'A szállítási költséget mi álljuk.' : 'Vásárolj még pár apróságot!'}</div>
                                </div>
                            </div>
                            <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full rounded-full ${isFree ? 'bg-green-500' : 'bg-brand-500'} progress-bar-inner`} style={{ width: `${Math.min(100, (total / threshold) * 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-16">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 transition-all hover:shadow-lg group">
                                    <div className="w-24 h-24 bg-surface-50 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow text-center sm:text-left">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.category}</div>
                                        <div className="font-bold text-gray-900 mb-2">{item.name}</div>
                                        <div className="font-black text-brand-500">{item.price.toLocaleString('hu-HU')} Ft</div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-surface-50 rounded-full px-2 py-1 shadow-inner">
                                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 rounded-full hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-500 transition-all"><i className="fa-solid fa-minus text-xs"></i></button>
                                            <span className="w-8 text-center font-bold text-gray-900 text-sm">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 rounded-full hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-500 transition-all"><i className="fa-solid fa-plus text-xs"></i></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-brand-900 text-white p-12 rounded-[3rem] flex flex-col sm:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 text-center sm:text-left">
                                <div className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-widest">Összesen fizetendő</div>
                                <div className="text-4xl lg:text-5xl font-black tracking-tight">{total.toLocaleString('hu-HU')} Ft</div>
                                <div className="text-gray-400 text-xs mt-2 font-medium">A végösszeg tartalmazza az ÁFÁ-t.</div>
                            </div>
                            <button className="w-full sm:w-auto bg-brand-500 text-white px-20 py-6 rounded-2xl font-black text-2xl active:scale-95 transition-all shadow-xl hover:bg-brand-600 relative z-10 flex items-center justify-center gap-4 cursor-pointer">
                                Pénztár <i className="fa-solid fa-arrow-right text-sm"></i>
                            </button>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}
