"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cart, addOrder, clearCart } = useShop();
    const router = useRouter();
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const shipping = total >= 15000 ? 0 : 1490;

    // Steps: 1: Contact, 2: Shipping, 3: Payment
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        zip: '',
        city: '',
        address: '',
        note: '',
        paymentMethod: 'Utánvét'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newOrder = {
            id: 'ord_' + Math.random().toString(36).substr(2, 9),
            date: new Date().toLocaleDateString('hu-HU'),
            status: 'Új rendelés',
            total: total + shipping,
            email: formData.email,
            name: `${formData.lastName} ${formData.firstName}`,
            address: `${formData.zip} ${formData.city}, ${formData.address}`,
            items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price, id: i.id })) // Include ID for stock logic match
        };

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        addOrder(newOrder);
        clearCart();
        setLoading(false);
        setCompleted(true);

        setTimeout(() => {
            router.push('/');
        }, 6000);
    };

    // Styling classes
    const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all placeholder:text-gray-400";
    const labelClass = "block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1";
    const sectionClass = "bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100/50 border border-white mb-8 relative overflow-hidden group hover:border-brand-100 transition-all";

    if (cart.length === 0 && !completed) {
        return (
            <div className="min-h-screen bg-surface-50">
                <Navbar />
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl text-gray-300 text-4xl">
                        <i className="fa-solid fa-basket-shopping"></i>
                    </div>
                    <h2 className="text-3xl font-black mb-4 text-gray-900">Üres a kosár</h2>
                    <p className="text-gray-500 mb-8 max-w-md">Válogass prémium termékeink közül és töltsd meg a kosarad!</p>
                    <Link href="/" className="btn-primary shadow-xl px-12 py-4">Vásárlás folytatása</Link>
                </div>
                <Footer />
            </div>
        );
    }

    if (completed) {
        return (
            <div className="min-h-screen bg-surface-50">
                <Navbar />
                <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
                    <div className="bg-white rounded-[3rem] p-12 shadow-2xl animate-scale-in max-w-2xl mx-auto border border-white">
                        <div className="w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-lg shadow-green-500/30">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">Köszönjük!</h1>
                        <p className="text-xl text-gray-500 font-medium mb-10">A rendelésedet sikeresen rögzítettük.</p>

                        <div className="bg-surface-50 rounded-2xl p-6 mb-10 text-left max-w-md mx-auto border border-gray-100">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                <span className="text-gray-500 font-bold text-sm">Rendelés szám:</span>
                                <span className="font-black text-brand-900">#ORD-{Math.floor(Math.random() * 10000)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold">Várható szállítás:</span>
                                <span className="font-bold text-green-600">2-3 munkanap</span>
                            </div>
                        </div>

                        <Link href="/" className="btn-primary inline-flex px-10 py-4 shadow-xl active:scale-95">Vissza a főoldalra</Link>
                        <div className="text-xs text-gray-400 mt-6 font-medium">A rendszer automatikusan visszairányít...</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
                    <Link href="/cart" className="hover:text-brand-500">Kosár</Link>
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                    <span className="text-gray-900">Pénztár</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl lg:text-4xl font-black mb-8 text-gray-900 tracking-tight">Véglegesítés</h1>

                        <form id="checkout-form" onSubmit={handleOrder}>
                            {/* Section 1: Contact */}
                            <div className={sectionClass}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 rounded-l-2xl"></div>
                                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center text-sm border border-brand-100">1</span>
                                    Kapcsolattartás
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClass}>Email cím</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="pelda@email.com" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Telefonszám</label>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+36 30 123 4567" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Shipping */}
                            <div className={sectionClass}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 group-hover:bg-brand-500 transition-colors rounded-l-2xl"></div>
                                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-surface-50 text-gray-500 flex items-center justify-center text-sm border border-gray-100 group-hover:text-brand-500 group-hover:bg-brand-50 transition-colors">2</span>
                                    Szállítási adatok
                                </h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelClass}>Vezetéknév</label>
                                            <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Keresztnév</label>
                                            <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className={labelClass}>Irányítószám</label>
                                            <input required type="text" name="zip" value={formData.zip} onChange={handleChange} className={inputClass} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={labelClass}>Város</label>
                                            <input required type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Utca, házszám</label>
                                        <input required type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Megjegyzés (opcionális)</label>
                                        <input type="text" name="note" value={formData.note} onChange={handleChange} className={inputClass} placeholder="Pl. kapukód, emelet..." />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Payment */}
                            <div className={sectionClass}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 group-hover:bg-brand-500 transition-colors rounded-l-2xl"></div>
                                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-surface-50 text-gray-500 flex items-center justify-center text-sm border border-gray-100 group-hover:text-brand-500 group-hover:bg-brand-50 transition-colors">3</span>
                                    Fizetés
                                </h2>
                                <div className="space-y-4">
                                    <label className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === 'Utánvét' ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500' : 'bg-surface-50 border-transparent hover:bg-white hover:border-gray-200'}`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'Utánvét' ? 'border-brand-500' : 'border-gray-300'}`}>
                                            {formData.paymentMethod === 'Utánvét' && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full"></div>}
                                        </div>
                                        <input type="radio" name="payment" className="hidden" checked={formData.paymentMethod === 'Utánvét'} onChange={() => setFormData({ ...formData, paymentMethod: 'Utánvét' })} />
                                        <div className="flex-grow">
                                            <div className="font-bold text-gray-900">Utánvét</div>
                                            <div className="text-xs text-gray-500 font-medium">Fizetés átvételkor a futárnál készpénzzel vagy kártyával.</div>
                                        </div>
                                        <i className="fa-solid fa-truck text-gray-400 text-xl"></i>
                                    </label>

                                    <label className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === 'Bankkártya' ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500' : 'bg-surface-50 border-transparent hover:bg-white hover:border-gray-200'}`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'Bankkártya' ? 'border-brand-500' : 'border-gray-300'}`}>
                                            {formData.paymentMethod === 'Bankkártya' && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full"></div>}
                                        </div>
                                        <input type="radio" name="payment" className="hidden" checked={formData.paymentMethod === 'Bankkártya'} onChange={() => setFormData({ ...formData, paymentMethod: 'Bankkártya' })} />
                                        <div className="flex-grow">
                                            <div className="font-bold text-gray-900">Bankkártya</div>
                                            <div className="text-xs text-gray-500 font-medium">Biztonságos fizetés Stripe rendszeren keresztül.</div>
                                        </div>
                                        <div className="flex gap-2 text-xl text-gray-400">
                                            <i className="fa-brands fa-cc-visa"></i>
                                            <i className="fa-brands fa-cc-mastercard"></i>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Summarry */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white">
                                <h3 className="text-xl font-black text-gray-900 mb-6">Rendelés tartalma</h3>
                                <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 -mr-2 mb-6">
                                    {cart.map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-16 h-16 bg-surface-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                                <img src={item.image} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-xs text-gray-500 font-bold mb-0.5">{item.qty} db</div>
                                                <div className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">{item.name}</div>
                                                <div className="font-black text-brand-500 text-sm">{(item.price * item.qty).toLocaleString()} Ft</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-6 space-y-3">
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                        <span>Részösszeg</span>
                                        <span className="text-gray-900">{total.toLocaleString()} Ft</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                        <span>Szállítás</span>
                                        <span className={`text-gray-900 ${shipping === 0 ? 'text-green-600 font-bold' : ''}`}>{shipping === 0 ? 'Ingyenes' : `${shipping} Ft`}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-2xl font-black text-brand-900 pt-4 mt-2 border-t border-dashed border-gray-200">
                                        <span>Összesen</span>
                                        <span>{(total + shipping).toLocaleString()} Ft</span>
                                    </div>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand-900 text-white py-5 rounded-2xl font-black text-lg mt-8 hover:bg-brand-500 shadow-xl shadow-brand-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                    ) : (
                                        <>
                                            Fizetés
                                            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                        </>
                                    )}
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <i className="fa-solid fa-shield-halved text-brand-500"></i> SSL Titkosított Kapcsolat
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
