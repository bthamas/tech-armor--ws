"use client";
import React from 'react';

export default function AdminContentPage() {
    const pages = [
        { title: 'Főoldal Banner', status: 'Aktív', lastMod: '2023. 10. 24.' },
        { title: 'Rólunk', status: 'Aktív', lastMod: '2023. 09. 12.' },
        { title: 'ÁSZF', status: 'Aktív', lastMod: '2023. 01. 15.' },
        { title: 'Adatkezelés', status: 'Aktív', lastMod: '2023. 01. 15.' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Tartalom</h1>
                    <p className="text-gray-400 text-sm font-medium">Weboldal szöveges tartalmainak szerkesztése.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pages.map((p, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all">
                        <div>
                            <div className="font-black text-gray-900 text-lg mb-1">{p.title}</div>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-xs font-bold text-gray-500">{p.status}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-400">Frissítve: {p.lastMod}</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-surface-50 text-gray-400 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                            <i className="fa-solid fa-pen-to-square"></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
