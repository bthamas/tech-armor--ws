"use client";
import React from 'react';
import { useShop } from '@/context/ShopContext';

export default function CustomersPage() {
    const { orders } = useShop();

    // Extract unique customers from orders
    // In a real app this would call an API or filter a Users collection
    // Here we deduce it from order data
    const customers = Array.from(new Set(orders.map(o => o.email)))
        .map(email => {
            const order = orders.find(o => o.email === email);
            const totalSpent = orders.filter(o => o.email === email).reduce((sum, o) => sum + o.total, 0);
            const orderCount = orders.filter(o => o.email === email).length;
            return {
                email,
                name: order?.name || 'Ismeretlen',
                totalSpent,
                orderCount,
                lastOrder: orders.filter(o => o.email === email).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
            };
        });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Vásárlók</h1>
                    <p className="text-gray-500">Regisztrált és vendég vásárlók listája</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Név / Email</th>
                                <th className="px-6 py-4">Rendelések</th>
                                <th className="px-6 py-4">Összesen költött</th>
                                <th className="px-6 py-4 text-right">Utolsó aktivitás</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                                        Még nincsenek vásárlók.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{customer.name}</div>
                                            <div className="text-xs text-gray-500">{customer.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center justify-center min-w-[30px] h-6 bg-brand-50 text-brand-600 text-xs font-bold rounded-full px-2">
                                                {customer.orderCount} db
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {customer.totalSpent.toLocaleString()} Ft
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-500 font-medium">
                                            {customer.lastOrder}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
