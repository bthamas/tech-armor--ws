export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10 mt-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center text-white text-sm shadow-lg">
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <span className="font-extrabold text-xl tracking-tighter text-gray-900">TechArmor</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Prémium minőségű védelem a legújabb készülékek számára. Stílus és biztonság kompromisszumok nélkül.
                        </p>
                        <div className="flex gap-4">
                            {['facebook', 'instagram', 'twitter', 'tiktok'].map(s => (
                                <a key={s} href="#" className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all">
                                    <i className={`fa-brands fa-${s}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Vásárlás</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-brand-500 transition-colors">Kezdőlap</a></li>
                            <li><a href="#" className="hover:text-brand-500 transition-colors">Összes termék</a></li>
                            <li><a href="#" className="hover:text-brand-500 transition-colors">Akciók</a></li>
                            <li><a href="#" className="hover:text-brand-500 transition-colors">Újdonságok</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Segítség</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-brand-500 transition-colors">Rendelés követés</a></li>
                            <li><a href="#" className="hover:text-brand-500 transition-colors">Szállítás & Fizetés</a></li>
                            <li><a href="#" className="hover:text-brand-500 transition-colors">Visszaküldés</a></li>
                            <li><a href="#" className="hover:text-brand-500 transition-colors">Kapcsolat</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Hírlevél</h4>
                        <p className="text-gray-500 text-sm mb-4">Iratkozz fel a legújabb akciókért!</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="E-mail cím" className="bg-surface-50 border-none rounded-xl px-4 py-3 text-sm flex-grow focus:ring-2 focus:ring-brand-500/20" />
                            <button className="bg-brand-900 text-white rounded-xl w-12 flex items-center justify-center hover:bg-brand-700 transition-all"><i className="fa-solid fa-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 text-xs font-medium">© 2024 TechArmor. Minden jog fenntartva.</p>
                    <div className="flex gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
                        <i className="fa-brands fa-cc-visa text-2xl"></i>
                        <i className="fa-brands fa-cc-mastercard text-2xl"></i>
                        <i className="fa-brands fa-cc-apple-pay text-2xl"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
}
