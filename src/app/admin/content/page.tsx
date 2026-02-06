"use client";
import React, { useState, useEffect } from 'react';

export default function ContentPage() {
    const [pages, setPages] = useState<{ title: string, slug: string, status: string }[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('ta_pages');
        if (saved) setPages(JSON.parse(saved));
        else setPages([
            { title: 'Rólunk', slug: 'rolunk', status: 'Publikálva' },
            { title: 'Általános Szerződési Feltételek', slug: 'aszf', status: 'Publikálva' },
            { title: 'Adatkezelési Tájékoztató', slug: 'adatkezeles', status: 'Publikálva' },
            { title: 'Szállítás és Fizetés', slug: 'szallitas', status: 'Vázlat' }
        ]);
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Tartalomkezelés</h1>
                    <p className="text-gray-500">Statikus oldalak és blogbejegyzések</p>
                </div>
                <button className="bg-brand-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-900/20 hover:bg-brand-800 active:scale-95 transition-all">
                    <i className="fa-solid fa-plus mr-2"></i> Új Oldal
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider font-bold">
                            <th className="px-6 py-4">Cím</th>
                            <th className="px-6 py-4">URL (Slug)</th>
                            <th className="px-6 py-4">Státusz</th>
                            <th className="px-6 py-4 text-right">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {pages.map((page, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{page.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">/{page.slug}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${page.status === 'Publikálva' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {page.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-brand-500 font-bold text-sm hover:underline mr-4">Szerkesztés</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
