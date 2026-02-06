"use client";
import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { useShop } from '@/context/ShopContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

export default function NewProductPage() {
    const { addProduct } = useShop();
    const router = useRouter();

    const handleSave = (data: Product) => {
        addProduct(data);
        router.push('/admin/products');
    };

    return <ProductForm title="Új Termék Felvétele" onSubmit={handleSave} />;
}
