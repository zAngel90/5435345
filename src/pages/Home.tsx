import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationFrame, useMotionValue } from 'framer-motion';
import { ChevronRight, ChevronDown, ShieldCheck, Zap, Star, Gamepad2, Gift, Trophy, Unlock, Users, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import fondoHero from '../fondo.jpg';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
});

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  
  const x = useMotionValue(0);
  const direction = useRef(-1); // -1 moves left, 1 moves right
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useAnimationFrame((t, delta) => {
    if (carouselWidth === 0 || isDragging || isHovered) return;

    let moveBy = direction.current * (45 * (delta / 1000)); // 45px per second
    let nextX = x.get() + moveBy;

    if (nextX <= -carouselWidth) {
      direction.current = 1;
      nextX = -carouselWidth;
    } else if (nextX >= 0) {
      direction.current = -1;
      nextX = 0;
    }

    x.set(nextX);
  });

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    
    // Slight delay to ensure fonts/layout are rendered before calculating width
    const timeout = setTimeout(updateWidth, 150);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden -mt-24">

      {/* ── 1. PREMIUM HERO SECTION (SPLIT LAYOUT) ───────────────────────────── */}
      <section className="relative z-0 min-h-[70vh] sm:min-h-[100vh] flex items-center justify-center px-4 pt-32 sm:pt-44 pb-12 sm:pb-20 overflow-hidden">
        
        {/* Specific Background Image for Hero only */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <img 
            src={fondoHero} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-80 sm:opacity-100 dark:opacity-90 object-[center_top]" 
          />
          {/* Diagonal fading from left to ensure text is 100% readable while the image shows clearly on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/80 to-[#FAFAFA]/10 dark:from-gray-950 dark:via-gray-950/80 dark:to-gray-950/10"></div>
          {/* Bottom fade into the stat banner */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAFAFA] to-transparent dark:from-gray-950 dark:to-transparent"></div>
        </div>

        {/* Background glow */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
           <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/10 dark:bg-gold-500/10 blur-[150px] rounded-full" />
           <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/10 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-16 lg:gap-8 items-center relative z-10 px-4 sm:px-6">
          
          {/* Left: Text & CTA */}
          <div className="flex flex-col items-start text-left max-w-2xl w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-800 dark:text-gold-400 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
              </span>
              Plataforma Global de Gaming
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight text-gray-900 dark:text-white leading-[1.1] sm:leading-[1.05] mb-4 sm:mb-6"
            >
              TU ARSENAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-400 dark:from-gold-400 dark:to-gold-200 mt-1 sm:mt-2 block">
                LLEVADO AL LÍMITE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium mb-8 sm:mb-10 max-w-lg leading-relaxed"
            >
              Recargas instantáneas, llaves globales y pases premium. Potencia tu experiencia de juego sin interrupciones.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <Link to="/catalogo" className="w-full sm:w-auto group flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gold-500 text-white dark:text-gray-900 rounded-full font-bold text-base hover:scale-105 transition-all shadow-md">
                Ver Catálogo <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => document.getElementById('bento-features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-base text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Saber más
              </button>
            </motion.div>
          </div>

          {/* Right side left intentionally blank per user request */}
          <div className="w-full lg:h-[600px] flex items-center justify-center hidden lg:flex">
             {/* Tu espacio en blanco para que decidas qué colocar después */}
          </div>
        </div>
      </section>

      {/* ── 2. STATS BANNER ───────────────────────────────────── */}
      <section className="w-full bg-white dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800 py-8 sm:py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-transparent md:divide-gray-200 md:dark:divide-gray-800 text-center">
            {[
              { label: "Usuarios Activos", value: "50K+" },
              { label: "Transacciones Seguras", value: "99.9%" },
              { label: "Tiempo de Entrega", value: "< 1 min" },
              { label: "Juegos Disponibles", value: "2,500+" }
            ].map((stat, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</span>
                <span className="text-sm sm:text-base font-bold text-gray-500 dark:text-gold-500 uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOWER SECTIONS WRAPPER ───────────────────────────────────── */}
      <div className="relative w-full overflow-hidden">
        {/* SVG Doodle Pattern Background (WhatsApp Style) */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none bg-gray-900 dark:bg-white opacity-[0.02] dark:opacity-[0.03] blur-[1.5px]"
          style={{ 
            maskImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23000' fill='none' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M30,50 h40 c5,0 10,5 10,15 v10 c0,10 -5,15 -10,15 h-40 c-5,0 -10,-5 -10,-15 v-10 c0,-10 5,-15 10,-15 z'/%3E%3Ccircle cx='60' cy='70' r='3'/%3E%3Ccircle cx='70' cy='60' r='3'/%3E%3Cpath d='M35,65 h10 M40,60 v10'/%3E%3Cpolygon points='120,40 110,60 120,60 115,80 135,55 125,55 130,40'/%3E%3Cpolygon points='200,45 205,55 215,60 205,65 200,75 195,65 185,60 195,55'/%3E%3Ccircle cx='50' cy='150' r='15'/%3E%3Ccircle cx='50' cy='150' r='10'/%3E%3Cpath d='M50,140 v20'/%3E%3Cpath d='M120,120 v10 c0,15 10,20 15,25 c5,-5 15,-10 15,-25 v-10 z'/%3E%3Cpath d='M125,135 l5,5 l15,-15'/%3E%3Cpath d='M200,160 c-10,0 -15,5 -15,10 c0,5 5,10 15,10 h20 c5,0 10,-5 10,-10 c0,-5 -5,-10 -10,-10'/%3E%3Ccircle cx='210' cy='155' r='8'/%3E%3Cpolygon points='160,100 170,110 150,110'/%3E%3Ccircle cx='80' cy='200' r='2'/%3E%3Ccircle cx='160' cy='220' r='2'/%3E%3Ccircle cx='20' cy='100' r='2'/%3E%3Ccircle cx='260' cy='200' r='2'/%3E%3Ccircle cx='100' cy='20' r='2'/%3E%3Cpolygon points='90,170 105,160 120,170 105,190'/%3E%3Cpath d='M180,210 h20 M190,200 v20'/%3E%3Cpath d='M250,90 l10,-10 l10,10 M260,80 v20'/%3E%3C/g%3E%3C/svg%3E")`,
            maskSize: '300px 300px',
            maskRepeat: 'repeat',
            WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23000' fill='none' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M30,50 h40 c5,0 10,5 10,15 v10 c0,10 -5,15 -10,15 h-40 c-5,0 -10,-5 -10,-15 v-10 c0,-10 5,-15 10,-15 z'/%3E%3Ccircle cx='60' cy='70' r='3'/%3E%3Ccircle cx='70' cy='60' r='3'/%3E%3Cpath d='M35,65 h10 M40,60 v10'/%3E%3Cpolygon points='120,40 110,60 120,60 115,80 135,55 125,55 130,40'/%3E%3Cpolygon points='200,45 205,55 215,60 205,65 200,75 195,65 185,60 195,55'/%3E%3Ccircle cx='50' cy='150' r='15'/%3E%3Ccircle cx='50' cy='150' r='10'/%3E%3Cpath d='M50,140 v20'/%3E%3Cpath d='M120,120 v10 c0,15 10,20 15,25 c5,-5 15,-10 15,-25 v-10 z'/%3E%3Cpath d='M125,135 l5,5 l15,-15'/%3E%3Cpath d='M200,160 c-10,0 -15,5 -15,10 c0,5 5,10 15,10 h20 c5,0 10,-5 10,-10 c0,-5 -5,-10 -10,-10'/%3E%3Ccircle cx='210' cy='155' r='8'/%3E%3Cpolygon points='160,100 170,110 150,110'/%3E%3Ccircle cx='80' cy='200' r='2'/%3E%3Ccircle cx='160' cy='220' r='2'/%3E%3Ccircle cx='20' cy='100' r='2'/%3E%3Ccircle cx='260' cy='200' r='2'/%3E%3Ccircle cx='100' cy='20' r='2'/%3E%3Cpolygon points='90,170 105,160 120,170 105,190'/%3E%3Cpath d='M180,210 h20 M190,200 v20'/%3E%3Cpath d='M250,90 l10,-10 l10,10 M260,80 v20'/%3E%3C/g%3E%3C/svg%3E")`,
            WebkitMaskSize: '300px 300px',
            WebkitMaskRepeat: 'repeat'
          }}
        />

      {/* ── 3. FEATURES (CLEAN GRID) ──────────────────────────────── */}
      <section id="bento-features" className="py-8 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-gray-100/50 dark:border-gray-800/50 relative z-10">
        <motion.div {...fadeUp(0)} className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div>
            <h2 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-1 sm:mb-2">Por qué elegirnos</h2>
            <h3 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Diseñado para el <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-500">rendimiento</span>
            </h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 md:max-w-sm text-xs sm:text-sm font-medium">
            Beneficios diseñados a medida para garantizar que tu única preocupación sea jugar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <motion.div {...fadeUp(0.1)} className="bg-white dark:bg-gray-900/50 rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-gray-800 hover:border-gold-500/30 transition-colors shadow-sm hover:shadow-md group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-gold-500" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Velocidad Relámpago</h4>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">Nuestro sistema automatizado entrega códigos en milisegundos tras tu pago.</p>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="bg-white dark:bg-gray-900/50 rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-gray-800 hover:border-indigo-500/30 transition-colors shadow-sm hover:shadow-md group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Pago Seguro</h4>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">Cifrado de grado militar para proteger tus transacciones al 100%.</p>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="bg-white dark:bg-gray-900/50 rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-gray-800 hover:border-purple-500/30 transition-colors shadow-sm hover:shadow-md lg:col-span-2 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <Trophy className="w-32 h-32 sm:w-48 sm:h-48 text-purple-500" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
               <div className="flex-1">
                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm mb-4 sm:mb-6 group-hover:scale-110 transition-transform bg-purple-50 dark:bg-purple-900/20">
                   <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                 </div>
                 <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Ofertas Imbatibles</h4>
                 <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-sm leading-relaxed">Conectamos directo con distribuidores oficiales para ahorrarte en promedio un 35% en tus juegos.</p>
               </div>
               <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-inner border border-gray-100 dark:border-gray-700 flex items-center gap-3 sm:gap-4 shrink-0 shadow-purple-500/5 dark:shadow-purple-500/10">
                 <div className="bg-white dark:bg-gray-900 rounded-full p-1.5 sm:p-2 shadow-sm"><TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" /></div>
                 <div><p className="text-[10px] sm:text-xs font-bold text-gray-500">Ahorro Medio</p><p className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">-35% DESC</p></div>
               </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 4. PREGUNTAS FRECUENTES ────────────────────────── */}
      <section className="py-10 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-16">
          <motion.div {...fadeUp(0)}>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 sm:mb-4">Preguntas Frecuentes</h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium">Resolvemos tus dudas al instante.</p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "¿Cuánto tarda en llegar mi recarga o juego?",
              a: "Nuestra entrega es automatizada. En cuanto tu pago sea aprobado, recibirás tu código o confirmación de recarga de forma instantánea tanto en la plataforma como por correo electrónico."
            },
            {
              q: "¿Qué métodos de pago puedo utilizar?",
              a: "Aceptamos una amplia variedad de métodos seguros incluyendo tarjetas de crédito, débito, billeteras digitales y otros métodos de pago locales dependiendo de tu región."
            },
            {
              q: "¿Los códigos que venden son globales?",
              a: "Depende de cada artículo. En la descripción técnica de cada producto especificamos sin falta si se trata de un código Global o si está bloqueado a una región específica."
            },
            {
              q: "¿Qué sucede si tengo un problema con mi compra?",
              a: "¡No te preocupes! Tenemos un equipo de atención al cliente disponible 24/7 a través de WhatsApp. Envíanos tu número de orden y te solucionaremos cualquier inconveniente rápidamente."
            }
          ].map((faq, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} className={`bg-white dark:bg-gray-800/50 rounded-2xl border ${openFaqIndex === i ? 'border-gold-500/50 shadow-md' : 'border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md'} transition-all overflow-hidden`}>
              <button 
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                className="w-full text-left p-5 sm:p-8 flex items-center justify-between gap-4 outline-none"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className={`shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-black transition-colors ${openFaqIndex === i ? 'bg-gold-500 text-gray-900' : 'bg-gold-100 dark:bg-gold-500/20 text-gold-600 dark:text-gold-400'}`}>Q.</span> 
                  <h4 className={`text-base sm:text-xl font-black transition-colors ${openFaqIndex === i ? 'text-gold-600 dark:text-gold-400' : 'text-gray-900 dark:text-white'}`}>
                    {faq.q}
                  </h4>
                </div>
                <ChevronDown className={`shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180 text-gold-500' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaqIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-0">
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base leading-relaxed pl-10 sm:pl-12">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. TESTIMONIALS (CAROUSEL) ──────────────────────────────────── */}
      <section className="py-10 sm:py-24 bg-gray-50/50 dark:bg-gray-900/30 backdrop-blur-sm border-y border-gray-100/50 dark:border-gray-800/50 flex flex-col items-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8 sm:mb-16">
          <motion.div {...fadeUp(0)} className="text-center">
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 sm:mb-4">Lo que dice nuestra comunidad</h2>
            <div className="flex justify-center items-center gap-0.5 text-gold-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />)}
            </div>
          </motion.div>
        </div>

        {/* Draggable Row */}
        <div ref={carouselRef} className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.div 
            drag="x" 
            dragConstraints={{ right: 0, left: -carouselWidth }} 
            className="flex gap-6 px-4 sm:px-16 py-8 min-w-max"
            style={{ x }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
               // Resume auto-scroll after inertia delay
               setTimeout(() => setIsDragging(false), 2000); 
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {[
              { name: "Carlos M.", role: "Pro Player", text: "Mejoraron la velocidad de entrega de forma increíble. Compré mis V-Bucks y en 10 segundos ya los tenía en mi cuenta." },
              { name: "Laura G.", role: "Streamer", text: "Siempre uso MonedasJuegos para comprar tarjetas de PlayStation y sortearlas. Es la plataforma más confiable del mercado actual." },
              { name: "Andrés F.", role: "Casual Gamer", text: "La interfaz es hermosa y el soporte en WhatsApp me ayudó al instante cuando tuve una duda con mi primera compra. 10/10." },
              { name: "Miguel T.", role: "Esports Coach", text: "Compramos keys para todo el equipo acá. Nunca tuvimos un solo problema. La pasarela de pagos es un absoluto éxito." },
              { name: "Sofía R.", role: "Creadora de Contenido", text: "Poder conseguir Roblox Gift Cards sin tanto rollo es genial. Mis seguidores también compran directo aquí con total confianza." },
            ].map((review, i) => (
              <motion.div 
                key={i} 
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-glass dark:shadow-glass-dark border border-gray-100 dark:border-gray-700 w-[280px] sm:w-[400px] shrink-0 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl select-none"
              >
                <div className="flex gap-0.5 text-gold-500 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current pointer-events-none" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 italic text-xs sm:text-base leading-relaxed line-clamp-3 pointer-events-none">"{review.text}"</p>
                <div className="flex items-center gap-3 sm:gap-4 pointer-events-none">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-inner">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{review.name}</h4>
                    <p className="text-[10px] sm:text-sm text-gray-500 font-medium">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Gradient Fades for the edges to blend into background */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-24 bg-gradient-to-r from-gray-50 dark:from-gray-900/30 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-24 bg-gradient-to-l from-gray-50 dark:from-gray-900/30 to-transparent"></div>
        </div>
      </section>

      {/* ── 6. BOTTOM CTA ────────────────────────────────────── */}
      <section className="py-12 sm:py-32 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden relative shadow-2xl"
        >
          {/* CTA Background */}
          <div className="absolute inset-0 bg-gray-900 dark:bg-gold-500 z-0">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] opacity-20 dark:opacity-10 mix-blend-overlay bg-cover bg-center"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent dark:from-gold-600 dark:via-gold-500/90 dark:to-gold-400"></div>
          </div>

          <div className="relative z-10 p-8 sm:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-4xl sm:text-5xl font-black text-white dark:text-gray-900 mb-4 leading-tight">¿Listo para subir de nivel?</h2>
              <p className="text-xl text-gray-300 dark:text-gray-800/80 mb-8 font-medium">Únete a miles de jugadores que ya confían en nosotros para sus recargas.</p>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 dark:bg-gray-900 text-gray-900 dark:text-white rounded-full font-black text-lg shadow-lg hover:scale-105 transition-transform duration-300"
              >
                Comienza Ahora <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="hidden md:flex relative">
               <div className="absolute inset-0 bg-gold-400/30 dark:bg-white/30 blur-2xl rounded-full"></div>
               <Gamepad2 className="w-32 h-32 text-gold-500 dark:text-white relative z-10 transform rotate-12 drop-shadow-2xl" />
            </div>
          </div>
        </motion.div>
      </section>

      </div> {/* END LOWER SECTIONS WRAPPER */}

    </div>
  );
}
