"use client";
import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm ${className}`}>{children}</div>;
}
