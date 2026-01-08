import { store } from './store.js';
import { router } from './router.js';
import { TechBackend, auth } from './firebase.js';
import { adminViews } from './admin.js';

const backend = new TechBackend();

// Helper Functions
export const renderBreadcrumbs = () => {
    const hash = window.location.hash.substring(1) || 'home';
    const [view, param] = hash.split('/');
    if (view === 'home' || view === '') return '';

    let items = [`<button onclick="window.router.navigate('home')" class="hover:text-brand-500 transition-colors breadcrumb-item flex items-center gap-2 cursor-pointer font-bold"><i class="fa-solid fa-house"></i> Kezdőlap</button>`];

    if (view === 'product') {
        const p = store.state.products.find(x => x.id === param);
        if (p) {
            items.push(`<button onclick="window.setCategory('${p.category}')" class="hover:text-brand-500 transition-colors breadcrumb-item cursor-pointer font-bold">${p.category}</button>`);
            items.push(`<span class="text-gray-400 font-extrabold truncate max-w-[200px] sm:max-w-none">${p.name}</span>`);
        }
    } else if (view === 'cart') {
        items.push(`<span class="text-gray-900 font-black">Bevásárlókosár</span>`);
    } else if (view === 'wishlist') {
        items.push(`<span class="text-gray-900 font-black">Kedvelt termékek</span>`);
    } else if (view === 'checkout') {
        items.push(`<button onclick="window.router.navigate('cart')" class="breadcrumb-item cursor-pointer font-bold">Kosár</button>`);
        items.push(`<span class="text-gray-900 font-black">Pénztár</span>`);
    } else if (view.startsWith('admin')) {
        items.push(`<span class="text-gray-900 font-black tracking-widest">Admin Hub</span>`);
    } else if (view === 'login') {
        items.push(`<span class="text-gray-900 font-black">Bejelentkezés</span>`);
    }

    return `
        <div class="flex flex-wrap items-center gap-y-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-900 mb-8 animate-fade-in bg-surface-50 px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
            ${items.join('')}
        </div>
    `;
};

export const getProductsGridHtml = (list = null) => {
    let filtered = list || store.state.products;
    if (!list) {
        if (store.state.currentCategory !== 'Mind') filtered = filtered.filter(p => p.category === store.state.currentCategory);
        if (store.state.searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(store.state.searchQuery.toLowerCase()));
    }
    return filtered.map(p => `
        <div class="product-card animate-slide-up bg-white rounded-[2rem] border border-gray-100 p-5 transition-all hover:shadow-xl flex flex-col text-left group">
            <div class="relative aspect-square rounded-3xl overflow-hidden bg-surface-50 mb-4 cursor-pointer" onclick="window.router.navigate('product', '${p.id}')">
                <img src="${p.images?.[0] || p.image}" class="w-full h-full object-cover transition-transform duration-700">
                <button data-wish-id="${p.id}" onclick="event.stopPropagation(); window.store.toggleWishlist('${p.id}')" class="absolute top-4 right-4 w-10 h-10 rounded-full glass-effect flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm active:scale-90 cursor-pointer">
                    <i class="${store.state.wishlist.includes(p.id) ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'}"></i>
                </button>
            </div>
            <h3 class="font-bold text-gray-900 text-sm mb-1 leading-tight truncate">${p.name}</h3>
            <p class="text-[9px] text-brand-500 font-black uppercase mb-4 tracking-widest">${p.category}</p>
            <div class="flex items-center justify-between mt-auto">
                <div class="flex flex-col text-left">
                    ${p.salePrice ? `<span class="text-[10px] text-gray-400 line-through">${p.price.toLocaleString()} Ft</span>` : ''}
                    <span class="text-lg font-black text-gray-900">${(p.salePrice || p.price).toLocaleString()} Ft</span>
                </div>
                <button onclick="window.store.addToCart('${p.id}')" class="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-all shadow-lg active:scale-90 cursor-pointer">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('') || '<div class="col-span-full py-20 text-center text-gray-400 text-xs font-black uppercase tracking-widest">Nincs megjeleníthető termék</div>';
};

export const views = {
    home: () => `
        <div class="mb-12 rounded-[3rem] overflow-hidden bg-brand-900 h-[320px] sm:h-[450px] relative flex items-center px-8 md:px-16 animate-fade-in shadow-2xl">
            <div class="relative z-10 max-w-lg text-left">
                <span class="text-brand-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Premium Phone Accessories</span>
                <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tighter">Vigyázz rá <br>profizmussal.</h1>
                <button class="btn-primary px-10 py-4 cursor-pointer" onclick="document.getElementById('shop').scrollIntoView({behavior:'smooth'})">Vásárlás <i class="fa-solid fa-arrow-down ml-2 text-xs"></i></button>
            </div>
            <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1200" class="absolute right-0 top-0 h-full w-full object-cover opacity-20" style="mask-image: linear-gradient(to left, black 20%, transparent);">
        </div>
        <div id="shop" class="text-left scroll-mt-24">
            <div class="flex gap-2 overflow-x-auto pb-8 hide-scrollbar">
                ${['Mind', 'Tokok', 'Fóliák', 'Kamera védők'].map(c => `<button onclick="window.setCategory('${c}')" class="category-chip ${store.state.currentCategory === c ? 'active' : ''} cursor-pointer">${c}</button>`).join('')}
            </div>
            <div id="catalog-grid" class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                ${getProductsGridHtml()}
            </div>
        </div>
    `,
    wishlist: () => `
        <div class="text-left max-w-6xl mx-auto animate-fade-in">
            ${renderBreadcrumbs()}
            <h1 class="text-3xl font-black mb-10 tracking-tight text-gray-900">Kedvenceid</h1>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
                ${getProductsGridHtml(store.state.products.filter(p => store.state.wishlist.includes(p.id)))}
            </div>
        </div>
    `,
    product: (id) => {
        const p = store.state.products.find(x => x.id === id);
        if (!p) return `<div class="py-24 text-center text-gray-400">Termék nem található.</div>`;
        const imgs = p.images && p.images.length > 0 ? p.images : [p.image];
        return `
            <div class="max-w-7xl mx-auto animate-fade-in pt-4">
                ${renderBreadcrumbs()}
                <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 text-left">
                    <div class="md:col-span-7 space-y-6">
                        <!-- Main Image -->
                        <div class="bg-surface-50 rounded-[2.5rem] overflow-hidden aspect-[4/3] md:aspect-square shadow-sm border border-gray-100 relative group cursor-zoom-in" onclick="window.openLightbox('${p.id}', 0)">
                            <img id="big-img" src="${imgs[0]}" class="w-full h-full object-cover transition-opacity duration-300">
                        </div>
                        
                        <!-- Thumbnail Grid -->
                        <div class="grid grid-cols-5 gap-3">
                            ${imgs.map((img, idx) => `
                                <div onclick="document.getElementById('big-img').src='${img}'; document.getElementById('big-img').parentElement.onclick = () => window.openLightbox('${p.id}', ${idx}); document.querySelectorAll('.thumb-item').forEach(el => el.classList.remove('ring-2', 'ring-brand-500')); this.classList.add('ring-2', 'ring-brand-500');" 
                                     class="thumb-item aspect-square rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:shadow-md transition-all ${idx === 0 ? 'ring-2 ring-brand-500' : ''}">
                                    <img src="${img}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500">
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="md:col-span-5 flex flex-col justify-center py-6">
                        <span class="text-brand-500 font-black text-[10px] tracking-widest uppercase mb-4">${p.category}</span>
                        <h1 class="text-4xl lg:text-5xl font-extrabold mb-8 tracking-tighter text-gray-900 leading-tight">${p.name}</h1>
                        <div class="mb-10 flex items-center gap-6">
                            <div class="text-4xl font-black text-brand-900">${(p.salePrice || p.price).toLocaleString()} Ft</div>
                            ${p.salePrice ? `<div class="text-xl text-gray-300 line-through font-bold mt-2">${p.price.toLocaleString()} Ft</div>` : ''}
                        </div>
                        <div class="bg-surface-50 p-8 rounded-[1.75rem] border border-gray-100/50 mb-12">
                            <p class="text-gray-500 text-lg leading-relaxed font-medium">${p.description || 'Válassza a prémium minőséget készüléke védelméhez.'}</p>
                        </div>
                        
                        <div class="flex flex-col gap-4 mb-12">
                            <button onclick="window.store.addToCart('${p.id}')" class="w-full bg-brand-900 text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl active:scale-95 group cursor-pointer">
                                <span>Kosárba teszem</span>
                                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white text-white group-hover:text-brand-900 transition-colors">
                                    <i class="fa-solid fa-cart-plus"></i>
                                </div>
                            </button>
                            <button data-wish-id="${p.id}" onclick="window.store.toggleWishlist('${p.id}')" class="w-full bg-white border-2 border-gray-100 text-gray-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-red-100 hover:text-red-500 transition-all cursor-pointer flex items-center justify-center gap-2">
                                <i class="${store.state.wishlist.includes(p.id) ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart text-lg"></i>
                                <span class="wish-text">${store.state.wishlist.includes(p.id) ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez'}</span>
                            </button>
                        </div>

                        <div class="grid grid-cols-2 gap-8 border-t border-gray-100 pt-10">
                            <div class="flex items-center gap-4 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                                <i class="fa-solid fa-truck-fast text-brand-500 text-xl"></i> Gyors Szállítás
                            </div>
                            <div class="flex items-center gap-4 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                                <i class="fa-solid fa-shield-halved text-brand-500 text-xl"></i> 1 év Garancia
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    cart: () => {
        const total = store.state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
        const threshold = 15000;
        const remaining = Math.max(0, threshold - total);
        const percentage = Math.min(100, (total / threshold) * 100);
        const isFree = remaining <= 0;

        if (store.state.cart.length === 0) return `<div class="py-32 text-center animate-fade-in"><h2 class="text-3xl font-black mb-6 text-gray-900 text-center">A kosarad üres</h2><button onclick="window.router.navigate('home')" class="btn-primary mx-auto px-12 py-4 shadow-xl">Válogatás folytatása</button></div>`;
        return `
            <div class="max-w-4xl mx-auto text-left animate-fade-in">
                ${renderBreadcrumbs()}
                <h1 class="text-3xl font-black mb-12 tracking-tight text-gray-900">Kosár</h1>
                
                <div class="bg-surface-50 p-8 rounded-[2.5rem] mb-12 border border-gray-100 shadow-sm relative overflow-hidden transition-all duration-500 ${isFree ? 'ring-2 ring-green-500/20' : ''}" id="free-shipping-card">
                    <div class="flex justify-between items-center mb-4 relative z-10">
                        <span class="text-xs font-black uppercase tracking-widest ${isFree ? 'text-green-600' : 'text-gray-500'}" id="free-shipping-text">Ingyenes szállítás</span>
                        <span class="text-[11px] font-black uppercase ${isFree ? 'text-green-600 animate-pulse' : 'text-brand-500'}" id="free-shipping-amount">${isFree ? 'ELÉRTED!' : remaining.toLocaleString() + ' Ft hiányzik'}</span>
                    </div>
                    <div class="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
                        <div id="progress-bar" class="progress-bar-inner ${isFree ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-brand-500'} h-full" style="width: ${percentage}%"></div>
                    </div>
                </div>

                <div class="space-y-4 mb-16" id="cart-items-container">
                    ${store.state.cart.map((i, idx) => `
                        <div class="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 transition-all hover:shadow-lg group" id="cart-item-${idx}">
                            <img src="${i.images?.[0] || i.image}" class="w-20 h-20 rounded-2xl object-cover bg-surface-50 shadow-sm transition-transform group-hover:scale-105">
                            <div class="flex-grow"><h4 class="font-bold text-lg text-gray-900">${i.name}</h4><p class="text-[10px] text-brand-500 font-black uppercase mt-1 tracking-widest">${i.category}</p></div>
                            <div class="flex items-center gap-8">
                                <div class="flex items-center bg-surface-50 rounded-2xl px-4 py-2">
                                    <button onclick="window.updateQty(${idx}, -1)" class="w-6 h-6 font-bold text-gray-400 hover:text-brand-500 transition-colors cursor-pointer select-none">-</button>
                                    <span class="w-10 text-center font-black" id="qty-${idx}">${i.qty}</span>
                                    <button onclick="window.updateQty(${idx}, 1)" class="w-6 h-6 font-bold text-gray-400 hover:text-brand-500 transition-colors cursor-pointer select-none">+</button>
                                </div>
                                <div class="text-lg font-black w-28 text-right text-gray-900" id="price-${idx}">${(i.price * i.qty).toLocaleString()} Ft</div>
                                <button onclick="window.removeFromCart(${idx})" class="text-gray-300 hover:text-red-500 transition-colors p-2 cursor-pointer"><i class="fa-solid fa-trash-can text-lg"></i></button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="bg-brand-900 text-white p-12 rounded-[3rem] flex flex-col sm:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden">
                    <div class="absolute -right-20 -top-20 w-80 h-80 bg-brand-500 opacity-10 rounded-full blur-[100px]"></div>
                    <div class="text-center sm:text-left relative z-10">
                        <p class="text-[11px] opacity-60 uppercase font-black tracking-widest mb-2">Végösszeg összesen</p>
                        <div class="text-6xl font-black"><span id="cart-total">${total.toLocaleString()}</span> <span class="text-3xl font-bold">Ft</span></div>
                        <p class="text-green-400 font-black text-[10px] mt-4 uppercase tracking-[0.2em] animate-bounce ${isFree ? '' : 'hidden'}" id="total-free-msg"><i class="fa-solid fa-check"></i> Ingyenes szállítás aktiválva</p>
                    </div>
                    <button onclick="window.router.navigate('checkout')" class="w-full sm:w-auto bg-brand-500 text-white px-20 py-6 rounded-2xl font-black text-2xl active:scale-95 transition-all shadow-xl hover:bg-brand-600 relative z-10 flex items-center justify-center gap-4 cursor-pointer">Pénztár <i class="fa-solid fa-arrow-right text-sm"></i></button>
                </div>
            </div>
        `;
    },

    // Admin Routes - Delegated to admin.js
    admin_dashboard: () => adminViews.dashboard(),
    admin_orders: () => adminViews.orders(),
    admin_products: () => adminViews.products(),
    admin_categories: () => adminViews.categories(),
    admin_customers: () => adminViews.customers(),
    admin_marketing: () => adminViews.marketing(),
    admin_content: () => adminViews.content(),
    admin_settings: () => adminViews.settings(),

    // Redirect old routes if any
    admin: () => adminViews.dashboard(),

    success: (id) => `
        <div class="text-center py-40 animate-fade-in"><div class="w-28 h-28 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-12 text-5xl shadow-[0_30px_60px_rgba(34,197,94,0.3)] animate-pop"><i class="fa-solid fa-check"></i></div>
            <h1 class="text-5xl font-black mb-8 tracking-tighter text-gray-900 text-center">Rendelés sikeres!</h1><p class="text-gray-500 text-lg mb-12 text-center text-center text-center">Azonosító: <span class="bg-surface-50 px-4 py-2 rounded-xl text-gray-900 font-black tracking-widest shadow-inner">#${id.substring(0, 8).toUpperCase()}</span></p><button onclick="window.router.navigate('home')" class="btn-primary mx-auto px-16 cursor-pointer">Főoldalra</button>
        </div>
    `,

    checkout: () => `
        <div class="max-w-xl mx-auto text-left py-10 animate-fade-in">
            ${renderBreadcrumbs()}
            <h1 class="text-4xl font-black mb-12 tracking-tight text-gray-900 text-center uppercase tracking-widest text-left">Pénztár</h1>
            <form id="order-form" class="space-y-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl text-left">
                <!-- Customer Details -->
                <div class="space-y-6">
                    <h3 class="text-xl font-black text-gray-900">Adatok</h3>
                    <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Vásárló Neve</label><input required name="name" placeholder="Példa Béla" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-base outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-900 font-bold text-left shadow-inner"></div>
                    <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Email Cím</label><input required name="email" type="email" placeholder="pelda@email.com" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-base outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-900 font-bold text-left shadow-inner"></div>
                    <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Szállítási Cím</label><input required name="address" placeholder="1234 Budapest, Példa utca 1." class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-base outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-900 font-bold text-left shadow-inner"></div>
                </div>

                <!-- Payment Method -->
                <div class="pt-6 space-y-4">
                     <h3 class="text-xl font-black text-gray-900">Fizetés</h3>
                     <div class="grid grid-cols-2 gap-4">
                        <label class="cursor-pointer">
                            <input type="radio" name="paymentMethod" value="cash" class="peer sr-only" checked onchange="document.getElementById('card-details').classList.add('hidden')">
                            <div class="p-6 rounded-2xl border-2 border-gray-100 peer-checked:border-brand-500 peer-checked:bg-brand-50 transition-all text-center group hover:border-gray-300">
                                <i class="fa-solid fa-money-bill-wave text-2xl mb-2 text-gray-400 peer-checked:text-brand-500 group-hover:text-gray-600"></i>
                                <div class="text-[10px] font-black uppercase tracking-widest text-gray-500 peer-checked:text-brand-900">Utánvét</div>
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="paymentMethod" value="card" class="peer sr-only" onchange="document.getElementById('card-details').classList.remove('hidden')">
                            <div class="p-6 rounded-2xl border-2 border-gray-100 peer-checked:border-brand-500 peer-checked:bg-brand-50 transition-all text-center group hover:border-gray-300">
                                <i class="fa-regular fa-credit-card text-2xl mb-2 text-gray-400 peer-checked:text-brand-500 group-hover:text-gray-600"></i>
                                <div class="text-[10px] font-black uppercase tracking-widest text-gray-500 peer-checked:text-brand-900">Bankkártya</div>
                            </div>
                        </label>
                     </div>

                     <!-- Mock Card Form -->
                     <div id="card-details" class="hidden animate-slide-up bg-surface-50 p-6 rounded-3xl border border-gray-200 mt-4">
                        <div class="mb-5 flex gap-3 text-2xl text-gray-300">
                             <i class="fa-brands fa-cc-visa hover:text-blue-600 transition-colors"></i>
                             <i class="fa-brands fa-cc-mastercard hover:text-red-500 transition-colors"></i>
                             <i class="fa-brands fa-cc-amex hover:text-blue-400 transition-colors"></i>
                        </div>
                        <div class="space-y-4">
                             <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Kártyaszám</label><input type="text" placeholder="0000 0000 0000 0000" class="w-full bg-white border-none rounded-xl px-4 py-3 text-sm outline-none shadow-sm font-mono text-gray-900"></div>
                             <div class="grid grid-cols-2 gap-4">
                                <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Lejárat</label><input type="text" placeholder="MM/YY" class="w-full bg-white border-none rounded-xl px-4 py-3 text-sm outline-none shadow-sm font-mono text-gray-900"></div>
                                <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">CVC</label><input type="text" placeholder="123" class="w-full bg-white border-none rounded-xl px-4 py-3 text-sm outline-none shadow-sm font-mono text-gray-900"></div>
                             </div>
                        </div>
                        <p class="text-[9px] text-gray-400 mt-4 text-center font-medium"><i class="fa-solid fa-lock text-green-500"></i> Biztonságos SSL kapcsolat (Demo)</p>
                     </div>
                </div>

                <div class="pt-8 text-left"><button type="submit" class="btn-design-large w-full py-6 text-xl uppercase tracking-widest text-left cursor-pointer transition-transform active:scale-95">Rendelés Leadása <i class="fa-solid fa-paper-plane ml-3"></i></button></div>
            </form>
        </div>
    `,

    // New Login view
    login: () => `
        <div class="max-w-md mx-auto text-left py-20 animate-fade-in">
             ${renderBreadcrumbs()}
             <h1 class="text-4xl font-black mb-12 tracking-tight text-gray-900 text-center uppercase tracking-widest text-left">Admin Belépés</h1>
             <form id="login-form" class="space-y-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl text-left">
                <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Email</label><input required name="email" type="email" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-base outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-900 font-bold text-left shadow-inner"></div>
                <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Jelszó</label><input required name="password" type="password" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-base outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-900 font-bold text-left shadow-inner"></div>
                <div class="pt-4 text-left"><button type="submit" class="btn-design-large w-full py-4 text-lg uppercase tracking-widest text-left cursor-pointer">Belépés</button></div>
             </form>
        </div>
    `
};

export const renderView = (shouldScroll = true) => {
    // FAILSAFE: Always unlock scroll when navigating/rendering a new view
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    const lb = document.getElementById('lightbox');
    if (lb) {
        lb.classList.remove('open');
        lb.classList.add('hidden');
    }

    const hash = window.location.hash.substring(1) || 'home';
    const [view, param] = hash.split('/');

    // Auth Guard
    if (view.startsWith('admin')) {
        const isMockAdmin = localStorage.getItem('mock_admin_auth') === 'true';
        if (!isMockAdmin && (!auth.currentUser || auth.currentUser.isAnonymous)) {
            console.log("Unauthorized access to admin, redirecting...");
            router.navigate('login');
            return;
        }
    }

    let renderFn = views[view];
    // Check for admin_subview style mapping
    if (view === 'admin' && param) {
        const subView = `admin_${param}`;
        if (views[subView]) {
            renderFn = views[subView];
        }
    }
    renderFn = renderFn || views.home;
    const content = document.getElementById('main-content');
    if (content) {
        content.innerHTML = renderFn(param);
        if (shouldScroll) window.scrollTo(0, 0);
    }
};

// UI Logic Helpers exported to window
window.setCategory = (cat) => {
    store.state.currentCategory = cat;
    if (!window.location.hash || window.location.hash === '#home') {
        const labels = document.querySelectorAll('.category-chip');
        labels.forEach(c => c.classList.toggle('active', c.innerText === cat));
        const grid = document.getElementById('catalog-grid');
        if (grid) grid.innerHTML = getProductsGridHtml();
    } else {
        router.navigate('home');
    }
};

window.openModal = (content) => {
    const modal = document.getElementById('app-modal');
    const container = document.getElementById('modal-container');
    if (container) container.innerHTML = content;
    if (modal) modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
};

window.closeModal = () => {
    const modal = document.getElementById('app-modal');
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
};

window.openProductForm = (p = null) => {
    const imgs = p?.images ? p.images : (p?.image ? [p.image] : []);
    const imgString = imgs.join(',');

    // Generate existing thumbnails HTML
    const thumbsHtml = imgs.map((url, idx) => `
        <div class="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
            <img src="${url}" class="w-full h-full object-cover">
            <button type="button" onclick="window.removeImage('${url}')" class="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');

    const formHtml = `
        <div class="flex justify-between items-center mb-8 text-left"><h3 class="text-2xl font-black text-gray-900 uppercase tracking-tighter text-left">${p ? 'Szerkesztés' : 'Új Termék'}</h3><button onclick="window.closeModal()" class="text-gray-300 hover:text-black transition-colors cursor-pointer text-left"><i class="fa-solid fa-times text-2xl text-left"></i></button></div>
        <form id="product-form" class="space-y-6 text-left">
            <input type="hidden" name="id" value="${p?.id || ''}">
            <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Megnevezés</label><input required name="name" value="${p?.name || ''}" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-900 font-bold shadow-inner text-left"></div>
            <div class="grid grid-cols-2 gap-6 text-left">
                <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Alapár</label><input required type="number" name="price" value="${p?.price || ''}" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none text-gray-900 font-bold text-left"></div>
                <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Akciós ár</label><input type="number" name="salePrice" value="${p?.salePrice || ''}" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none text-gray-900 font-bold text-left"></div>
                <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Készlet (db)</label><input type="number" name="stock" value="${p?.stock || 0}" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none text-gray-900 font-bold text-left"></div>
            </div>
            <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Kategória</label><select name="category" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none text-gray-900 font-black text-left shadow-inner"><option ${p?.category === 'Fóliák' ? 'selected' : ''}>Fóliák</option><option ${p?.category === 'Tokok' ? 'selected' : ''}>Tokok</option><option ${p?.category === 'Kamera védők' ? 'selected' : ''}>Kamera védők</option></select></div>
            
            <!-- Image Upload Section -->
            <div class="text-left">
                <label class="text-[10px] font-black uppercase text-brand-500 mb-3 block tracking-widest text-left">Képek</label>
                <input type="hidden" name="images" id="images-hidden" value="${imgString}">
                
                <div class="flex flex-wrap gap-4 mb-4" id="image-preview-container">
                    ${thumbsHtml}
                    <label for="img-upload" class="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:text-brand-500 text-gray-400 transition-colors bg-surface-50">
                        <i class="fa-solid fa-cloud-arrow-up text-xl mb-1"></i>
                        <span class="text-[8px] font-black uppercase">Feltöltés</span>
                    </label>
                </div>
                <input type="file" id="img-upload" class="hidden" multiple accept="image/*" onchange="window.handleImageUpload(this)">
                <p id="upload-status" class="text-[10px] font-bold text-brand-500 hidden"><i class="fa-solid fa-spinner animate-spin"></i> Feltöltés folyamatban...</p>
            </div>

            <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Leírás</label><textarea name="description" rows="3" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-xs outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-900 font-medium text-left shadow-inner">${p?.description || ''}</textarea></div>
            <button type="submit" class="btn-design-large py-5 text-sm uppercase tracking-[0.3em] mt-6 text-left cursor-pointer">Mentés Alkalmazása</button>
        </form>`;
    window.openModal(formHtml);
};

window.handleImageUpload = async (input) => {
    const status = document.getElementById('upload-status');
    const container = document.getElementById('image-preview-container');
    const hiddenInput = document.getElementById('images-hidden');

    if (input.files && input.files.length > 0) {
        status.classList.remove('hidden');
        let currentUrls = hiddenInput.value ? hiddenInput.value.split(',') : [];

        for (const file of input.files) {
            const url = await backend.uploadImage(file);
            if (url) {
                currentUrls.push(url);
                // Append preview
                const div = document.createElement('div');
                div.className = "relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 animate-pop";
                div.innerHTML = `
                    <img src="${url}" class="w-full h-full object-cover">
                    <button type="button" onclick="window.removeImage('${url}')" class="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                // Insert before the upload button (last child)
                container.insertBefore(div, container.lastElementChild);
            }
        }
        hiddenInput.value = currentUrls.join(',');
        status.classList.add('hidden');
        input.value = ''; // Reset input
    }
};

window.removeImage = (url) => {
    const hiddenInput = document.getElementById('images-hidden');
    let currentUrls = hiddenInput.value ? hiddenInput.value.split(',') : [];
    currentUrls = currentUrls.filter(u => u !== url);
    hiddenInput.value = currentUrls.join(',');

    // Re-render is easiest way to update UI cleanly, or just remove the element. 
    // Since we don't have refs to elements easily, let's just find the img src.
    // But easier to just close and re-open form? No that loses unsaved changes.
    // Better to find the element.
    const imgs = document.querySelectorAll('#image-preview-container img');
    imgs.forEach(img => {
        if (img.src === url) {
            img.parentElement.remove();
        }
    });
};

window.openOrderEditForm = (o) => {
    const formHtml = `
        <div class="flex justify-between items-center mb-8 text-left"><h3 class="text-2xl font-black text-gray-900 uppercase tracking-tighter text-left">Rendelés Módosítása</h3><button onclick="window.closeModal()" class="text-gray-300 hover:text-black transition-colors cursor-pointer text-left"><i class="fa-solid fa-times text-2xl text-left"></i></button></div>
        <form id="order-edit-form" class="space-y-6 text-left">
            <input type="hidden" name="id" value="${o.id}">
            
            <!-- Items List -->
            <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 max-h-40 overflow-y-auto custom-scrollbar mb-4">
                <h4 class="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest text-left">Rendelt Termékek</h4>
                ${o.items && o.items.length ? o.items.map(i => `
                    <div class="flex justify-between items-center mb-2 last:mb-0 p-2 bg-white rounded-xl border border-gray-100">
                        <div class="flex items-center gap-3">
                            <span class="font-bold text-gray-900 text-xs">${i.qty}x</span>
                            <span class="text-xs font-bold text-gray-700 truncate max-w-[150px]">${i.name}</span>
                        </div>
                        <span class="text-xs font-black text-gray-900">${(i.price * i.qty).toLocaleString()} Ft</span>
                    </div>
                `).join('') : '<p class="text-xs text-gray-400">Nincs termék rögzítve.</p>'}
            </div>

            <div class="bg-brand-50 p-6 rounded-3xl border border-brand-100 mb-8 text-left">
                <div class="text-[10px] font-black uppercase text-brand-500 mb-2 tracking-widest text-left">Fizetendő összeg</div>
                <div class="text-3xl font-black text-gray-900 text-left">${o.total.toLocaleString()} Ft</div>
            </div>
            
            <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Vásárló Neve</label><input required name="name" value="${o.name}" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-900 font-bold shadow-inner text-left"></div>
            <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left text-left">Cím</label><textarea required name="address" rows="2" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-900 font-bold shadow-inner text-left">${o.address}</textarea></div>
            <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left text-left text-left">Státusz</label><select name="status" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none text-gray-900 font-black text-left shadow-inner"><option value="Új rendelés" ${o.status === 'Új rendelés' ? 'selected' : ''}>Új rendelés</option><option value="Feldolgozás alatt" ${o.status === 'Feldolgozás alatt' ? 'selected' : ''}>Feldolgozás alatt</option><option value="Kiszállítás alatt" ${o.status === 'Kiszállítás alatt' ? 'selected' : ''}>Kiszállítás alatt</option><option value="Kiszállítva" ${o.status === 'Kiszállítva' ? 'selected' : ''}>Kiszállítva</option></select></div>
            <button type="submit" class="btn-design-large py-5 text-sm uppercase tracking-[0.3em] mt-6 text-left cursor-pointer">Frissítés</button>
        </form>`;
    window.openModal(formHtml);
};

window.deleteProduct = async (i) => { if (confirm("Törlöd?")) { await backend.delete('products', i); await store.loadData(); renderView(false); window.showToast("Sikeresen törölve."); } };
window.deleteOrder = async (i) => { if (confirm("Biztosan törlöd a rendelést?")) { await backend.delete('orders', i); await store.loadData(); renderView(false); window.showToast("Rendelés eltávolítva."); } };

window.updateQty = (i, d) => {
    const item = store.state.cart[i];

    // Prevent decreasing below 1
    if (d === -1 && item.qty <= 1) {
        return;
    }

    item.qty += d;

    if (item.qty < 1) {
        // Should not happen due to check above, but safety net
        item.qty = 1;
    }

    // Direct DOM Update for Smoothness
    store.saveCart();

    const qtyEl = document.getElementById(`qty-${i}`);
    const priceEl = document.getElementById(`price-${i}`);

    if (qtyEl) qtyEl.innerText = item.qty;
    if (priceEl) priceEl.innerText = (item.price * item.qty).toLocaleString() + ' Ft';

    updateCartTotals();
};

window.removeFromCart = (i) => {
    store.state.cart.splice(i, 1);
    store.saveCart();
    renderView(false);
};

function updateCartTotals() {
    const total = store.state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const threshold = 15000;
    const remaining = Math.max(0, threshold - total);
    const percentage = Math.min(100, (total / threshold) * 100);
    const isFree = remaining <= 0;

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerText = total.toLocaleString();

    const freeText = document.getElementById('free-shipping-text');
    const freeAmt = document.getElementById('free-shipping-amount');
    const progBar = document.getElementById('progress-bar');
    const card = document.getElementById('free-shipping-card');
    const msg = document.getElementById('total-free-msg');

    if (freeText) {
        freeText.className = `text-xs font-black uppercase tracking-widest ${isFree ? 'text-green-600' : 'text-gray-500'}`;
    }
    if (freeAmt) {
        freeAmt.innerText = isFree ? 'ELÉRTED!' : remaining.toLocaleString() + ' Ft hiányzik';
        freeAmt.className = `text-[11px] font-black uppercase ${isFree ? 'text-green-600 animate-pulse' : 'text-brand-500'}`;
    }
    if (progBar) {
        progBar.style.width = `${percentage}%`;
        progBar.className = `progress-bar-inner ${isFree ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-brand-500'} h-full`;
    }
    if (card) {
        card.className = `bg-surface-50 p-8 rounded-[2.5rem] mb-12 border border-gray-100 shadow-sm relative overflow-hidden transition-all duration-500 ${isFree ? 'ring-2 ring-green-500/20' : ''}`;
    }
    if (msg) {
        if (isFree) msg.classList.remove('hidden'); else msg.classList.add('hidden');
    }
}

// Lightbox Logic - Preload
let bubbleTimer;
window.expandFloatingCart = (p) => {
    const bubble = document.getElementById('floating-cart-bubble');
    const bgImg = document.getElementById('bubble-bg-img');
    const preview = document.getElementById('bubble-preview');
    const thumb = document.getElementById('bubble-prod-thumb');
    const name = document.getElementById('bubble-prod-name');
    const ui = document.getElementById('bubble-ui');

    clearTimeout(bubbleTimer);
    const img = p.images?.[0] || p.image;
    if (bgImg) { bgImg.src = img; bgImg.style.opacity = '1'; }
    if (thumb) thumb.src = img;
    if (name) name.innerText = p.name;

    bubble.classList.remove('hidden');
    bubble.classList.add('bubble-expanded');
    ui.classList.add('hidden');
    preview.classList.remove('hidden');

    bubbleTimer = setTimeout(() => {
        bubble.classList.remove('bubble-expanded');
        preview.classList.add('hidden');
        ui.classList.remove('hidden');
        if (bgImg) bgImg.style.opacity = '0.4';
    }, 3500);
};

window.showToast = (msg) => {
    const t = document.createElement('div');
    t.className = "bg-brand-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up text-[10px] font-black uppercase tracking-widest border border-white/10 pointer-events-auto text-left";
    t.innerHTML = `<i class="fa-solid fa-check-circle text-green-500 text-sm text-left"></i> ${msg}`;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => { t.classList.add('opacity-0'); setTimeout(() => t.remove(), 500); }, 3000);
};

// Make renderView global
window.renderView = renderView;
window.views = views;
window.getProductsGridHtml = getProductsGridHtml;
window.renderBreadcrumbs = renderBreadcrumbs;

// Lightbox Logic
let currentLightboxImages = [];
let currentLightboxIndex = 0;

window.openLightbox = (productId, index = 0) => {
    const p = store.state.products.find(x => x.id === productId);
    if (!p) return;
    currentLightboxImages = p.images && p.images.length > 0 ? p.images : [p.image];
    currentLightboxIndex = index;
    updateLightboxImage();
    const lb = document.getElementById('lightbox');
    if (lb) {
        lb.classList.remove('hidden');
        setTimeout(() => lb.classList.add('open'), 10);
    }
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = () => {
    const lb = document.getElementById('lightbox');
    if (lb) {
        lb.classList.remove('open');
        setTimeout(() => lb.classList.add('hidden'), 300);
    }
    document.body.style.overflow = '';
};

window.changeLightboxImage = (dir) => {
    currentLightboxIndex += dir;
    if (currentLightboxIndex < 0) currentLightboxIndex = currentLightboxImages.length - 1;
    if (currentLightboxIndex >= currentLightboxImages.length) currentLightboxIndex = 0;
    updateLightboxImage();
};

window.updateLightboxImage = () => {
    const imgId = document.getElementById('lightbox-img');
    const counterId = document.getElementById('lightbox-counter');
    if (imgId) imgId.src = currentLightboxImages[currentLightboxIndex];
    if (counterId) counterId.innerText = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
};
