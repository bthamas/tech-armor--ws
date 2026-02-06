"use client";
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (data: Product) => void;
    title: string;
}

export default function ProductForm({ initialData, onSubmit, title }: ProductFormProps) {
    const { categories } = useShop();
    const [formData, setFormData] = useState<Product>({
        id: '',
        name: '',
        price: 0,
        salePrice: 0,
        category: 'Tokok',
        image: '',
        images: [],
        description: '',
        stock: 0,
        ...initialData
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'salePrice' || name === 'stock' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Generate ID if new
        const submitData = {
            ...formData,
            id: formData.id || 'prod_' + Math.random().toString(36).substr(2, 9)
        };
        onSubmit(submitData);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
                <Link href="/admin/products" className="hover:text-brand-500">Termékek</Link>
                <i className="fa-solid fa-chevron-right text-xs"></i>
                <span className="text-gray-900">{title}</span>
            </div>

            <div className="flex justify-between items-end mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12 space-y-8">
                {/* Basic Info */}
                <div>
                    <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-50 pb-2">Alapadatok</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest">Termék Neve</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner focus:ring-2 focus:ring-brand-500/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest">Kategória</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner cursor-pointer"
                            >
                                {categories.map((cat, i) => (
                                    <option key={i} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div>
                    <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-50 pb-2">Árazás és Készlet</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest">Bruttó Ár (Ft)</label>
                            <input
                                required
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-brand-500">Akciós Ár (Opcionális)</label>
                            <input
                                type="number"
                                name="salePrice"
                                value={formData.salePrice}
                                onChange={handleChange}
                                className="w-full bg-brand-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner text-brand-900 placeholder-brand-300"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest">Készlet (db)</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div>
                    <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-50 pb-2">Média</h3>
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest">Főkép URL</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner mb-4"
                            />
                            {formData.image && (
                                <img src={formData.image} className="h-40 rounded-xl object-cover border border-gray-100 p-1" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-50 pb-2">Leírás</h3>
                    <textarea
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner"
                    ></textarea>
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
                    <Link href="/admin/products" className="px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:bg-surface-50 transition-all">Mégse</Link>
                    <button type="submit" className="btn-primary px-10 py-4 uppercase tracking-widest text-xs shadow-xl"><i className="fa-solid fa-save mr-2"></i> Mentés</button>
                </div>
            </form>
        </div>
    );
}
