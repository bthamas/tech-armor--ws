"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useShop } from '@/context/ShopContext';

export default function Home() {
  const { products, currentCategory, setCategory, searchQuery, settings } = useShop();
  const [filtered, setFiltered] = useState(products);

  useEffect(() => {
    let res = products;
    if (currentCategory !== 'Mind') {
      res = res.filter(p => p.category === currentCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    setFiltered(res);
  }, [products, currentCategory, searchQuery]);

  const categories = ['Mind', 'Tokok', 'Fóliák', 'Kamera védők'];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Top Banner */}
      {settings.bannerEnabled && (
        <div className="bg-brand-500 text-white text-xs font-bold text-center py-2 px-4 fixed top-[72px] w-full z-40 lg:top-[76px]">
          {settings.bannerText}
        </div>
      )}

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 mt-8 rounded-[3rem] overflow-hidden bg-brand-900 h-[400px] md:h-[500px] relative flex items-center px-8 md:px-20 animate-fade-in shadow-2xl group">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1621330381970-cd27903829dd?q=80&w=2800" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/90 text-xs font-black uppercase tracking-[0.2em] mb-6 animate-slide-up">
              Prémium Védelem
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight animate-slide-up [animation-delay:100ms]">
              A stílus találkozása <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-cyan-400">a biztonsággal.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-lg leading-relaxed animate-slide-up [animation-delay:200ms]">
              Fedezd fel legújabb kollekciónkat, amelyet a legmodernebb technológiával terveztünk a maximális védelemért.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up [animation-delay:300ms]">
              <button onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-brand-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-3 shadow-xl">
                Vásárlás Most <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            { icon: 'shield-halved', title: 'Prémium Anyagok', desc: 'Csak a legjobb minőségű anyagokból.' },
            { icon: 'truck-fast', title: 'Villámgyors Szállítás', desc: 'Akár már másnap nálad lehet a csomag.' },
            { icon: 'rotate', title: '30 Napos Garancia', desc: 'Nem tetszik? Kérdés nélkül visszavesszük.' }
          ].map((f, i) => (
            <div key={i} className="bg-surface-50 rounded-3xl p-8 border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all hover:-translate-y-1 duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-500 text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <i className={`fa-solid fa-${f.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Filters & Catalog */}
        <div id="shop" className="scroll-mt-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">Termékeink</h2>
              <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`category-chip ${currentCategory === c ? 'active' : ''} cursor-pointer`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filtered.length > 0 ? (
              filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-400">
                <i className="fa-regular fa-folder-open text-4xl mb-4 opacity-50"></i>
                <p>Nincs találat a keresési feltételeknek megfelelően.</p>
              </div>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
