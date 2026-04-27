import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ShoppingCart, Star, Gamepad2, Coins, CreditCard, Ticket, LayoutGrid, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { API_URL } from '../config/api';

const ICONS_MAP: Record<string, any> = {
  LayoutGrid, Coins, Gamepad2, CreditCard, Ticket
};

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { addToCart } = useCart();
  const { formatPrice, selectedCurrency } = useCurrency();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (carouselRef.current) {
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setScrollLeftPos(carouselRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX); // 1:1 ratio 
    carouselRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };
  
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [catalogDesc, setCatalogDesc] = useState("Explora nuestra inmensa selección de créditos virtuales, juegos y tarjetas. Selecciona una categoría para empezar.");

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes, setRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/settings`)
        ]);
        setCategories(await catRes.json());
        setProducts(await prodRes.json());
        const settings = await setRes.json();
        setCatalogDesc(settings.catalogDesc);
      } catch (err) {
        console.error("Error cargando catálogo", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = activeCategory === "Todos" 
    ? products 
    : products.filter(p => {
        const categoryObj = categories.find(c => c.id === activeCategory);
        return p.category === activeCategory || (categoryObj && p.category === categoryObj.name);
      });

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-8 relative z-0">
      {/* Background Layer Container - pulls up to cover the Layout pt-24 */}
      <div className="absolute -top-24 inset-x-0 bottom-[-100px] z-0 pointer-events-none overflow-hidden">
        {/* Solid base */}
        <div className="absolute inset-0 bg-[#FAFAFA] dark:bg-gray-950" />
        
        {/* Mesh Gradients */}
        <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/30 dark:bg-indigo-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-gold-400/30 dark:bg-amber-600/20 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" style={{ animation: 'pulse 8s infinite alternate' }} />
        <div className="absolute bottom-[-5%] left-[20%] w-[50%] h-[50%] bg-fuchsia-500/20 dark:bg-fuchsia-700/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => {
            const size = Math.random() * 4 + 2;
            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full bg-gradient-to-tr from-gold-400 to-amber-200 dark:from-gold-500 dark:to-orange-400"
                style={{
                  width: size,
                  height: size,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)'
                }}
                animate={{ 
                  y: [0, -200],
                  x: [0, (Math.random() - 0.5) * 150],
                  opacity: [0, Math.random() * 0.8 + 0.5, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{ 
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-4 h-4" /> Entrega Instantánea
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-none">
              Catálogo <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-400 italic">Premium</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-2xl">
              {catalogDesc}
            </p>
          </motion.div>
        </div>

        {/* Category Carousel Selection */}
        <div className="relative mb-10 sm:mb-16 group/carousel">
          {/* Navigation Arrows for Desktop */}
          <button 
            onClick={scrollLeft}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-xl items-center justify-center text-gray-800 dark:text-gray-200 opacity-0 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-gold-500 hover:text-white dark:hover:bg-gold-500 dark:hover:text-gray-900 transition-all border border-gray-200 dark:border-gray-700"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={scrollRight}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-xl items-center justify-center text-gray-800 dark:text-gray-200 opacity-0 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-gold-500 hover:text-white dark:hover:bg-gold-500 dark:hover:text-gray-900 transition-all border border-gray-200 dark:border-gray-700"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={carouselRef}
            className={`flex overflow-x-auto pb-4 gap-3 sm:gap-5 px-4 -mx-4 sm:px-0 sm:mx-0 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'}`}
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            {categories.map((cat, idx) => {
              const Icon = ICONS_MAP[cat.icon] || LayoutGrid;
              const isActive = activeCategory === cat.id;

              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative overflow-hidden group snap-center flex-shrink-0 w-[85vw] sm:w-[320px] lg:w-[380px] min-h-[160px] sm:min-h-[220px] rounded-3xl border-2 transition-all duration-500 text-left flex flex-col justify-end p-5 sm:p-6 ${
                    isActive ? 'border-gold-500 shadow-2xl shadow-gold-500/30' : 'border-transparent hover:border-white/30 hover:shadow-xl'
                  } ${!isActive && 'opacity-90 hover:opacity-100'}`}
                >
                {/* Background Layer */}
                <div className="absolute inset-0 bg-gray-950 rounded-3xl overflow-hidden pointer-events-none">
                  <img 
                    src={cat.bgImage} 
                    alt={cat.name} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isActive ? 'scale-105 opacity-100' : 'opacity-85 group-hover:scale-110 group-hover:opacity-100'
                    }`} 
                  />
                  {/* Subtle vignette + bottom shadow for text, no multiply masking the top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-950/50 to-transparent" />
                  
                  {isActive && <div className="absolute inset-0 bg-gold-500/20 mix-blend-overlay" />}
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col gap-3">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 ${
                    isActive ? 'bg-gold-500 text-gray-900 border-none scale-105' : 'bg-white/10 border border-white/20 text-white group-hover:bg-white/20 group-hover:scale-110'
                  }`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className={`font-black tracking-tight text-xl sm:text-2xl leading-tight transition-colors drop-shadow-md ${
                      isActive ? 'text-gold-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.5)]' : 'text-white'
                    }`}>
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </motion.button>
            )
          })}
          </div>
        </div>

        {/* Global Toolbar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">
            {categories.find(c => c.id === activeCategory)?.name || activeCategory} <span className="text-gray-400 text-base ml-2">({filteredProducts.length})</span>
          </h2>
        </motion.div>

        {/* Product Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {currentProducts.map((product, index) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                className="relative bg-[#1A1D24] dark:bg-[#1A1D24] rounded-[2rem] p-4 border border-white/5 shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col overflow-hidden"
              >
                {/* Image Container - Square & Dominant */}
                <div className={`relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-blue-500/20 to-indigo-600/30 flex items-center justify-center`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-[85%] h-[85%] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 z-10" 
                  />
                  {/* Subtle Glow behind image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {product.tag && (
                    <div className="absolute top-3 left-3 z-20 bg-blue-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg">
                      {product.tag}
                    </div>
                  )}
                </div>

                {/* Content - Compact & Clean */}
                <div className="flex flex-col flex-grow relative z-10">
                  <h3 className="text-lg font-black text-white mb-1 tracking-tight leading-tight line-clamp-1">{product.name}</h3>
                  <p className="text-[11px] text-gray-400 font-medium line-clamp-2 mb-4 leading-relaxed h-8">
                    {product.description || `Adquiere ${product.name} al mejor precio con entrega inmediata.`}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-white font-black text-base sm:text-lg tracking-tight">
                        {formatPrice(product.price)} <span className="text-[10px] text-gray-500 ml-0.5">{selectedCurrency?.name || 'USD'}</span>
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => addToCart && addToCart({
                        id: String(product.id),
                        name: product.name,
                        price: product.price,
                        category: product.category.toLowerCase(),
                        image: product.image
                      })}
                      className="bg-[#3B82F6] hover:bg-blue-600 text-white text-[11px] font-black uppercase px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center flex-wrap gap-2 mt-12 pb-12"
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll back near top of grid
                }}
                className={`w-10 h-10 rounded-xl font-black text-sm transition-all shadow-sm ${
                  currentPage === i + 1
                    ? 'bg-gold-500 text-gray-900 ring-4 ring-gold-500/30 ring-offset-2 dark:ring-offset-gray-950 scale-110'
                    : 'bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 backdrop-blur-md'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
