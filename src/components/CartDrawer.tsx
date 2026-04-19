import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, total } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    let text = "Hola, me gustaría comprar los siguientes productos:%0A%0A";
    items.forEach(item => {
      text += `- ${item.quantity}x ${item.name} ($${item.price})%0A`;
    });
    text += `%0ATotal: $${total.toFixed(2)}`;
    
    window.open(`https://wa.me/5491130990707?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-gray-900 shadow-2xl z-[70] flex flex-col border-l border-gray-100 dark:border-gray-800"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-gold-500" />
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Tu Carrito</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="font-medium">Tu carrito está vacío</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">{item.name}</h3>
                        <p className="text-gold-600 font-black">${item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-white dark:bg-gray-700 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-gray-900 dark:text-white w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Total</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Comprar por WhatsApp
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
