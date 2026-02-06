"use client";
import React from 'react';

export default function AdminMarketingPage() {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Marketing</h1>
                    <p className="text-gray-400 text-sm font-medium">Kuponok és promóciók kezelése.</p>
                </div>
                <button className="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest"><i className="fa-solid fa-plus mr-2"></i> Új Kupon</button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 text-center">
                <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"><i className="fa-solid fa-ticket"></i></div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Jelenleg nincsenek aktív kuponok</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">Hozz létre új kuponokat, hogy növeld az eladásokat és jutalmazd a hűséges vásárlóidat.</p>
                <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-brand-600 transition-colors">Kampány Indítása</button>
            </div>
        </div>
    );
}
