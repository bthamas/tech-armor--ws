"use client";
import React from 'react';
import { useShop } from '@/context/ShopContext';

export default function AdminCustomersPage() {
    const { orders } = useShop();

    // Deduplicate customers from orders
    const customers = Array.from(new Set(orders.map(o => o.email).filter(Boolean))).map(email => {
        const order = orders.find(o => o.email === email);
        return {
            email,
            name: order?.name || 'Ismeretlen',
            lastOrder: order?.date,
            totalSpent: orders.filter(o => o.email === email).reduce((sum, o) => sum + o.total, 0),
            orderCount: orders.filter(o => o.email === email).length
        };
    });

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Vásárlók</h1>
                    <p className="text-gray-400 text-sm font-medium">Áttekintés a regisztrált ügyfelekről.</p>
                </div>
                <button className="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest"><i className="fa-solid fa-download mr-2"></i> Export</button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <th className="p-6">Vásárló</th>
                            <th className="p-6">Utolsó Rendelés</th>
                            <th className="p-6">Rendelések</th>
                            <th className="p-6">Költés</th>
                            <th className="p-6 text-right">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {customers.length > 0 ? customers.map((c, i) => (
                            <tr key={i} className="hover:bg-surface-50 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">{c.name.charAt(0)}</div>
                                        <div>
                                            <div className="font-bold text-gray-900">{c.name}</div>
                                            <div className="text-xs text-gray-400">{c.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-xs font-bold text-gray-600">{c.lastOrder}</td>
                                <td className="p-6 text-xs font-bold text-gray-600">{c.orderCount} db</td>
                                <td className="p-6 font-black text-gray-900">{c.totalSpent.toLocaleString()} Ft</td>
                                <td className="p-6 text-right">
                                    <button className="text-gray-400 hover:text-brand-500 transition-colors"><i className="fa-solid fa-envelope"></i></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="p-10 text-center text-gray-400">Nincs adat.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
