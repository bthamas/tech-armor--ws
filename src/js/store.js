import { TechBackend, auth } from './firebase.js';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const backend = new TechBackend();

export const store = {
    state: {
        products: [],
        cart: JSON.parse(localStorage.getItem('ta_cart')) || [],
        wishlist: JSON.parse(localStorage.getItem('ta_wishlist')) || [],
        orders: [],
        searchQuery: '',
        currentCategory: 'Mind',
        demoMode: false,
        settings: {
            bannerEnabled: true,
            bannerText: "Ingyenes szállítás 15.000 Ft felett!",
            bannerColor: "#0071e3"
        }
    },

    async init() {
        // Fallback timeout
        const timeout = setTimeout(() => {
            if (this.state.products.length === 0) {
                this.activateDemoMode();
                this.loadData().then(() => this.finishInit());
            }
        }, 4000);

        try {
            if (typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
                await signInWithCustomToken(auth, window.__initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
        } catch (e) {
            this.activateDemoMode();
        }

        onAuthStateChanged(auth, async (u) => {
            clearTimeout(timeout);
            if (!u) this.state.demoMode = true;
            await this.loadData();
            this.finishInit();
        });
    },

    activateDemoMode() {
        this.state.demoMode = true;
        const bar = document.getElementById('status-bar');
        const text = document.getElementById('status-text');
        if (bar && text) {
            bar.classList.remove('hidden');
            bar.classList.add('bg-amber-500');
            text.innerHTML = '<i class="fa-solid fa-flask mr-1"></i> Fallback Mód (Helyi Adatok)';
        }
    },

    finishInit() {
        document.getElementById('app-loader')?.classList.add('opacity-0');
        setTimeout(() => document.getElementById('app-loader')?.classList.add('hidden'), 500);

        const bar = document.getElementById('status-bar');
        const text = document.getElementById('status-text');
        if (bar && text && !this.state.demoMode) {
            bar.classList.remove('hidden');
            bar.classList.add('bg-green-600');
            text.innerHTML = '<i class="fa-solid fa-cloud-check mr-1"></i> Felhő Adatbázis Kapcsolat Aktív';
        }

        document.getElementById('admin-btn')?.classList.remove('hidden');
        this.applySettings();
        if (window.renderView) window.renderView();
    },

    applySettings() {
        const bar = document.getElementById('top-info-bar');
        if (bar) {
            bar.style.backgroundColor = this.state.settings.bannerColor;
            document.getElementById('top-info-text').innerText = this.state.settings.bannerText;
            bar.classList.toggle('hidden', !this.state.settings.bannerEnabled);
        }
    },

    async loadData() {
        this.state.products = await backend.fetchAll('products');
        this.state.orders = await backend.fetchAll('orders');

        // Initial Mock Data if parameters are empty
        if (this.state.products.length === 0) {
            const mockProducts = [
                // Tokok (4 db)
                { name: "Carbon Fiber MagSafe Case - iPhone 15", price: 9990, salePrice: 7990, category: "Tokok", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800", images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800", "https://images.unsplash.com/photo-1586105251261-72a756613a01?w=800", "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?w=800"], description: "Prémium szénszálas kialakítás MagSafe kompatibilitással." },
                { name: "Liquid Silicone Soft-Touch Case", price: 6990, category: "Tokok", image: "https://images.unsplash.com/photo-1603313011101-31405e54d688?w=800", images: ["https://images.unsplash.com/photo-1603313011101-31405e54d688?w=800", "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800"], description: "Selymes tapintású, ütésálló szilikon tok." },
                { name: "Rugged Armor Extreme Defense", price: 11990, category: "Tokok", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800", images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800"], description: "Katonai szintű védelem a legextrémebb helyzetekre." },
                { name: "Minimalist Clear Back Case", price: 5490, category: "Tokok", image: "https://images.unsplash.com/photo-1576133600321-4d375a0048e4?w=800", images: ["https://images.unsplash.com/photo-1576133600321-4d375a0048e4?w=800"], description: "Kristálytiszta hátlap, amely kiemeli a telefon színét." },
                // Fóliák (4 db)
                { name: "Devia 9H Nano Glass Pro", price: 4990, category: "Fóliák", image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800", images: ["https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800", "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=800"], description: "Karcálló nano-üveg technológia a kijelző épségéért." },
                { name: "Matte Privacy Screen Protector", price: 5990, category: "Fóliák", image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800", images: ["https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800"], description: "Betekintés elleni védelem és ujjlenyomat-mentes felület." },
                { name: "Ultra-Clear HD Protection", price: 3990, category: "Fóliák", image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800", images: ["https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800"], description: "Láthatatlan védelem kristálytiszta minőségben." },
                { name: "Anti-Blue Light Shield", price: 5490, category: "Fóliák", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800", images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800"], description: "Szűri a kék fényt, megvédve a szemeket a fáradástól." },
                // Kamera védők (4 db)
                { name: "Sapphire Lens Guard Ring", price: 3490, category: "Kamera védők", image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800", images: ["https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800"], description: "Egyedi gyűrűk a lencsék teljes körű védelmére." },
                { name: "Full Camera Area Protector", price: 2990, category: "Kamera védők", image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800", images: ["https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800"], description: "A teljes kameraszigetet lefedő edzett üveg védelem." },
                { name: "Alu-Pro Lens Frame", price: 4490, category: "Kamera védők", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800", images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800"], description: "Alumínium keretes védelem a karcok ellen." },
                { name: "Bling Diamond Camera Cover", price: 3990, category: "Kamera védők", image: "https://images.unsplash.com/photo-1586105251261-72a756613a01?w=800", images: ["https://images.unsplash.com/photo-1586105251261-72a756613a01?w=800"], description: "Csillogó kövekkel díszített prémium védőgyűrűk." }
            ];
            if (!this.state.demoMode && auth?.currentUser) {
                // In production, we usually wouldn't auto-seed like this, but for the task request we keep it.
                // However, let's avoid auto-seeding to Firestore to prevent spam if not needed.
                // Just use mocks in memory for now if empty.
                this.state.products = mockProducts.map((p, i) => ({ ...p, id: 'mk' + i }));
            } else {
                this.state.products = mockProducts.map((p, i) => ({ ...p, id: 'm' + i }));
            }
        }

        if (this.state.orders.length === 0) {
            const mockOrders = [
                { name: "Kovács János", address: "1011 Budapest, Fő utca 12.", total: 12500, status: "Új rendelés", date: new Date().toISOString() },
                { name: "Nagy Andrea", address: "4024 Debrecen, Piac utca 5.", total: 8900, status: "Kiszállítva", date: new Date().toISOString() },
                { name: "Szabó Erika", address: "8000 Székesfehérvár, Budai út 5.", total: 15400, status: "Feldolgozás alatt", date: new Date().toISOString() }
            ];
            if (this.state.demoMode) this.state.orders = mockOrders.map((o, i) => ({ ...o, id: 'om' + i }));
        }
        this.updateUIBadges();
    },

    addToCart(id) {
        const p = this.state.products.find(x => x.id === id);
        if (!p) return;
        const exist = this.state.cart.find(i => i.id === p.id);
        const price = p.salePrice || p.price;
        if (exist) exist.qty++;
        else this.state.cart.push({ ...p, price, qty: 1 });
        this.saveCart();
        window.expandFloatingCart(p);
    },

    saveCart() {
        localStorage.setItem('ta_cart', JSON.stringify(this.state.cart));
        this.updateUIBadges();
    },

    toggleWishlist(id) {
        const idx = this.state.wishlist.indexOf(id);
        if (idx > -1) this.state.wishlist.splice(idx, 1);
        else this.state.wishlist.push(id);
        localStorage.setItem('ta_wishlist', JSON.stringify(this.state.wishlist));
        this.updateUIBadges();
        // If on wishlist page, re-render
        if (window.location.hash.includes('wishlist') && window.renderView) window.renderView(false);
    },

    updateUIBadges() {
        const c = this.state.cart.reduce((a, b) => a + b.qty, 0);
        const w = this.state.wishlist.length;
        const setBadge = (id, val) => {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = val;
                el.classList.toggle('hidden', val === 0);
            }
        };
        setBadge('cart-badge', c);
        setBadge('wishlist-badge', w);
        setBadge('bubble-count', c);
        if (c > 0) document.getElementById('floating-cart-bubble')?.classList.remove('hidden');

        document.querySelectorAll('[data-wish-id]').forEach(btn => {
            const id = btn.getAttribute('data-wish-id');
            const icon = btn.querySelector('i');
            if (icon) icon.className = this.state.wishlist.includes(id) ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart';
        });
    },

    // Getters for computed properties (to avoid modifying state structure too much)
    get backend() { return backend; }
};

// Make it global for HTML inline event handlers
window.store = store;
