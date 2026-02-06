"use client";
import React, { useState, Suspense } from 'react';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function OrderDetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { orders } = useShop();
    const router = useRouter();

    // Find order
    const order = orders.find(o => o.id === id);
    const [status, setStatus] = useState(order?.status || 'Új rendelés');

    if (!order) return <div className="p-10 text-center font-bold text-gray-400">Rendelés nem található...</div>;

    const handleSave = () => {
        // Mock update
        order.status = status;
        alert('Státusz frissítve!');
        router.push('/admin/orders');
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
                <Link href="/admin/orders" className="hover:text-brand-500">Rendelések</Link>
                <i className="fa-solid fa-chevron-right text-xs"></i>
                <span className="text-gray-900">#{order.id.substring(0, 8).toUpperCase()}</span>
            </div>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Rendelés Részletei</h1>
                    <p className="text-gray-400 text-sm font-bold">{order.date}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleSave} className="btn-primary text-[10px] px-8 py-3 uppercase tracking-widest"><i className="fa-solid fa-save mr-2"></i> Mentés</button>
                    <button className="btn-primary bg-white text-red-500 border-red-500 hover:bg-red-50 text-[10px] px-6 py-3 uppercase tracking-widest"><i className="fa-solid fa-trash mr-2"></i> Törlés</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                        <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-50 pb-4">Megrendelt Termékek</h3>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-surface-50 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-gray-100"><i className="fa-solid fa-box"></i></div>
                                        <div>
                                            <div className="font-bold text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.qty} db x {item.price.toLocaleString()} Ft</div>
                                        </div>
                                    </div>
                                    <div className="font-black text-brand-900">{(item.qty * item.price).toLocaleString()} Ft</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-6">
                            <span className="font-bold text-gray-500 uppercase text-xs tracking-widest">Összesen</span>
                            <span className="font-black text-2xl text-brand-900">{order.total.toLocaleString()} Ft</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Status */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                        <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-50 pb-4">Státusz</h3>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner cursor-pointer"
                        >
                            <option>Új rendelés</option>
                            <option>Feldolgozás alatt</option>
                            <option>Kiszállítva</option>
                            <option>Törölve</option>
                        </select>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                        <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-50 pb-4">Vásárló</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Név</div>
                                <div className="font-bold text-gray-900">{order.name}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Email</div>
                                <div className="font-bold text-gray-900 break-all">{order.email || 'Nincs megadva'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Szállítási Cím</div>
                                <div className="font-bold text-gray-900">{order.address}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminOrderDetailsPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-gray-400 font-bold">Betöltés...</div>}>
            <OrderDetailContent />
        </Suspense>
    );
}
