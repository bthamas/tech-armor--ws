"use client";
import React, { Suspense } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { useShop } from '@/context/ShopContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types';

function EditProductContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { products, updateProduct } = useShop();
    const router = useRouter();

    const product = products.find(p => p.id === id);

    const handleSave = (data: Product) => {
        updateProduct(data);
        router.push('/admin/products');
    };

    if (!id) return <div className="p-10 text-center font-bold text-gray-400">Hiányzó termék azonosító.</div>;
    if (!product) return <div className="p-10 text-center font-bold text-gray-400">Termék nem található ({id}).</div>;

    return <ProductForm title="Termék Szerkesztése" initialData={product} onSubmit={handleSave} />;
}

export default function EditProductPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-gray-400 font-bold">Betöltés...</div>}>
            <EditProductContent />
        </Suspense>
    );
}
