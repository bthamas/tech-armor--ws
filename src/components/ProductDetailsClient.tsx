"use client";
import React, { useState } from 'react';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetailsClient({ product }: { product: Product }) {
    const { addToCart } = useShop();
    const [selectedImage, setSelectedImage] = useState(product.images[0] || product.image);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Gallery */}
                    <div className="space-y-6">
                        <div className="rounded-[2.5rem] overflow-hidden bg-surface-50 border border-gray-100 aspect-square shadow-sm">
                            <img src={selectedImage} alt={product.name} className="w-full h-full object-contain p-8" />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                            {product.images && product.images.length > 0 ? (
                                product.images.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedImage(img)}
                                        className={`thumb-gallery-item ${selectedImage === img ? 'active' : ''}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover rounded-lg" alt="" />
                                    </div>
                                ))
                            ) : (
                                <div className="thumb-gallery-item active"><img src={product.image} className="w-full h-full object-cover rounded-lg" alt="" /></div>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-xs font-black text-brand-500 uppercase tracking-widest">{product.category}</span>
                            {product.stock && product.stock > 0 ? (
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full"><i className="fa-solid fa-check mr-1"></i> Raktáron</span>
                            ) : (
                                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">Nincs raktáron</span>
                            )}
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">{product.name}</h1>

                        <div className="flex items-end gap-4 mb-8">
                            {product.salePrice ? (
                                <>
                                    <span className="text-4xl font-black text-brand-500">{product.salePrice.toLocaleString('hu-HU')} Ft</span>
                                    <span className="text-xl text-gray-400 line-through font-bold mb-2">{product.price.toLocaleString('hu-HU')} Ft</span>
                                </>
                            ) : (
                                <span className="text-4xl font-black text-brand-500">{product.price.toLocaleString('hu-HU')} Ft</span>
                            )}
                        </div>

                        <p className="text-gray-500 text-lg leading-relaxed mb-10">{product.description}</p>

                        <div className="flex gap-6 mb-12">
                            <button
                                onClick={() => addToCart(product)}
                                className="btn-design-large bg-brand-500 hover:bg-brand-600 w-full sm:w-auto text-white shadow-brand-500/30"
                            >
                                <i className="fa-solid fa-cart-plus"></i> Kosárba rakom
                            </button>
                            <button className="btn-design-square">
                                <i className="fa-regular fa-heart text-2xl"></i>
                            </button>
                        </div>

                        {/* Extra Info */}
                        <div className="space-y-4 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-gray-500">
                                <div className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center text-brand-500"><i className="fa-solid fa-truck-fast"></i></div>
                                <span className="text-sm font-medium">Akár másnapi kiszállítás</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-500">
                                <div className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center text-brand-500"><i className="fa-solid fa-shield-halved"></i></div>
                                <span className="text-sm font-medium">100% Eredeti Garancia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
