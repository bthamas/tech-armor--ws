import React from 'react';
import { mockProducts } from '@/lib/mockData';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: { id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}

// SEO Metadata Generation
export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const id = params.id;
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
        return {
            title: 'Termék nem található | TechArmor',
        };
    }

    return {
        title: `${product.name} | TechArmor`,
        description: product.description,
        openGraph: {
            images: [product.image],
        },
    };
}

// Static Params for Export
export async function generateStaticParams() {
    return mockProducts.map((product) => ({
        id: product.id,
    }));
}

// Server Component
export default function ProductPage({ params }: Props) {
    const id = params.id;
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
        notFound();
    }

    return <ProductDetailsClient product={product} />;
}
