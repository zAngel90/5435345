import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';

import { API_URL } from '../config/api';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDrawer({ isOpen, onClose }: AuthDrawerProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Auth state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/user/login' : '/user/register';
      const body = mode === 'login' ? { email, password } : { name, email, password };
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error');
      }

      // Guardar token y user en localStorage
      localStorage.setItem('monedas_user_token', data.token);
      localStorage.setItem('monedas_user', JSON.stringify(data.user));
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Opcional: Recargar o emitir evento
        window.dispatchEvent(new Event('auth_changed'));
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[80]"
          />

          {/* Drawer Sheet */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed bottom-0 left-0 right-0 mx-auto z-[90] w-full max-w-[360px] bg-white dark:bg-gray-950 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-x border-gray-100 dark:border-gray-800 flex flex-col"
          >
            {/* Grab Handle */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 bg-gray-200 dark:bg-gray-800 rounded-full" />
            </div>

            <div className="px-6 pb-6 pt-2 relative">
              <button 
                onClick={onClose}
                className="absolute top-0 right-4 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-5 text-center">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
              </div>

              {success ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mb-4 text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">¡Éxito!</h3>
                  <p className="text-gray-500 font-medium">Has ingresado correctamente.</p>
                </div>
              ) : (
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                  
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold p-3 rounded-lg text-center">
                      {error}
                    </div>
                  )}
                
                <AnimatePresence mode="popLayout">
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all font-medium"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all font-medium"
                    />
                  </div>
                  {mode === 'login' && (
                    <div className="flex justify-end mt-1.5">
                      <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-gold-500 transition-colors">¿Olvidaste tu contraseña?</a>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 bg-gold-gradient text-gray-900 font-black tracking-widest uppercase text-[11px] rounded-xl py-2.5 shadow-gold-sm hover:shadow-gold hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : (mode === 'login' ? 'Ingresar' : 'Registrar')}
                </button>
              </form>
              )}

              {/* Botón Alternar */}
              <div className="text-center mt-5">
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-[11px] font-bold text-gray-500 hover:text-gold-500 transition-colors uppercase tracking-wider"
                >
                  {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
