import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Instagram, Zap, Search, ChevronDown, DollarSign, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import CartDrawer from './CartDrawer';
import WhatsAppButton from './WhatsAppButton';
import { API_URL } from '../config/api';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { itemCount, setIsCartOpen } = useCart();
  const { currencies, selectedCurrency, setSelectedCurrencyByName } = useCurrency();
  
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [footerDesc, setFooterDesc] = useState("Tu destino premium para recargas y juegos. Diseñado para gamers que exigen lo mejor, más rápido y seguro.");

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.footerDesc) setFooterDesc(data.footerDesc);
      })
      .catch(err => console.error("Error loading footer settings", err));
  }, []);



  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 font-sans text-gray-800 dark:text-gray-200 selection:bg-gold-300 selection:text-gray-900 flex flex-col transition-colors duration-300">
      {/* Background Mesh */}
      <div className="fixed inset-0 bg-light-mesh dark:bg-dark-mesh -z-10 opacity-70 pointer-events-none transition-colors duration-300"></div>
      
      {/* Floating Navbar (Rammat Zone Style - Enhanced) */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 lg:px-8 pt-2 sm:pt-4"
      >
        <div className="max-w-7xl mx-auto bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border border-gold-500/30 shadow-2xl dark:shadow-gold-sm rounded-xl sm:rounded-2xl transition-all duration-300">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20 relative">
              <div className="flex items-center gap-6 sm:gap-10">
                <Link to="/" className="relative flex items-center flex-shrink-0 cursor-pointer group z-50">
                  {/* Logo Flotante (Sobresale de la Navbar) */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 py-4">
                    <img 
                      src="https://i.postimg.cc/Hxj6J9SC/Whats-App-Image-2026-04-20-at-8-31-10-PM-Photoroom.png" 
                      alt="MonedasJuegos Logo" 
                      className="h-24 sm:h-32 w-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-all duration-300"
                    />
                  </div>
                  {/* Espaciador ajustado para acercar el texto */}
                  <div className="w-16 sm:w-20"></div>
                  <span className="font-black text-xl sm:text-2xl tracking-wider text-gray-800 dark:text-white hidden sm:block uppercase">
                    MONEDAS<span className="text-gold-400">JUEGOS</span>
                  </span>
                </Link>
              </div>
          
            <div className="flex items-center ml-auto gap-4 sm:gap-6 lg:gap-8">
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center gap-8 lg:gap-10 mr-4 lg:mr-8">
                <Link 
                  to="/" 
                  className={`text-sm sm:text-base font-black uppercase tracking-wider transition-all ${location.pathname === '/' ? 'text-[#FFEE58] drop-shadow-[0_0_8px_rgba(255,238,88,0.4)]' : 'text-gray-700 dark:text-gray-300 hover:text-gold-500'}`}
                >
                  Inicio
                </Link>
                <Link 
                  to="/catalogo" 
                  className={`text-sm sm:text-base font-black uppercase tracking-wider transition-all ${location.pathname === '/catalogo' ? 'text-[#FFEE58] drop-shadow-[0_0_8px_rgba(255,238,88,0.4)]' : 'text-gray-700 dark:text-gray-300 hover:text-gold-500'}`}
                >
                  Catálogo
                </Link>
                <Link 
                  to="/tienda-diaria" 
                  className={`text-sm sm:text-base font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${location.pathname === '/tienda-diaria' ? 'text-[#FFEE58] drop-shadow-[0_0_8px_rgba(255,238,88,0.4)]' : 'text-gray-700 dark:text-gray-300 hover:text-gold-500'}`}
                >
                  TIENDA FN
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Currency Selector */}
                {currencies.length > 0 && (
                  <div className="relative">
                    <button 
                      onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-gold-500/50 transition-all"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-gold-500 stroke-[3]" />
                      <span className="text-gray-400 font-bold">{selectedCurrency?.name || 'USD'}</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>

                    <AnimatePresence>
                      {isCurrencyOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-12 right-0 w-32 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden py-2 z-50"
                        >
                          {currencies.map(c => (
                            <button 
                              key={c.id} 
                              onClick={() => { setSelectedCurrencyByName(c.name); setIsCurrencyOpen(false); }}
                              className={`w-full text-left px-4 py-2 text-sm font-black tracking-wider transition-all ${
                                selectedCurrency?.name === c.name ? 'bg-gold-50 text-gold-600 dark:bg-gray-800 dark:text-gold-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              {c.name} <span className="text-gray-400 font-bold ml-1 tracking-normal">({c.symbol})</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                
                <a 
                  href="https://www.instagram.com/monedasjuegos/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm rounded-3xl transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gold-gradient text-gray-900 shadow-gold-sm rounded-3xl hover:scale-105 transition-all relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                      {itemCount}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-3xl transition-all"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-gray-950 flex flex-col md:hidden"
          >
            <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
              <span className="font-black text-2xl tracking-wider text-gray-800 dark:text-white uppercase">
                MONEDAS<span className="text-gold-400">JUEGOS</span>
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col p-6 gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-black uppercase tracking-wider p-4 rounded-3xl transition-colors ${location.pathname === '/' ? 'bg-gold-500/10 text-gold-500' : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                Inicio
              </Link>
              <Link to="/catalogo" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-black uppercase tracking-wider p-4 rounded-3xl transition-colors ${location.pathname === '/catalogo' ? 'bg-gold-500/10 text-gold-500' : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                Catálogo
              </Link>
              <Link to="/tienda-diaria" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-black uppercase tracking-wider p-4 rounded-3xl transition-colors flex items-center gap-2 ${location.pathname === '/tienda-diaria' ? 'bg-gold-500/10 text-gold-500' : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                TIENDA FN
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-20 pb-10 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="https://i.postimg.cc/Hxj6J9SC/Whats-App-Image-2026-04-20-at-8-31-10-PM-Photoroom.png" 
                  alt="MonedasJuegos Logo" 
                  className="h-16 w-auto object-contain drop-shadow-lg"
                />
                <span className="font-black text-2xl tracking-wider text-gray-800 dark:text-white uppercase">MONEDAS<span className="text-gold-400">JUEGOS</span></span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg leading-relaxed">
                {footerDesc}
              </p>
            </div>
            <div>
              <h4 className="font-black text-gray-800 dark:text-white mb-6 uppercase tracking-widest text-sm">Navegación</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-wider">
                <li><Link to="/" className="hover:text-gold-500 transition-colors">Inicio</Link></li>
                <li><Link to="/catalogo" className="hover:text-gold-500 transition-colors">Catálogo</Link></li>
                <li><Link to="/tienda-diaria" className="hover:text-gold-500 transition-colors">Tienda FN</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 font-light text-[10px] uppercase tracking-[0.2em]">
              © 2026 monedasjuegos. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/monedasjuegos/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-500 transition-all cursor-pointer shadow-sm"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
