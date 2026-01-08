import { store } from './store.js';
import { router } from './router.js';
import { auth } from './firebase.js';

export const adminViews = {
    layout: (content, activeMenu) => `
        <div class="flex h-screen bg-surface-50 font-sans text-left">
            <!-- Sidebar -->
            <aside class="w-64 bg-white border-r border-gray-100 flex flex-col fixed md:relative z-20 h-full transition-transform transform -translate-x-full md:translate-x-0" id="admin-sidebar">
                <div class="p-6 border-b border-gray-50 flex items-center gap-3">
                    <div class="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-900/20"><i class="fa-solid fa-shield-halved"></i></div>
                    <span class="font-black text-lg tracking-tight uppercase">Admin<span class="text-brand-500">Panel</span></span>
                </div>
                
                <nav class="flex-grow p-4 space-y-2 overflow-y-auto hide-scrollbar">
                    <div class="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] px-4 py-2 mt-2">Áttekintés</div>
                    ${renderMenuItem('dashboard', 'fa-chart-pie', 'Vezérlőpult', activeMenu)}
                    
                    <div class="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] px-4 py-2 mt-4">Kereskedelem</div>
                    ${renderMenuItem('orders', 'fa-receipt', 'Rendelések', activeMenu)}
                    ${renderMenuItem('products', 'fa-box-open', 'Termékek', activeMenu)}
                    ${renderMenuItem('categories', 'fa-folder-tree', 'Kategóriák', activeMenu)}
                    ${renderMenuItem('customers', 'fa-users', 'Vásárlók', activeMenu)}
                    
                    <div class="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] px-4 py-2 mt-4">Egyéb</div>
                    ${renderMenuItem('marketing', 'fa-bullhorn', 'Marketing', activeMenu)}
                    ${renderMenuItem('content', 'fa-file-lines', 'Tartalom', activeMenu)}
                    ${renderMenuItem('settings', 'fa-sliders', 'Beállítások', activeMenu)}
                </nav>

                <div class="p-4 border-t border-gray-50 bg-gray-50/50">
                    <button onclick="window.router.navigate('home')" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-500 hover:bg-white hover:shadow-md hover:text-brand-900 transition-all">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i> Kilépés a Shopba
                    </button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-grow flex flex-col h-screen overflow-hidden relative bg-surface-50">
                <!-- Top Bar -->
                <header class="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0">
                    <button class="md:hidden text-gray-500 hover:text-brand-900 mr-4" onclick="document.getElementById('admin-sidebar').classList.toggle('-translate-x-full')">
                        <i class="fa-solid fa-bars text-xl"></i>
                    </button>
                    
                    <div class="w-full max-w-lg relative hidden md:block group">
                        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs group-focus-within:text-brand-500 transition-colors"></i>
                        <input type="text" placeholder="Keresés rendelésre, termékre, vevőre..." class="w-full bg-surface-50 border-none rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500/10 focus:bg-white transition-all font-medium text-gray-600 placeholder-gray-400 shadow-inner focus:shadow-xl">
                    </div>

                    <div class="flex items-center gap-6">
                        <button class="relative w-10 h-10 rounded-full hover:bg-surface-50 flex items-center justify-center text-gray-400 hover:text-brand-600 transition-colors cursor-pointer">
                            <i class="fa-regular fa-bell text-lg"></i>
                            <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div class="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div class="text-right hidden sm:block">
                                <div class="text-[11px] font-black uppercase tracking-widest text-gray-900">Admin</div>
                                <div class="text-[9px] font-bold text-gray-400">Super User</div>
                            </div>
                            <div class="w-10 h-10 rounded-xl bg-brand-900 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-brand-900/20">A</div>
                        </div>
                    </div>
                </header>

                <!-- Page Content -->
                <div class="flex-grow overflow-auto p-6 md:p-10 hide-scrollbar scroll-smooth" id="admin-content">
                    <div class="max-w-7xl mx-auto animate-fade-in pb-20">
                        ${content}
                    </div>
                </div>
            </main>
        </div>
    `,

    dashboard: () => {
        // Calculations
        const orders = store.state.orders || [];
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'Új rendelés' || o.status === 'Feldolgozás alatt').length;
        const totalCustomers = new Set(orders.map(o => o.email)).size + 1200; // Mock base + actual

        // Recent Orders (Last 5)
        const recentOrders = [...orders].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5);

        return adminViews.layout(`
            <div class="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Vezérlőpult</h1>
                    <p class="text-gray-400 text-sm font-medium">Áttekintés az üzlet teljesítményéről.</p>
                </div>
                <div class="flex gap-3">
                    <button class="btn-primary bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100 text-[10px] px-6 py-3 uppercase tracking-widest" onclick="alert('Demo: Riport letöltése')"><i class="fa-solid fa-download mr-2"></i> Export</button>
                    <button class="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest" onclick="window.renderView(false)"><i class="fa-solid fa-rotate mr-2"></i> Frissítés</button>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                ${renderKPIGrid(totalRevenue, orders.length, pendingOrders, totalCustomers)}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Chart Section -->
                <div class="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
                    <div class="flex justify-between items-center mb-8">
                        <h3 class="text-lg font-black text-gray-900">Bevétel alakulása</h3>
                        <select class="bg-gray-50 border-none rounded-lg text-xs font-bold text-gray-500 px-3 py-1 outline-none"><option>Elmúlt 30 nap</option></select>
                    </div>
                    <div class="flex-grow flex items-end justify-between gap-2 h-64 w-full pb-2">
                        ${renderCSSChart()}
                    </div>
                </div>

                <!-- Recent Orders List -->
                <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
                    <h3 class="text-lg font-black text-gray-900 mb-6">Legutóbbi Rendelések</h3>
                    <div class="overflow-y-auto max-h-[300px] pr-2 space-y-4">
                        ${recentOrders.length ? recentOrders.map(o => `
                            <div class="flex items-center justify-between p-4 rounded-2xl bg-surface-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group cursor-pointer" onclick='window.router.navigate("admin/orders")'>
                                <div>
                                    <div class="font-bold text-gray-900 text-sm">${o.name}</div>
                                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">${o.total.toLocaleString()} Ft</div>
                                </div>
                                <div class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(o.status)}">${o.status}</div>
                            </div>
                        `).join('') : '<div class="text-gray-400 text-center py-10 font-medium">Nincs friss rendelés</div>'}
                    </div>
                    <button onclick="window.router.navigate('admin/orders')" class="mt-auto w-full py-4 text-center text-xs font-black uppercase tracking-widest text-brand-500 hover:text-brand-900 transition-colors border-t border-gray-50 pt-6">Összes megtekintése</button>
                </div>
            </div>
        `, 'dashboard');
    },

    orders: () => {
        const orders = store.state.orders || [];
        return adminViews.layout(`
            <div class="flex justify-between items-end mb-8">
                <div>
                    <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Rendelések</h1>
                    <p class="text-gray-400 text-sm font-medium">Böngéssz a beérkezett rendelések között.</p>
                </div>
                <button class="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest" onclick="alert('Demo: CSV Export')"><i class="fa-solid fa-file-csv mr-2"></i> Export</button>
            </div>

            <!-- Filters -->
            <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
                <div class="relative flex-grow max-w-xs">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                    <input type="text" placeholder="Keresés név, ID..." class="w-full bg-surface-50 border-none rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10">
                </div>
                <select class="bg-surface-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none text-gray-600 cursor-pointer">
                    <option>Összes státusz</option>
                    <option>Új rendelés</option>
                    <option>Feldolgozás alatt</option>
                    <option>Kiszállítva</option>
                </select>
                <input type="date" class="bg-surface-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none text-gray-600 cursor-pointer">
            </div>

            <!-- Orders Table -->
            <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <th class="p-6">Rendelés ID</th>
                                <th class="p-6">Dátum</th>
                                <th class="p-6">Vásárló</th>
                                <th class="p-6">Végösszeg</th>
                                <th class="p-6">Státusz</th>
                                <th class="p-6 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            ${orders.length ? orders.map(o => `
                                <tr class="hover:bg-surface-50 transition-colors group">
                                    <td class="p-6 font-mono text-xs font-bold text-gray-500">#${o.id.substring(0, 8).toUpperCase()}</td>
                                    <td class="p-6 text-sm font-bold text-gray-600">${o.date || new Date().toLocaleDateString('hu-HU')}</td>
                                    <td class="p-6">
                                        <div class="font-black text-gray-900 text-sm">${o.name}</div>
                                        <div class="text-[10px] text-gray-400">${o.email || '-'}</div>
                                    </td>
                                    <td class="p-6 font-black text-gray-900">${o.total.toLocaleString()} Ft</td>
                                    <td class="p-6"><span class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(o.status)}">${o.status}</span></td>
                                    <td class="p-6 text-right">
                                        <button onclick='window.openOrderEditForm(${JSON.stringify(o).replace(/'/g, "&#39;")})' class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-all shadow-sm"><i class="fa-solid fa-pen"></i></button>
                                        <button onclick="window.deleteOrder('${o.id}')" class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm ml-2"><i class="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="6" class="p-10 text-center text-gray-400 font-bold">Nincs megjeleníthető rendelés.</td></tr>'}
                        </tbody>
                    </table>
                </div>
                 <div class="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Összesen: ${orders.length} rendelés</span>
                    <div class="flex gap-2">
                        <button class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors disabled:opacity-50" disabled><i class="fa-solid fa-chevron-left"></i></button>
                        <button class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        `, 'orders');
    },
    products: () => {
        const products = store.state.products || [];
        return adminViews.layout(`
            <div class="flex justify-between items-end mb-8">
                <div>
                    <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Termékek</h1>
                    <p class="text-gray-400 text-sm font-medium">Kezeld a webshop kínálatát egy helyen.</p>
                </div>
                <button class="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest" onclick="window.openProductForm()"><i class="fa-solid fa-plus mr-2"></i> Új Termék</button>
            </div>

            <!-- Filters -->
            <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
                <div class="relative flex-grow max-w-xs">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                    <input type="text" placeholder="Keresés név, cikkszám..." class="w-full bg-surface-50 border-none rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10">
                </div>
                <select class="bg-surface-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none text-gray-600 cursor-pointer">
                    <option>Összes kategória</option>
                    <option>Tokok</option>
                    <option>Fóliák</option>
                    <option>Kiegészítők</option>
                </select>
                <select class="bg-surface-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none text-gray-600 cursor-pointer">
                    <option>Aktív termékek</option>
                    <option>Készlethiány</option>
                    <option>Inaktív</option>
                </select>
            </div>

            <!-- Products Table -->
            <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <th class="p-6">Termék</th>
                                <th class="p-6">Kategória</th>
                                <th class="p-6">Ár (Bruttó)</th>
                                <th class="p-6">Készlet</th>
                                <th class="p-6">SEO</th>
                                <th class="p-6 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            ${products.map(p => {
            const stock = Math.floor(Math.random() * 50); // Mock stock
            return `
                                <tr class="hover:bg-surface-50 transition-colors group">
                                    <td class="p-4">
                                        <div class="flex items-center gap-4">
                                            <img src="${p.images?.[0] || p.image}" class="w-12 h-12 rounded-xl object-cover border border-gray-100">
                                            <div>
                                                <div class="font-black text-gray-900 text-sm truncate max-w-[200px]">${p.name}</div>
                                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">SKU: ${p.id.substring(0, 6).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-6 text-xs font-bold text-gray-600">${p.category}</td>
                                    <td class="p-6 font-black text-gray-900">${(p.salePrice || p.price).toLocaleString()} Ft</td>
                                    <td class="p-6">
                                        <div class="flex items-center gap-2">
                                            <div class="w-2 h-2 rounded-full ${stock < 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}"></div>
                                            <span class="text-xs font-bold text-gray-600">${stock} db</span>
                                        </div>
                                    </td>
                                    <td class="p-6">
                                        <div class="flex gap-1">
                                            <span class="w-2 h-2 rounded-full bg-green-500" title="Meta Title OK"></span>
                                            <span class="w-2 h-2 rounded-full bg-gray-300" title="Meta Description Hiányzik"></span>
                                        </div>
                                    </td>
                                    <td class="p-6 text-right">
                                        <button onclick='window.openProductForm(${JSON.stringify(p).replace(/'/g, "&#39;")})' class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-all shadow-sm"><i class="fa-solid fa-pen"></i></button>
                                        <button onclick="window.deleteProduct('${p.id}')" class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm ml-2"><i class="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                </div>
                 <div class="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Összesen: ${products.length} termék</span>
                    <div class="flex gap-2">
                        <button class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors disabled:opacity-50" disabled><i class="fa-solid fa-chevron-left"></i></button>
                        <button class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        `, 'products');
    },
    categories: () => {
        // Mock Categories Tree
        const categories = [
            { id: 1, name: "Tokok", count: 124, parent: null },
            { id: 2, name: "iPhone Tokok", count: 86, parent: 1 },
            { id: 3, name: "Samsung Tokok", count: 38, parent: 1 },
            { id: 4, name: "Fóliák", count: 56, parent: null },
            { id: 5, name: "Üvegfóliák", count: 42, parent: 4 },
            { id: 6, name: "Hidrogél", count: 14, parent: 4 },
            { id: 7, name: "Kiegészítők", count: 32, parent: null },
        ];

        return adminViews.layout(`
            <div class="flex justify-between items-end mb-8">
                <div>
                    <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Kategóriák</h1>
                    <p class="text-gray-400 text-sm font-medium">Rendezd a termékeidet logikus struktúrába.</p>
                </div>
                <button class="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest"><i class="fa-solid fa-plus mr-2"></i> Új Kategória</button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Tree View -->
                <div class="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                    <h3 class="text-lg font-black text-gray-900 mb-6 flex items-center gap-3"><i class="fa-solid fa-folder-tree text-brand-500"></i> Struktúra</h3>
                    <div class="space-y-3">
                        ${categories.map(c => `
                            <div class="flex items-center justify-between p-4 rounded-2xl border ${c.parent ? 'ml-12 border-gray-50 bg-gray-50/50' : 'border-gray-100 bg-white shadow-sm'} group hover:border-brand-200 transition-all">
                                <div class="flex items-center gap-4">
                                    <div class="cursor-move text-gray-300 hover:text-gray-600 transition-colors"><i class="fa-solid fa-grip-vertical"></i></div>
                                    <div class="${c.parent ? 'text-gray-600 text-sm' : 'text-gray-900 font-bold'}">${c.name}</div>
                                    <div class="px-2 py-1 rounded-md bg-gray-100 text-[9px] font-black text-gray-400">${c.count} termék</div>
                                </div>
                                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-all shadow-sm"><i class="fa-solid fa-pen"></i></button>
                                    <button class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Quick Edit Mock -->
                <div class="bg-surface-50 rounded-[2.5rem] border border-gray-100 p-8 h-fit">
                    <h3 class="text-lg font-black text-gray-900 mb-6">Gyors Szerkesztés</h3>
                    <div class="space-y-4">
                        <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest text-left">Név</label><input type="text" value="Tokok" class="w-full bg-white border-none rounded-xl px-4 py-3 text-sm outline-none text-gray-900 font-bold shadow-sm"></div>
                        <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest text-left">Szülő Kategória</label><select class="w-full bg-white border-none rounded-xl px-4 py-3 text-sm outline-none text-gray-900 font-bold shadow-sm"><option>Nincs (Főkategória)</option></select></div>
                         <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest text-left">Kép</label><div class="h-32 bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 uppercase font-black text-[10px] tracking-widest cursor-pointer hover:border-brand-500 hover:text-brand-500 transition-colors">Kép feltöltése</div></div>
                        <button class="btn-primary w-full py-4 text-xs mt-4">Mentés</button>
                    </div>
                </div>
            </div>
        `, 'categories');
    },

    customers: () => {
        // Extract Customers from Orders
        const orders = store.state.orders || [];
        const customersMap = new Map();

        orders.forEach(o => {
            if (!customersMap.has(o.email)) {
                customersMap.set(o.email, {
                    name: o.name,
                    email: o.email,
                    address: o.address,
                    totalSpent: 0,
                    orderCount: 0,
                    lastOrder: o.date
                });
            }
            const c = customersMap.get(o.email);
            c.totalSpent += o.total;
            c.orderCount++;
            if (new Date(o.date) > new Date(c.lastOrder)) c.lastOrder = o.date;
        });

        const customers = Array.from(customersMap.values());

        return adminViews.layout(`
             <div class="flex justify-between items-end mb-8">
                <div>
                    <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Vásárlók</h1>
                    <p class="text-gray-400 text-sm font-medium">Kezeld az ügyfélbázisodat.</p>
                </div>
                <button class="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest"><i class="fa-solid fa-user-plus mr-2"></i> Új Vásárló</button>
            </div>

             <!-- Customers Table -->
            <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <th class="p-6">Név / Email</th>
                                <th class="p-6">Lokáció</th>
                                <th class="p-6">Rendelések</th>
                                <th class="p-6">Összes Költés</th>
                                <th class="p-6">Utolsó Aktivitás</th>
                                <th class="p-6 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            ${customers.length ? customers.map(c => `
                                <tr class="hover:bg-surface-50 transition-colors group">
                                    <td class="p-6">
                                        <div class="font-black text-gray-900 text-sm">${c.name}</div>
                                        <div class="text-[10px] text-gray-400 mt-0.5">${c.email}</div>
                                    </td>
                                    <td class="p-6 text-xs font-bold text-gray-500 max-w-xs truncate">${c.address.split(',')[0]}</td>
                                    <td class="p-6"><span class="bg-brand-50 text-brand-600 px-3 py-1 rounded-lg text-xs font-black">${c.orderCount} db</span></td>
                                    <td class="p-6 font-black text-gray-900">${c.totalSpent.toLocaleString()} Ft</td>
                                    <td class="p-6 text-xs font-bold text-gray-500">${new Date(c.lastOrder).toLocaleDateString('hu-HU')}</td>
                                    <td class="p-6 text-right">
                                        <button class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-all shadow-sm"><i class="fa-solid fa-eye"></i></button>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="6" class="p-10 text-center text-gray-400 font-bold">Nincs megjeleníthető vásárló.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `, 'customers');
    },
    marketing: () => {
        const coupons = [
            { code: "NYAR2024", type: "Százalék", value: "-15%", usage: "45/100", status: "active" },
            { code: "WELCOME10", type: "Fix összeg", value: "-1000 Ft", usage: "128/∞", status: "active" },
            { code: "INGYEN_SZALLITAS", type: "Szállítás", value: "Ingyenes", usage: "12/50", status: "expired" }
        ];

        return adminViews.layout(`
             <div class="flex justify-between items-end mb-8">
                <div>
                    <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Marketing</h1>
                    <p class="text-gray-400 text-sm font-medium">Kuponok és promóciók kezelése.</p>
                </div>
                <button class="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest"><i class="fa-solid fa-tag mr-2"></i> Új Kupon</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div class="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Hírlevél Feliratkozók</div>
                    <div class="text-3xl font-black text-gray-900">2,458 <span class="text-xs text-green-500 font-bold ml-2">+12%</span></div>
                 </div>
                 <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div class="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Aktív Promóciók</div>
                    <div class="text-3xl font-black text-brand-500">3 db</div>
                 </div>
                 <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow group">
                    <div class="flex items-center justify-center h-full gap-3 text-gray-400 group-hover:text-gray-900 transition-colors">
                        <i class="fa-solid fa-file-csv text-xl"></i>
                        <span class="font-black uppercase text-xs tracking-widest">Lista Exportálása</span>
                    </div>
                 </div>
            </div>

            <h3 class="text-lg font-black text-gray-900 mb-6">Kuponok</h3>
            <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                 <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <th class="p-6">Kód</th>
                            <th class="p-6">Típus</th>
                            <th class="p-6">Érték</th>
                            <th class="p-6">Felhasználás</th>
                            <th class="p-6">Státusz</th>
                            <th class="p-6 text-right">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${coupons.map(c => `
                            <tr class="hover:bg-surface-50 transition-colors">
                                <td class="p-6"><span class="font-mono font-black text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-700">${c.code}</span></td>
                                <td class="p-6 text-xs font-bold text-gray-600">${c.type}</td>
                                <td class="p-6 font-black text-brand-500">${c.value}</td>
                                <td class="p-6 text-xs font-bold text-gray-500">${c.usage}</td>
                                <td class="p-6"><span class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${c.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">${c.status === 'active' ? 'Aktív' : 'Lejárt'}</span></td>
                                <td class="p-6 text-right">
                                    <button class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-all shadow-sm"><i class="fa-solid fa-pen"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                 </table>
            </div>
        `, 'marketing');
    },

    content: () => {
        const pages = [
            { id: 'aszf', title: "Általános Szerződési Feltételek", updated: "2024.01.15" },
            { id: 'privacy', title: "Adatkezelési Tájékoztató", updated: "2023.11.20" },
            { id: 'shipping', title: "Szállítás és Fizetés", updated: "2023.10.05" },
            { id: 'about', title: "Rólunk", updated: "2023.09.01" }
        ];

        return adminViews.layout(`
             <div class="flex justify-between items-end mb-8">
                <div>
                    <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Tartalom</h1>
                    <p class="text-gray-400 text-sm font-medium">Információs oldalak és blog kezelése.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Static Pages -->
                <div>
                     <h3 class="text-lg font-black text-gray-900 mb-6">Statikus Oldalak</h3>
                     <div class="space-y-4">
                        ${pages.map(p => `
                            <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-brand-200 transition-all">
                                <div>
                                    <div class="font-black text-gray-900 text-sm">${p.title}</div>
                                    <div class="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Frissítve: ${p.updated}</div>
                                </div>
                                <button class="btn-primary text-[10px] px-6 py-2 uppercase tracking-widest"><i class="fa-solid fa-pen mr-2"></i> Szerkesztés</button>
                            </div>
                        `).join('')}
                     </div>
                </div>

                <!-- Appearance / Sliders -->
                <div>
                    <h3 class="text-lg font-black text-gray-900 mb-6">Megjelenés</h3>
                    <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Főoldali Banner</div>
                        <div class="bg-brand-900 h-32 rounded-2xl mb-4 flex items-center justify-center text-white/50 text-sm font-medium relative overflow-hidden group">
                           <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800" class="absolute inset-0 w-full h-full object-cover opacity-30">
                           <div class="relative z-10 font-bold uppercase tracking-widest">Jelenlegi Banner Kép</div>
                           <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                <button class="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Csere</button>
                           </div>
                        </div>
                        <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest text-left">Főcím Szöveg</label><input type="text" value="Vigyázz rá profizmussal." class="w-full bg-surface-50 border-none rounded-xl px-4 py-3 text-sm outline-none text-gray-900 font-bold shadow-inner"></div>
                    </div>
                </div>
            </div>
        `, 'content');
    },

    settings: () => {
        // Mock Settings Data (ideally from store.state.settings)
        const activeTab = 'general'; // State for tabs would need re-render logic, simplified here to show structure or use simple JS toggle

        // Just render all tabs and hide/show via JS for simplicity in this vanilla app
        return adminViews.layout(`
             <div class="flex justify-between items-end mb-8">
                <div>
                    <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Beállítások</h1>
                    <p class="text-gray-400 text-sm font-medium">A webshop működési paramétereinek konfigurálása.</p>
                </div>
                <button class="btn-primary text-[10px] px-6 py-3 uppercase tracking-widest"><i class="fa-solid fa-cloud-arrow-up mr-2"></i> Mentés</button>
            </div>

            <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col md:flex-row">
                <!-- Sidebar Tabs -->
                <div class="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
                    <button onclick="window.switchTab('general')" class="tab-btn active text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all text-brand-900 bg-white shadow-sm" data-tab="general"><i class="fa-solid fa-sliders w-6"></i> Általános</button>
                    <button onclick="window.switchTab('payment')" class="tab-btn text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all text-gray-500" data-tab="payment"><i class="fa-regular fa-credit-card w-6"></i> Fizetés</button>
                    <button onclick="window.switchTab('shipping')" class="tab-btn text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all text-gray-500" data-tab="shipping"><i class="fa-solid fa-truck-fast w-6"></i> Szállítás</button>
                    <button onclick="window.switchTab('admins')" class="tab-btn text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all text-gray-500" data-tab="admins"><i class="fa-solid fa-users-gear w-6"></i> Adminok</button>
                </div>
                
                <!-- Content Area -->
                <div class="flex-grow p-8 md:p-12">
                    
                    <!-- General Settings -->
                    <div id="tab-general" class="tab-content animate-fade-in block space-y-8">
                        <h3 class="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-6">Általános Beállítások</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Bolt Neve</label><input type="text" value="TechArmor Webshop" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner"></div>
                             <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Kapcsolat Email</label><input type="text" value="info@techarmor.hu" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner"></div>
                             <div class="text-left md:col-span-2"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Bolt Leírása (SEO)</label><textarea rows="3" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner">Prémium mobil kiegészítők, tokok és fóliák széles választékban.</textarea></div>
                        </div>
                    </div>

                    <!-- Payment Settings -->
                    <div id="tab-payment" class="tab-content hidden space-y-8 animate-fade-in">
                        <h3 class="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-6">Fizetési Módok</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-6 bg-surface-50 rounded-2xl border border-gray-100">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm"><i class="fa-solid fa-money-bill-wave"></i></div>
                                    <div><div class="font-black text-gray-900 text-sm">Utánvét</div><div class="text-xs text-gray-500">Fizetés átvételkor a futárnál.</div></div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked class="sr-only peer">
                                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>
                            <div class="flex items-center justify-between p-6 bg-surface-50 rounded-2xl border border-gray-100">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-500 shadow-sm"><i class="fa-regular fa-credit-card"></i></div>
                                    <div><div class="font-black text-gray-900 text-sm">Bankkártyás fizetés (Stripe)</div><div class="text-xs text-gray-500">Biztonságos online fizetés.</div></div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked class="sr-only peer">
                                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Settings -->
                    <div id="tab-shipping" class="tab-content hidden space-y-8 animate-fade-in">
                        <h3 class="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-6">Szállítási Beállítások</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Alap Szállítási Díj</label><input type="number" value="1490" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner"></div>
                             <div class="text-left"><label class="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest text-left">Ingyenes Szállítási Limit</label><input type="number" value="15000" class="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-bold shadow-inner"></div>
                        </div>
                    </div>

                    <!-- Admins Settings -->
                    <div id="tab-admins" class="tab-content hidden space-y-8 animate-fade-in">
                        <h3 class="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-6">Adminisztrátorok</h3>
                        <div class="bg-surface-50 rounded-2xl border border-gray-100 p-4">
                            <div class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">A</div>
                                    <span class="font-bold text-gray-900 text-sm">admin@techarmor.hu</span>
                                </div>
                                <span class="bg-brand-50 text-brand-600 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">Super Admin</span>
                            </div>
                             <button class="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:border-brand-500 hover:text-brand-500 transition-colors">Új Admin Hozzáadása</button>
                        </div>
                    </div>

                </div>

                </div >
            </div >

    <script>
                // Simple Tab Switcher Logic
                window.switchTab = (tabId) => {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.getElementById('tab-' + tabId).classList.remove('hidden');
                    
                    document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('bg-white', 'shadow-sm', 'text-brand-900');
        btn.classList.add('text-gray-500');
                    });

        const activeBtn = document.querySelector('.tab-btn[data-tab="' + tabId + '"]');
        if(activeBtn) {
            activeBtn.classList.add('bg-white', 'shadow-sm', 'text-brand-900');
        activeBtn.classList.remove('text-gray-500');
                    }
                };
    </script>
`, 'settings');
    },
};

// Global Helpers for Admin
window.toggleBulkMenu = () => {
    const menu = document.getElementById('bulk-menu');
    if (menu) menu.classList.toggle('hidden');
};

window.toggleAllCheckboxes = (source) => {
    const checkboxes = document.querySelectorAll('.prod-checkbox');
    checkboxes.forEach(cb => cb.checked = source.checked);
    window.updateBulkBtn();
};

window.updateBulkBtn = () => {
    const count = document.querySelectorAll('.prod-checkbox:checked').length;
    const btn = document.getElementById('bulk-actions-btn');
    if (btn) {
        if (count > 0) {
            btn.classList.remove('hidden');
            btn.innerHTML = `<i class="fa-solid fa-layer-group mr-2"></i> Kijelöltek (${count}) <i class="fa-solid fa-chevron-down ml-2"></i>`;
        } else {
            btn.classList.add('hidden');
        }
    }
};

window.bulkAction = async (action) => {
    const checked = Array.from(document.querySelectorAll('.prod-checkbox:checked')).map(cb => cb.value);
    if (!checked.length) return;

    if (action === 'delete') {
        if (confirm(`${checked.length} termék törlése. Biztos vagy benne?`)) {
            // Mock delete
            store.state.products = store.state.products.filter(p => !checked.includes(p.id));
            window.showToast(`${checked.length} termék törölve.`);
            adminViews.products(); // Re-render
        }
    } else if (action === 'sale') {
        // Mock sale
        store.state.products.forEach(p => {
            if (checked.includes(p.id)) {
                p.salePrice = Math.floor(p.price * 0.9); // 10% off
                p.saleStartDate = new Date().toISOString().split('T')[0];
            }
        });
        window.showToast(`${checked.length} termék akciózva (-10%).`);
        adminViews.products();
    }
    // In a real app we would call backend API here
};

window.toggleProductStatus = (id) => {
    const p = store.state.products.find(x => x.id === id);
    if (p) {
        p.status = p.status === 'inactive' ? 'active' : 'inactive';
        adminViews.products(); // Re-render
        window.showToast(`Termék státusza módosítva: ${p.status === 'active' ? 'Aktív' : 'Inaktív'}`);
    }
};


function renderMenuItem(id, icon, label, active) {
    const isActive = active === id || (active === 'dashboard' && id === 'dashboard' && !active); // Default dash
    const activeClass = "bg-brand-900 text-white shadow-xl shadow-brand-900/20";
    const inactiveClass = "text-gray-500 hover:bg-surface-50 hover:text-brand-900";

    return `
        <button onclick="window.router.navigate('admin/${id}')" 
            class="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${isActive ? activeClass : inactiveClass}">
            <i class="fa-solid ${icon} w-5 text-center text-sm ${isActive ? '' : 'opacity-70'}"></i>
            ${label}
        </button>
    `;
}

function renderKPIGrid(revenue = 0, count = 0, pending = 0, customers = 0) {
    const cards = [
        { label: 'Mai bevétel', val: revenue.toLocaleString() + ' Ft', icon: 'fa-coins', color: 'text-brand-500' },
        { label: 'Rendelések', val: count + ' db', icon: 'fa-bag-shopping', color: 'text-gray-900' },
        { label: 'Függőben', val: pending + ' db', icon: 'fa-clock', color: 'text-orange-500' },
        { label: 'Vásárlók', val: customers.toLocaleString(), icon: 'fa-users', color: 'text-gray-900' }
    ];

    return cards.map(c => `
        <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group cursor-pointer animate-slide-up">
            <div class="flex justify-between items-start mb-4">
                <div class="w-10 h-10 rounded-2xl bg-surface-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                    <i class="fa-solid ${c.icon}"></i>
                </div>
                <span class="text-[9px] font-black uppercase text-gray-300 tracking-widest bg-gray-50 px-2 py-1 rounded-lg">Ma</span>
            </div>
            <div class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">${c.label}</div>
            <div class="text-2xl xl:text-3xl font-black ${c.color} truncate">${c.val}</div>
        </div>
    `).join('');
}

function renderCSSChart() {
    // Random mock data for visual purpose
    const data = Array.from({ length: 15 }, () => Math.floor(Math.random() * 80) + 20);
    return data.map((h, i) => `
        <div class="flex flex-col items-center gap-2 group flex-1 h-full justify-end cursor-pointer">
            <div class="w-full bg-brand-100 rounded-t-lg transition-all duration-300 group-hover:bg-brand-500 relative" style="height: ${h}%">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ${(h * 1000).toLocaleString()} Ft
                </div>
            </div>
            <div class="text-[8px] font-bold text-gray-300 group-hover:text-brand-500">${i + 1}.</div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    switch (status) {
        case 'Új rendelés': return 'bg-yellow-100 text-yellow-600';
        case 'Feldolgozás alatt': return 'bg-blue-100 text-blue-600';
        case 'Kiszállítva': return 'bg-green-100 text-green-600';
        case 'Törölve': return 'bg-red-100 text-red-600';
        default: return 'bg-gray-100 text-gray-500';
    }
}
