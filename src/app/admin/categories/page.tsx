"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';

export default function CategoriesPage() {
    const { categories, addCategory, deleteCategory } = useShop();
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.trim()) {
            addCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Kategóriák</h1>
                    <p className="text-gray-500">Termékkategóriák kezelése</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900">Létező kategóriák</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {categories.map((cat, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                <span className="font-bold text-gray-800">{cat}</span>
                                <button
                                    onClick={() => deleteCategory(cat)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <i className="fa-solid fa-trash text-sm"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add New */}
                <div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Új kategória</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kategória neve</label>
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                                    placeholder="Pl. Okosórák..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-brand-900 text-white py-4 rounded-xl font-black hover:bg-brand-800 shadow-lg shadow-brand-900/20 active:scale-95 transition-all"
                            >
                                Hozzáadás
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
