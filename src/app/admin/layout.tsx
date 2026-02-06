"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { id: '/admin', icon: 'fa-chart-pie', label: 'Vezérlőpult' },
        { id: '/admin/orders', icon: 'fa-receipt', label: 'Rendelések' },
        { id: '/admin/products', icon: 'fa-box-open', label: 'Termékek' },
        { id: '/admin/categories', icon: 'fa-folder-tree', label: 'Kategóriák' },
        { id: '/admin/customers', icon: 'fa-users', label: 'Vásárlók' },
        { id: '/admin/marketing', icon: 'fa-bullhorn', label: 'Marketing' },
        { id: '/admin/content', icon: 'fa-file-lines', label: 'Tartalom' },
        { id: '/admin/settings', icon: 'fa-sliders', label: 'Beállítások' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <div className="flex h-screen bg-brand-50/10 font-sans text-left overflow-hidden">
            {/* Sidebar */}
            <aside className={`w-64 bg-white border-r border-gray-100 flex flex-col fixed md:relative z-20 h-full transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-xl md:shadow-none`}>
                <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-900/20"><i className="fa-solid fa-shield-halved"></i></div>
                    <span className="font-black text-lg tracking-tight uppercase">Admin<span className="text-brand-500">Panel</span></span>
                    <button className="md:hidden ml-auto text-gray-400" onClick={() => setSidebarOpen(false)}><i className="fa-solid fa-times"></i></button>
                </div>

                <nav className="flex-grow p-4 space-y-2 overflow-y-auto hide-scrollbar">
                    <div className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] px-4 py-2 mt-2">Áttekintés</div>
                    {menuItems.slice(0, 1).map(item => (
                        <Link key={item.id} href={item.id} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${isActive(item.id) ? 'bg-brand-900 text-white shadow-xl shadow-brand-900/20' : 'text-gray-500 hover:bg-surface-50 hover:text-brand-900'}`}>
                            <i className={`fa-solid ${item.icon} w-5 text-center text-sm ${isActive(item.id) ? '' : 'opacity-70'}`}></i>
                            {item.label}
                        </Link>
                    ))}

                    <div className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] px-4 py-2 mt-4">Kereskedelem</div>
                    {menuItems.slice(1, 5).map(item => (
                        <Link key={item.id} href={item.id} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${isActive(item.id) ? 'bg-brand-900 text-white shadow-xl shadow-brand-900/20' : 'text-gray-500 hover:bg-surface-50 hover:text-brand-900'}`}>
                            <i className={`fa-solid ${item.icon} w-5 text-center text-sm ${isActive(item.id) ? '' : 'opacity-70'}`}></i>
                            {item.label}
                        </Link>
                    ))}

                    <div className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] px-4 py-2 mt-4">Egyéb</div>
                    {menuItems.slice(5).map(item => (
                        <Link key={item.id} href={item.id} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${isActive(item.id) ? 'bg-brand-900 text-white shadow-xl shadow-brand-900/20' : 'text-gray-500 hover:bg-surface-50 hover:text-brand-900'}`}>
                            <i className={`fa-solid ${item.icon} w-5 text-center text-sm ${isActive(item.id) ? '' : 'opacity-70'}`}></i>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                    <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-500 hover:bg-white hover:shadow-md hover:text-brand-900 transition-all">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Kilépés a Shopba
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col h-screen overflow-hidden relative">
                {/* Top Bar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0">
                    <button className="md:hidden text-gray-500 hover:text-brand-900 mr-4" onClick={() => setSidebarOpen(true)}>
                        <i className="fa-solid fa-bars text-xl"></i>
                    </button>

                    <div className="w-full max-w-lg relative hidden md:block group">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs group-focus-within:text-brand-500 transition-colors"></i>
                        <input type="text" placeholder="Keresés rendelésre, termékre, vevőre..." className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500/10 focus:bg-white transition-all font-medium text-gray-600 placeholder-gray-400 shadow-inner focus:shadow-xl" />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-gray-400 hover:text-brand-600 transition-colors cursor-pointer">
                            <i className="fa-regular fa-bell text-lg"></i>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <div className="text-[11px] font-black uppercase tracking-widest text-gray-900">Admin</div>
                                <div className="text-[9px] font-bold text-gray-400">Super User</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-brand-900 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-brand-900/20">A</div>
                        </div>
                    </div>
                </header>

                <div className="flex-grow overflow-auto p-6 md:p-10 hide-scrollbar scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-20">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
