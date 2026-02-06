"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cart, orders } = useShop(); // In real app: addOrder action
    const router = useRouter();
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const shipping = total >= 15000 ? 0 : 1490;

    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success

    const handleOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
        // Clean cart in real app...
        setTimeout(() => {
            router.push('/');
        }, 5000);
    };

    if (cart.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="py-40 text-center">
                    <h2 className="text-2xl font-black mb-4">Üres a kosár</h2>
                    <Link href="/" className="text-brand-500 font-bold underline">Vásárlás folytatása</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
                {step === 3 ? (
                    <div className="max-w-xl mx-auto text-center py-20 animate-slide-up">
                        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-green-500/20 shadow-xl">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Köszönjük a rendelést!</h1>
                        <p className="text-gray-500 mb-8">A rendelésedet sikeresen rögzítettük. Hamarosan küldünk egy visszaigazoló emailt.</p>
                        <Link href="/" className="btn-primary inline-flex">Vissza a főoldalra</Link>
                        <div className="text-xs text-gray-400 mt-4">A rendszer 5 másodperc múlva visszairányít...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
                                <Link href="/cart" className="hover:text-brand-500">Kosár</Link>
                                <i className="fa-solid fa-chevron-right text-xs"></i>
                                <span className="text-gray-900">Pénztár</span>
                            </div>

                            <h1 className="text-3xl font-black mb-10 tracking-tight text-gray-900">Szállítási adatok</h1>

                            <form id="checkout-form" onSubmit={handleOrder} className="space-y-8">
                                <div className="bg-surface-50 p-8 rounded-[2.5rem] border border-gray-100/50 shadow-sm">
                                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center text-sm">1</div>
                                        Személyes adatok
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input required type="email" placeholder="Email cím" className="input-field" />
                                        <input required type="tel" placeholder="Telefonszám" className="input-field" />
                                        <input required type="text" placeholder="Vezetéknév" className="input-field" />
                                        <input required type="text" placeholder="Keresztnév" className="input-field" />
                                    </div>
                                </div>

                                <div className="bg-surface-50 p-8 rounded-[2.5rem] border border-gray-100/50 shadow-sm">
                                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center text-sm">2</div>
                                        Szállítási cím
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <input required type="text" placeholder="Irányítószám" className="input-field" />
                                            <input required type="text" placeholder="Város" className="input-field md:col-span-2" />
                                        </div>
                                        <input required type="text" placeholder="Utca, házszám" className="input-field" />
                                        <input type="text" placeholder="Megjegyzés (opcionális)" className="input-field" />
                                    </div>
                                </div>

                                <div className="bg-surface-50 p-8 rounded-[2.5rem] border border-gray-100/50 shadow-sm">
                                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center text-sm">3</div>
                                        Fizetési mód
                                    </h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:border-brand-300 transition-all shadow-sm">
                                            <input type="radio" name="payment" className="w-5 h-5 text-brand-500 focus:ring-brand-500" defaultChecked />
                                            <span className="font-bold text-gray-900">Utánvét (Fizetés a futárnál)</span>
                                            <i className="fa-solid fa-money-bill-wave ml-auto text-gray-400"></i>
                                        </label>
                                        <label className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:border-brand-300 transition-all shadow-sm">
                                            <input type="radio" name="payment" className="w-5 h-5 text-brand-500 focus:ring-brand-500" />
                                            <span className="font-bold text-gray-900">Bankkártya (Stripe)</span>
                                            <i className="fa-brands fa-cc-stripe ml-auto text-brand-500 text-xl"></i>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 sticky top-28">
                                <h3 className="text-xl font-black text-gray-900 mb-6">Összegzés</h3>
                                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cart.map((item, i) => (
                                        <div key={i} className="flex justify-between items-start text-sm">
                                            <div className="text-gray-600 font-medium">
                                                <span className="font-bold text-gray-900">{item.qty}x</span> {item.name}
                                            </div>
                                            <div className="font-bold text-gray-900">{(item.price * item.qty).toLocaleString()} Ft</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-500 font-medium">
                                        <span>Részösszeg</span>
                                        <span>{total.toLocaleString()} Ft</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 font-medium">
                                        <span>Szállítás</span>
                                        <span>{shipping === 0 ? 'Ingyenes' : `${shipping} Ft`}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black text-brand-900 pt-4 border-t border-gray-100 mt-4">
                                        <span>Összesen</span>
                                        <span>{(total + shipping).toLocaleString()} Ft</span>
                                    </div>
                                </div>

                                <button form="checkout-form" type="submit" className="w-full bg-brand-500 text-white py-4 rounded-xl font-black mt-8 hover:bg-brand-600 shadow-lg shadow-brand-500/20 active:scale-95 transition-all">
                                    Megrendelés Leadása
                                </button>
                                <div className="text-center mt-4 text-[10px] text-gray-400 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                                    <i className="fa-solid fa-lock"></i> Biztonságos SSL kapcsolat
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

const inputStyle = `
.input-field {
    width: 100%;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    outline: none;
    transition: all 0.2s;
}
.input-field:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}
`;
