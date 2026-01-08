import { store } from './store.js';
import { router } from './router.js';
import { renderView } from './views.js';
import { db, auth, TechBackend } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const backend = new TechBackend();

// Global Event Listeners
window.addEventListener('hashchange', () => {
    window.renderView(true);
    window.closeModal();
});

document.getElementById('global-search')?.addEventListener('input', (e) => {
    store.state.searchQuery = e.target.value;
    const grid = document.getElementById('catalog-grid');
    if (grid) grid.innerHTML = window.getProductsGridHtml();
});

document.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (e.target.id === 'login-form') {
        const fd = new FormData(e.target);
        const email = fd.get('email');
        const password = fd.get('password');

        // Admin Shortcut for Testing
        if (email === 'admin@techarmor.hu' && password === 'admin123') {
            localStorage.setItem('mock_admin_auth', 'true');
            window.router.navigate('admin/dashboard');
            window.showToast("Demo Admin belépés sikeres!");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.router.navigate('admin_products');
        } catch (error) {
            alert("Hibás bejelentkezés: " + error.message);
        }
    }

    if (e.target.id === 'order-form') {
        const fd = new FormData(e.target);
        const method = fd.get('paymentMethod');

        if (method === 'card') {
            // Simulate Payment Processing
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Fizetés feldolgozása...`;

            await new Promise(r => setTimeout(r, 2000));

            // "Validation"
            if (Math.random() > 0.9) {
                btn.disabled = false;
                btn.innerHTML = originalText;
                alert("Hiba a kártyás fizetés során. Kérjük próbálja újra.");
                return;
            }
        }

        const total = store.state.cart.reduce((a, b) => a + (b.price * b.qty), 0);
        const orderId = await backend.save('orders', {
            ...Object.fromEntries(fd.entries()),
            total,
            status: 'Új rendelés',
            date: new Date().toISOString()
        });
        store.state.cart = [];
        store.saveCart();
        window.router.navigate('success', orderId);
    }

    if (e.target.id === 'product-form') {
        const fd = new FormData(e.target);
        const imgs = fd.get('images').split(',').map(s => s.trim()).filter(s => s !== "");
        await backend.save('products', {
            id: fd.get('id') || undefined,
            name: fd.get('name'),
            price: Number(fd.get('price')),
            category: fd.get('category'),
            images: imgs,
            image: imgs[0] || "",
            salePrice: fd.get('salePrice') ? Number(fd.get('salePrice')) : null,
            description: fd.get('description')
        });
        await store.loadData();
        window.closeModal();
        window.renderView(false);
        window.showToast("Adatok sikeresen mentve!");
    }

    if (e.target.id === 'order-edit-form') {
        const fd = new FormData(e.target);
        const orderId = fd.get('id');
        const order = store.state.orders.find(x => x.id === orderId);
        if (order) {
            order.name = fd.get('name');
            order.address = fd.get('address');
            order.status = fd.get('status');
            await backend.save('orders', order);
            await store.loadData();
            window.closeModal();
            window.renderView(false);
            window.showToast("Megrendelés frissítve!");
        }
    }

    if (e.target.id === 'settings-form-cloud') {
        const fd = new FormData(e.target);
        const data = {
            bannerText: fd.get('bannerText'),
            bannerColor: fd.get('bannerColor'),
            bannerEnabled: fd.get('bannerEnabled') === 'true'
        };
        store.state.settings = data;
        await backend.saveSettings(data);
        store.applySettings();
        window.showToast("Beállítások felhőbe mentve!");
    }
});

// Initialize App
store.init();
