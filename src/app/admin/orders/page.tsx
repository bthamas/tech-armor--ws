"use client";
import React from 'react';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

export default function AdminOrdersPage() {
    const { orders } = useShop();

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
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Rendelések</h1>
                    <p className="text-gray-400 text-sm font-medium">Böngéssz a beérkezett rendelések között.</p>
                </div>
                <button className="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest"><i className="fa-solid fa-file-csv mr-2"></i> Export</button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
                <div className="relative flex-grow max-w-xs">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                    <input type="text" placeholder="Keresés név, ID..." className="w-full bg-surface-50 border-none rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10" />
                </div>
                <select className="bg-surface-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none text-gray-600 cursor-pointer">
                    <option>Összes státusz</option>
                    <option>Új rendelés</option>
                    <option>Feldolgozás alatt</option>
                    <option>Kiszállítva</option>
                </select>
                <input type="date" className="bg-surface-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none text-gray-600 cursor-pointer" />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <th className="p-6">Rendelés ID</th>
                                <th className="p-6">Dátum</th>
                                <th className="p-6">Vásárló</th>
                                <th className="p-6">Végösszeg</th>
                                <th className="p-6">Státusz</th>
                                <th className="p-6 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.length > 0 ? orders.map((o) => (
                                <tr key={o.id} className="hover:bg-surface-50 transition-colors group">
                                    <td className="p-6 font-mono text-xs font-bold text-gray-500">#{o.id.substring(0, 8).toUpperCase()}</td>
                                    <td className="p-6 text-sm font-bold text-gray-600">{o.date || new Date().toLocaleDateString('hu-HU')}</td>
                                    <td className="p-6">
                                        <div className="font-black text-gray-900 text-sm">{o.name}</div>
                                        <div className="text-[10px] text-gray-400">{o.email || '-'}</div>
                                    </td>
                                    <td className="p-6 font-black text-gray-900">{o.total.toLocaleString()} Ft</td>
                                    <td className="p-6"><span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(o.status)}`}>{o.status}</span></td>
                                    <td className="p-6 text-right">
                                        <Link href={`/admin/orders/details?id=${o.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-all shadow-sm"><i className="fa-solid fa-pen"></i></Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="p-10 text-center text-gray-400 font-bold">Nincs megjeleníthető rendelés.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Összesen: {orders.length} rendelés</span>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors disabled:opacity-50" disabled><i className="fa-solid fa-chevron-left"></i></button>
                        <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors"><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
