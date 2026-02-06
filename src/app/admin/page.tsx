"use client";
import React from 'react';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

export default function AdminDashboard() {
    const { orders } = useShop();

    // Calculations
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Új rendelés' || o.status === 'Feldolgozás alatt').length;
    const totalCustomers = new Set(orders.map(o => o.email)).size + 1200; // Mock base + actual

    const kpiCards = [
        { label: 'Mai bevétel', val: totalRevenue.toLocaleString() + ' Ft', icon: 'fa-coins', color: 'text-brand-500' },
        { label: 'Rendelések', val: orders.length + ' db', icon: 'fa-bag-shopping', color: 'text-gray-900' },
        { label: 'Függőben', val: pendingOrders + ' db', icon: 'fa-clock', color: 'text-orange-500' },
        { label: 'Vásárlók', val: totalCustomers.toLocaleString(), icon: 'fa-users', color: 'text-gray-900' }
    ];

    const recentOrders = [...orders].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 5);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Új rendelés': return 'bg-yellow-100 text-yellow-600';
            case 'Feldolgozás alatt': return 'bg-blue-100 text-blue-600';
            case 'Kiszállítva': return 'bg-green-100 text-green-600';
            case 'Törölve': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Vezérlőpult</h1>
                    <p className="text-gray-400 text-sm font-medium">Áttekintés az üzlet teljesítményéről.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-primary bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100 text-[10px] px-6 py-3 uppercase tracking-widest"><i className="fa-solid fa-download mr-2"></i> Export</button>
                    <button className="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest"><i className="fa-solid fa-rotate mr-2"></i> Frissítés</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {kpiCards.map((c, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group cursor-pointer animate-slide-up">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-surface-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                                <i className={`fa-solid ${c.icon}`}></i>
                            </div>
                            <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest bg-gray-50 px-2 py-1 rounded-lg">Ma</span>
                        </div>
                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{c.label}</div>
                        <div className={`text-2xl xl:text-3xl font-black ${c.color} truncate`}>{c.val}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-gray-900">Bevétel alakulása</h3>
                        <div className="bg-gray-50 border-none rounded-lg text-xs font-bold text-gray-500 px-3 py-1">Elmúlt 30 nap</div>
                    </div>
                    <div className="flex-grow flex items-end justify-between gap-2 h-64 w-full pb-2">
                        {Array.from({ length: 15 }).map((_, i) => {
                            const h = Math.floor(Math.random() * 80) + 20;
                            return (
                                <div key={i} className="flex flex-col items-center gap-2 group flex-1 h-full justify-end cursor-pointer">
                                    <div className="w-full bg-brand-100 rounded-t-lg transition-all duration-300 group-hover:bg-brand-500 relative" style={{ height: `${h}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {(h * 1000).toLocaleString()} Ft
                                        </div>
                                    </div>
                                    <div className="text-[8px] font-bold text-gray-300 group-hover:text-brand-500">{i + 1}.</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Recent Orders List */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-black text-gray-900 mb-6">Legutóbbi Rendelések</h3>
                    <div className="overflow-y-auto max-h-[300px] pr-2 space-y-4">
                        {recentOrders.length > 0 ? recentOrders.map((o) => (
                            <Link href={`/admin/orders/${o.id}`} key={o.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{o.name}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{o.total.toLocaleString()} Ft</div>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(o.status)}`}>{o.status}</div>
                            </Link>
                        )) : (
                            <div className="text-gray-400 text-center py-10 font-medium">Nincs friss rendelés</div>
                        )}
                    </div>
                    <Link href="/admin/orders" className="mt-auto w-full py-4 text-center text-xs font-black uppercase tracking-widest text-brand-500 hover:text-brand-900 transition-colors border-t border-gray-50 pt-6">Összes megtekintése</Link>
                </div>
            </div>
        </div>
    );
}
