"use client";
import React from 'react';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

export default function AdminProductsPage() {
    const { products } = useShop();

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Termékek</h1>
                    <p className="text-gray-400 text-sm font-medium">Kezeld a webshop kínálatát egy helyen.</p>
                </div>
                <Link href="/admin/products/new" className="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest inline-flex items-center"><i className="fa-solid fa-plus mr-2"></i> Új Termék</Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
                <div className="relative flex-grow max-w-xs">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                    <input type="text" placeholder="Keresés név, cikkszám..." className="w-full bg-surface-50 border-none rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10" />
                </div>
                <select className="bg-surface-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none text-gray-600 cursor-pointer">
                    <option>Összes kategória</option>
                    <option>Tokok</option>
                    <option>Fóliák</option>
                    <option>Kiegészítők</option>
                </select>
                <select className="bg-surface-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none text-gray-600 cursor-pointer">
                    <option>Aktív termékek</option>
                    <option>Készlethiány</option>
                    <option>Inaktív</option>
                </select>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <th className="p-6">Termék</th>
                                <th className="p-6">Kategória</th>
                                <th className="p-6">Ár (Bruttó)</th>
                                <th className="p-6">Készlet</th>
                                <th className="p-6">SEO</th>
                                <th className="p-6 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-surface-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <img src={p.images?.[0] || p.image} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                                            <div>
                                                <div className="font-black text-gray-900 text-sm truncate max-w-[200px]">{p.name}</div>
                                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">SKU: {p.id.substring(0, 6).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-xs font-bold text-gray-600">{p.category}</td>
                                    <td className="p-6 font-black text-gray-900">{(p.salePrice || p.price).toLocaleString()} Ft</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${(p.stock || 0) < 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                            <span className="text-xs font-bold text-gray-600">{p.stock || 0} db</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500" title="Meta Title OK"></span>
                                            <span className="w-2 h-2 rounded-full bg-gray-300" title="Meta Description Hiányzik"></span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <Link href={`/admin/products/edit?id=${p.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-all shadow-sm"><i className="fa-solid fa-pen"></i></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Összesen: {products.length} termék</span>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors disabled:opacity-50" disabled><i className="fa-solid fa-chevron-left"></i></button>
                        <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors"><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
