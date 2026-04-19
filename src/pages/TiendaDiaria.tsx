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
  const { formatPrice, selectedCurrency, vbucksRate } = useCurrency();

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

  // Generate unique categories for tabs
  const categories = ['all', ...Array.from(new Set(shopData?.all.map(item => item.rarity))).filter(Boolean)];

  const filteredSections = shopData?.sections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || item.rarity === activeTab;
      return matchesSearch && matchesTab;
    })
  })).filter(section => section.items.length > 0) || [];

  return (
    <div className="min-h-screen pb-24 top-0 selection:bg-gold-500 selection:text-white relative overflow-hidden -mt-24 pt-24">
      {/* Background Ambience - Fortnite Shop Theme */}
      <div className="fixed inset-0 -z-0 pointer-events-none">
        
        {/* The Base Image */}
        <img 
          src="https://i.postimg.cc/MH1FNwmy/1326064.jpg" 
          alt="Tienda Fortnite Background"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Global Darkener to ensure text doesn't get lost (dark layer for both modes) */}
        <div className="absolute inset-0 bg-gray-900/40 dark:bg-gray-950/60" />
        
        {/* Gradient Fade-Out at the bottom so cards look natural */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAFAFA]/70 to-[#FAFAFA] dark:via-gray-950/80 dark:to-gray-950" />
      </div>

      {/* Put a generic relative container to hold children correctly above the absolutely positioned z-0 background */}
      <div className="relative z-10">

      {/* Header */}
      <div className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <motion.div {...fadeUp(0)} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-gold-100 dark:bg-gold-500/20 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
              </span>
              Actualización en vivo
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-4">
              Tienda <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-400">Diaria</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              Consigue los últimos skins, pases y cosméticos de Fortnite, sincronizados en tiempo real.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="flex items-center gap-4 bg-white dark:bg-gray-900/80 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm w-full md:w-auto backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Rotación en</p>
                <p className="text-lg font-black text-gray-900 dark:text-white">24 Horas</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Toolbar */}
        <motion.div {...fadeUp(0.2)} className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white/70 dark:bg-gray-900/50 p-2 sm:p-3 rounded-2xl sm:rounded-full border border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-xl sticky top-24 z-30">
          {/* Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar w-full lg:w-auto gap-2 p-1">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeTab === cat 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar outfit, pico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800/80 border-none rounded-full py-3 pl-12 pr-4 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-gold-500 outline-none transition-all"
            />
          </div>
        </motion.div>
      </div>

      {/* Grouped Grid UI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="popLayout">
          {filteredSections.length === 0 ? (
            <motion.div {...fadeUp(0)} className="text-center py-20 bg-white/50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
              <p className="text-xl font-bold text-gray-400">No hay cosméticos que coincidan con tu búsqueda.</p>
            </motion.div>
          ) : (
            filteredSections.map((section, sIdx) => (
              <motion.div key={section.name} {...fadeUp(0.1)} className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">
                    {section.name}
                  </h2>
                  <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                  {section.items.map((item, i) => (
                      <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: (i % 5) * 0.05 }}
                        className="group relative bg-white dark:bg-gray-800/80 rounded-2xl sm:rounded-[2rem] p-2 sm:p-3 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 flex flex-col"
                      >
                        <div className="relative aspect-square sm:aspect-[4/5] rounded-xl sm:rounded-3xl overflow-hidden mb-2 sm:mb-4 bg-gradient-to-t from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
                          {/* Radial Glow based on Rarity */}
                          <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${
                            item.rarity === 'Legendario' ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 to-transparent' :
                            item.rarity === 'Épico' ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500 to-transparent' :
                            item.rarity === 'Raro' ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent' :
                            item.rarity === 'Poco común' ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500 to-transparent' :
                            item.rarity.includes('Serie') ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500 to-transparent' :
                            'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-500 to-transparent'
                          }`} />

                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 z-10 relative drop-shadow-xl sm:drop-shadow-2xl p-2 sm:p-4"
                          />
                          
                          {/* Top Tag */}
                          <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex justify-between items-start z-20">
                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-900/40 backdrop-blur-md rounded-full text-[8px] sm:text-[10px] font-black text-white uppercase tracking-wider border border-white/10 shadow-sm truncate max-w-full">
                              {item.type}
                            </span>
                          </div>

                          {/* Price Tag Centered */}
                          <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-20 flex flex-col md:flex-row items-center justify-center gap-1">
                            <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-900/90 backdrop-blur-md rounded-full border border-gray-700/50 shadow-xl group-hover:bg-gold-500 transition-colors duration-300">
                              <img src="https://i.postimg.cc/QMpKFnSj/v-bucks-Photoroom.png" alt="VBucks" className="w-3 h-3 sm:w-4 sm:h-4 object-contain drop-shadow" />
                              <span className="text-white group-hover:text-gray-900 font-black text-[10px] sm:text-sm leading-none">{item.price}</span>
                            </div>
                            <div className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-green-500/90 backdrop-blur-md rounded-full border border-green-400/50 shadow-xl">
                              <span className="text-white font-black text-[10px] sm:text-sm leading-none">{selectedCurrency?.symbol || '$'} {formatPrice((parseFloat(String(item.price).replace(/,/g, '')) / 100) * vbucksRate)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="px-1 sm:px-2 pb-1 sm:pb-2 text-center flex-grow flex flex-col justify-end">
                          <h3 className="font-black text-gray-900 dark:text-white text-xs sm:text-lg truncate mb-0.5 sm:mb-1" title={item.name}>{item.name}</h3>
                          <p className="text-[9px] sm:text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-2 sm:mb-3 truncate">{item.rarity}</p>
                          
                          <button 
                            onClick={() => addToCart && addToCart({
                              id: item.id,
                              name: item.name,
                              price: (parseFloat(String(item.price).replace(/,/g, '')) / 100) * vbucksRate,
                              category: 'fortnite',
                              image: item.image
                            })}
                            className="w-full mt-auto flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-xs sm:text-sm hover:bg-gold-500 hover:text-gray-900 hover:shadow-lg hover:shadow-gold-500/20 hover:scale-[1.02] active:scale-95 transition-all outline-none border border-transparent dark:border-gray-800"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Añadir</span><span className="sm:hidden">Comprar</span>
                          </button>
                        </div>
                      </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      </div>
      
    </div>
  );
}
