"use client";
import React, { useState, useEffect } from 'react';

export default function MarketingPage() {
    const [coupons, setCoupons] = useState<{ code: string, discount: number, active: boolean }[]>([]);
    const [newCode, setNewCode] = useState('');
    const [newDiscount, setNewDiscount] = useState(10);

    useEffect(() => {
        const saved = localStorage.getItem('ta_coupons');
        if (saved) setCoupons(JSON.parse(saved));
        else setCoupons([
            { code: 'SUMMER2026', discount: 15, active: true },
            { code: 'WELCOME10', discount: 10, active: true }
        ]);
    }, []);

    const save = (c: any[]) => {
        setCoupons(c);
        localStorage.setItem('ta_coupons', JSON.stringify(c));
    };

    const addCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCode) {
            save([...coupons, { code: newCode.toUpperCase(), discount: Number(newDiscount), active: true }]);
            setNewCode('');
        }
    };

    const toggle = (index: number) => {
        const newC = [...coupons];
        newC[index].active = !newC[index].active;
        save(newC);
    };

    const remove = (index: number) => {
        const newC = coupons.filter((_, i) => i !== index);
        save(newC);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Marketing</h1>
            <p className="text-gray-500 mb-8">Kuponkódok és promóciók kezelése</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900">Aktív Kuponok</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {coupons.map((coupon, i) => (
                            <div key={i} className="p-6 flex items-center justify-between group">
                                <div>
                                    <div className="font-black text-xl text-brand-900 tracking-wider mb-1">{coupon.code}</div>
                                    <div className="text-sm font-bold text-gray-500">{coupon.discount}% Kedvezmény</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggle(i)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {coupon.active ? 'Aktív' : 'Inaktív'}
                                    </button>
                                    <button onClick={() => remove(i)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                        <i className="fa-solid fa-trash text-sm"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-fit">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Új Kupon Létrehozása</h2>
                    <form onSubmit={addCoupon} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kuponkód</label>
                            <input
                                type="text"
                                value={newCode}
                                onChange={(e) => setNewCode(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all uppercase"
                                placeholder="PL. TAVASZ2026"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kedvezmény mértéke (%)</label>
                            <input
                                type="number"
                                value={newDiscount}
                                onChange={(e) => setNewDiscount(Number(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                                min="1" max="100"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-brand-900 text-white py-4 rounded-xl font-black hover:bg-brand-800 shadow-lg shadow-brand-900/20 active:scale-95 transition-all">
                            Mentés
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
