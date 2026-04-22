import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, Clock, Search, Filter, ShoppingCart } from 'lucide-react';
import { getFortniteShop, FortniteShopSections, FortniteItem } from '../lib/fortniteApi';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

export default function TiendaDiaria() {
  const [shopData, setShopData] = useState<FortniteShopSections | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const { addToCart } = useCart();
  const { formatPrice, selectedCurrency, calculateVBucksPrice } = useCurrency();

  const scrollToSection = (id: string) => {
    const sanitizedId = id.replace(/\s+/g, '-').toLowerCase();
    const element = document.getElementById(sanitizedId);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const data = await getFortniteShop();
        setShopData(data);
      } catch (error) {
        console.error("Error al cargar la tienda", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-gold-500 animate-spin" />
          <div className="absolute inset-0 bg-gold-500 blur-xl opacity-30 rounded-full animate-pulse" />
        </div>
        <p className="text-gray-900 dark:text-white font-black tracking-widest uppercase text-xl animate-pulse">
          Sincronizando Tienda...
        </p>
      </div>
    );
  }

  const getRarityStyles = (rarity: string) => {
    const r = rarity.toLowerCase();
    if (r.includes('legendario')) return 'bg-gradient-to-br from-amber-400 to-orange-600 border-orange-400/30';
    if (r.includes('épico')) return 'bg-gradient-to-br from-purple-500 to-fuchsia-800 border-purple-400/30';
    if (r.includes('raro')) return 'bg-gradient-to-br from-blue-400 to-indigo-700 border-blue-300/30';
    if (r.includes('poco común') || r.includes('uncommon')) return 'bg-gradient-to-br from-green-400 to-emerald-700 border-green-300/30';
    if (r.includes('marvel')) return 'bg-gradient-to-br from-red-500 to-red-800 border-red-400/30';
    if (r.includes('dc')) return 'bg-gradient-to-br from-blue-700 to-blue-900 border-blue-500/30';
    if (r.includes('ídolos') || r.includes('icon')) return 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-300/30';
    if (r.includes('lava')) return 'bg-gradient-to-br from-orange-600 to-red-900 border-orange-500/30';
    if (r.includes('congelada') || r.includes('frozen')) return 'bg-gradient-to-br from-blue-200 to-cyan-500 border-blue-100/30';
    if (r.includes('sombra') || r.includes('shadow')) return 'bg-gradient-to-br from-gray-700 to-black border-gray-600/30';
    if (r.includes('star wars')) return 'bg-gradient-to-br from-indigo-900 to-black border-indigo-700/30';
    return 'bg-gradient-to-br from-gray-400 to-gray-600 border-gray-300/30';
  };

  const filteredSections = shopData?.sections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || item.rarity === activeTab;
      return matchesSearch && matchesTab;
    })
  })).filter(section => section.items.length > 0) || [];

  return (
    <div className="min-h-screen pb-24 top-0 selection:bg-gold-500 selection:text-white relative -mt-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-0 pointer-events-none">
        <img 
          src="https://i.postimg.cc/MH1FNwmy/1326064.jpg" 
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-40 dark:opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/95 to-gray-50 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-950" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32">
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-2">Categorías</h3>
                <nav className="space-y-2 max-h-[70vh] overflow-y-auto pr-2 hide-scrollbar">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all hover:bg-gold-500 hover:text-gray-900 text-gray-600 dark:text-gray-400"
                  >
                    Inicio
                  </button>
                  {shopData?.sections.map((section) => (
                    <button
                      key={section.name}
                      onClick={() => scrollToSection(section.name)}
                      className="w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white truncate"
                    >
                      {section.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <header className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none italic uppercase">
                  Tienda <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-400">FN</span>
                </h1>
                
                <div className="hidden sm:flex items-center gap-3 bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-500/20">
                  <Zap className="w-5 h-5 text-indigo-500" />
                  <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">En vivo</span>
                </div>
              </div>
              
              <div className="relative max-w-xl mb-8">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="BUSCAR SKIN, PICO O GESTO..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl py-5 pl-14 pr-6 text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white placeholder-gray-400 shadow-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                />
              </div>

              {/* Mobile Sidebar (Horizontal) - Now inside header for better flow */}
              <div className="lg:hidden sticky top-24 z-40 -mx-4 px-4 py-2 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 overflow-x-auto hide-scrollbar flex gap-2">
                {shopData?.sections.map((section) => (
                  <button
                    key={section.name}
                    onClick={() => scrollToSection(section.name)}
                    className="whitespace-nowrap px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gold-500 transition-all shadow-sm"
                  >
                    {section.name}
                  </button>
                ))}
              </div>
            </header>

            <AnimatePresence mode="popLayout">
              {filteredSections.map((section) => (
                <section key={section.name} id={section.name.replace(/\s+/g, '-').toLowerCase()} className="mb-16 sm:mb-20 scroll-mt-40 sm:scroll-mt-32">
                  <div className="flex items-center gap-4 sm:gap-6 mb-8">
                    <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic shrink-0">
                      {section.name}
                    </h2>
                    <div className="h-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800 flex-1 rounded-full" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {section.items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (i % 4) * 0.05 }}
                        className={`group relative flex flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-[3px] shadow-xl sm:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${getRarityStyles(item.rarity)}`}
                      >
                        <div className="relative aspect-[4/5] p-2 sm:p-4 flex items-center justify-center overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)] sm:drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-500 z-10"
                          />
                          
                          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-black/30 backdrop-blur-md rounded-lg text-[7px] sm:text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                              {item.type}
                            </span>
                          </div>

                          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-20">
                            <div className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl">
                              <img src="https://i.postimg.cc/QMpKFnSj/v-bucks-Photoroom.png" alt="VBucks" className="w-3 h-3 sm:w-5 sm:h-5 object-contain" />
                              <span className="text-white font-black text-xs sm:text-lg italic">{item.price}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 sm:p-5 bg-black/20 backdrop-blur-md border-t border-white/10 flex flex-col gap-3 sm:gap-4 mt-auto">
                          <div className="text-left">
                            <h3 className="text-white font-black text-sm sm:text-xl leading-tight uppercase tracking-tighter truncate" title={item.name}>
                              {item.name}
                            </h3>
                            <p className="text-white/60 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                              {item.rarity}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2 sm:gap-3">
                             <div className="text-white font-black text-xs sm:text-base italic">
                               {selectedCurrency?.symbol || '$'} {formatOnly(calculateVBucksPrice(parseFloat(String(item.price).replace(/,/g, ''))))}
                             </div>
                             <button 
                               onClick={() => addToCart && addToCart({
                                 id: item.id,
                                 name: item.name,
                                 price: (parseFloat(String(item.price).replace(/,/g, '')) / 100) * 0.25,
                                 vbucks: parseFloat(String(item.price).replace(/,/g, '')),
                                 category: 'fortnite',
                                 image: item.image
                              })}
                              className="bg-white text-black hover:bg-gold-500 transition-colors rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-[9px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1 sm:gap-2"
                            >
                              <ShoppingCart className="w-3 h-3 sm:w-4 h-4" />
                              <span className="hidden xs:inline">Comprar</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
