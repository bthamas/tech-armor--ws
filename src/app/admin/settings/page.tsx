"use client";
import React, { useState } from 'react';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'Általános', icon: 'fa-sliders' },
        { id: 'payment', label: 'Fizetés', icon: 'fa-credit-card' },
        { id: 'shipping', label: 'Szállítás', icon: 'fa-truck-fast' },
        { id: 'admins', label: 'Adminok', icon: 'fa-users-gear' }
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Beállítások</h1>
                    <p className="text-gray-400 text-sm font-medium">A webshop működési paramétereinek konfigurálása.</p>
                </div>
                <button className="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest"><i className="fa-solid fa-cloud-arrow-up mr-2"></i> Mentés</button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col md:flex-row">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white shadow-sm text-brand-900' : 'text-gray-500 hover:bg-white/50'}`}
                        >
                            <i className={`fa-solid ${t.icon} w-6`}></i> {t.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-grow p-8 md:p-12">

                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-fade-in">
                            <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-6">Általános Beállítások</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="text-left"><label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Bolt Neve</label><input type="text" defaultValue="TechArmor Webshop" className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner" /></div>
                                <div className="text-left"><label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Kapcsolat Email</label><input type="text" defaultValue="info@techarmor.hu" className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner" /></div>
                                <div className="text-left md:col-span-2"><label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Bolt Leírása (SEO)</label><textarea rows={3} className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner" defaultValue="Prémium mobil kiegészítők, tokok és fóliák széles választékban."></textarea></div>
                            </div>
                        </div>
                    )}

                    {/* Payment Settings */}
                    {activeTab === 'payment' && (
                        <div className="space-y-8 animate-fade-in">
                            <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-6">Fizetési Módok</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-6 bg-surface-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm"><i className="fa-solid fa-money-bill-wave"></i></div>
                                        <div><div className="font-black text-gray-900 text-sm">Utánvét</div><div className="text-xs text-gray-500">Fizetés átvételkor a futárnál.</div></div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-6 bg-surface-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-500 shadow-sm"><i className="fa-regular fa-credit-card"></i></div>
                                        <div><div className="font-black text-gray-900 text-sm">Bankkártyás fizetés (Stripe)</div><div className="text-xs text-gray-500">Biztonságos online fizetés.</div></div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping Settings */}
                    {activeTab === 'shipping' && (
                        <div className="space-y-8 animate-fade-in">
                            <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-6">Szállítási Beállítások</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="text-left"><label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Alap Szállítási Díj</label><input type="number" defaultValue="1490" className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner" /></div>
                                <div className="text-left"><label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Ingyenes Szállítási Limit</label><input type="number" defaultValue="15000" className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner" /></div>
                            </div>
                        </div>
                    )}

                    {/* Admins Settings */}
                    {activeTab === 'admins' && (
                        <div className="space-y-8 animate-fade-in">
                            <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-6">Adminisztrátorok</h3>
                            <div className="bg-surface-50 rounded-2xl border border-gray-100 p-4">
                                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">A</div>
                                        <span className="font-bold text-gray-900 text-sm">admin@techarmor.hu</span>
                                    </div>
                                    <span className="bg-brand-50 text-brand-600 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">Super Admin</span>
                                </div>
                                <button className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:border-brand-500 hover:text-brand-500 transition-colors">Új Admin Hozzáadása</button>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
