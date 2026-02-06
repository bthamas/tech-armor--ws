"use client";
import React from 'react';
import { useShop } from '@/context/ShopContext';

export default function AdminCategoriesPage() {
    const categories = ['Tokok', 'Fóliák', 'Kiegészítők', 'Kamera védők', 'Okosórák', 'Töltők']; // Mock defaults

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Kategóriák</h1>
                    <p className="text-gray-400 text-sm font-medium">Rendszerezd a termékeidet.</p>
                </div>
                <button className="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest"><i className="fa-solid fa-plus mr-2"></i> Új Kategória</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((c, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center font-bold text-lg"><i className="fa-solid fa-folder"></i></div>
                            <span className="font-black text-gray-900">{c}</span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-8 h-8 rounded-lg bg-surface-50 text-gray-400 hover:text-brand-500 transition-colors"><i className="fa-solid fa-pen"></i></button>
                            <button className="w-8 h-8 rounded-lg bg-surface-50 text-gray-400 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
