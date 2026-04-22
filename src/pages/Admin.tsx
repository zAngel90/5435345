import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Plus, Trash2, Edit, Save, X, LogOut, Settings, DollarSign, Package, LayoutGrid, HelpCircle, MessageSquare } from 'lucide-react';
import { API_URL } from '../config/api';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('products');
  const [data, setData] = useState<any>({ categories: [], products: [], currencies: [], faqs: [], testimonials: [], settings: { vbucksRateInUsd: 0.25 } });
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Modales
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const [catRes, prodRes, curRes, setRes, faqRes, testRes] = await Promise.all([
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/currencies`),
        fetch(`${API_URL}/settings`),
        fetch(`${API_URL}/faqs`),
        fetch(`${API_URL}/testimonials`)
      ]);
      setData({
        categories: await catRes.json(),
        products: await prodRes.json(),
        currencies: await curRes.json(),
        settings: await setRes.json(),
        faqs: await faqRes.json(),
        testimonials: await testRes.json()
      });
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const resData = await res.json();
      if (res.ok) {
        setToken(resData.token);
        localStorage.setItem('adminToken', resData.token);
        setError('');
      } else {
        setError(resData.error);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
  };

  const APIRequest = async (endpoint: string, method: string, body?: any) => {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      ...body && { body: JSON.stringify(body) }
    });
    if (res.status === 401 || res.status === 403) {
      handleLogout();
    }
    return res;
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('¿Estás seguro de eliminar este ítem?')) return;
    await APIRequest(`${type}/${id}`, 'DELETE');
    fetchData();
  };

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalItem = { ...currentItem };

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
           if (activeTab === 'categories') finalItem.bgImage = uploadData.url;
           else if (activeTab === 'products') finalItem.image = uploadData.url;
        }
      } catch (err) {
        console.error("Error al subir archivo", err);
      }
    }

    const isNew = !finalItem.id;
    const method = isNew ? 'POST' : 'PUT';
    const endpoint = `${activeTab}${!isNew ? `/${finalItem.id}` : ''}`;
    
    await APIRequest(endpoint, method, finalItem);
    setIsEditing(false);
    setCurrentItem(null);
    setImageFile(null);
    fetchData();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await APIRequest('settings', 'PUT', data.settings);
    alert('Configuración guardada exitosamente');
  };

  // ------------------------------------
  // LOGIN VIEW
  // ------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-2">Panel de Control</h1>
          <p className="text-gray-500 text-center mb-8 font-medium">Ingresa tus credenciales de administrador</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all font-medium" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all font-medium" required />
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button type="submit" className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-4 rounded-xl hover:bg-gold-500 hover:text-gray-900 transition-colors shadow-lg mt-4">
              Ingresar al Sistema
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ------------------------------------
  // ADMIN DASHBOARD VIEW
  // ------------------------------------
  const renderTable = () => {
    switch(activeTab) {
      case 'categories': return (
        <table className="w-full text-left">
          <thead><tr className="border-b dark:border-gray-800 text-gray-500 text-sm uppercase"><th className="pb-3">Nombre</th><th className="pb-3 text-right">Acciones</th></tr></thead>
          <tbody>
            {data.categories.map((c: any) => (
              <tr key={c.id} className="border-b dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="py-4 font-bold dark:text-white">{c.name}</td>
                <td className="py-4 text-right">
                  <button onClick={() => { setCurrentItem(c); setIsEditing(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete('categories', c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
      case 'settings': return (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-lg">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
            <h3 className="font-black text-lg mb-4 dark:text-white">Tasas de Cambio de Juego</h3>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Costo Base por cada 100 V-Bucks (en USD)</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-bold">$</span>
                <input 
                  type="number" 
                  step="0.001" 
                  value={data.settings?.vbucksRateInUsd || 0.25} 
                  onChange={(e) => setData({...data, settings: { ...data.settings, vbucksRateInUsd: parseFloat(e.target.value) }})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500 text-gray-900 dark:text-white font-bold" 
                  required 
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Ejemplo: Si pones 0.25, un skin de 1,500 pavos costará $3.75 USD y luego se multiplicará por la moneda del cliente.</p>
            </div>
            <button type="submit" className="mt-6 flex items-center justify-center gap-2 bg-gold-500 text-gray-900 font-black px-6 py-3 rounded-xl hover:shadow-lg w-full transition-all hover:scale-105 active:scale-95">
              <Save className="w-5 h-5"/> Guardar Configuración
            </button>
          </div>
        </form>
      );
      case 'content': return (
        <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl pb-12">
          {/* Hero Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="font-black text-xl mb-2 dark:text-white flex items-center gap-2"><Zap className="text-gold-500" /> Sección Hero (Inicio)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Título Principal</label>
                <input type="text" value={data.settings?.heroTitle || ''} onChange={(e) => setData({...data, settings: { ...data.settings, heroTitle: e.target.value }})} className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-gold-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Subtítulo / Descripción</label>
                <textarea value={data.settings?.heroSubtitle || ''} onChange={(e) => setData({...data, settings: { ...data.settings, heroSubtitle: e.target.value }})} className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-gold-500 h-24" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Estadísticas del Hero</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(data.settings?.heroStats || []).map((stat: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter">Etiqueta {idx + 1}</label>
                    <input type="text" value={stat.label} onChange={(e) => {
                      const newStats = [...data.settings.heroStats];
                      newStats[idx].label = e.target.value;
                      setData({...data, settings: { ...data.settings, heroStats: newStats }});
                    }} className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg py-2 px-3 text-xs text-gray-900 dark:text-white font-bold" />
                    <input type="text" value={stat.value} onChange={(e) => {
                      const newStats = [...data.settings.heroStats];
                      newStats[idx].value = e.target.value;
                      setData({...data, settings: { ...data.settings, heroStats: newStats }});
                    }} className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg py-2 px-3 text-xs text-gold-500 font-black" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="font-black text-xl mb-2 dark:text-white flex items-center gap-2"><LayoutGrid className="text-gold-500" /> Sección "Por qué elegirnos"</h3>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Título de la Sección</label>
              <input type="text" value={data.settings?.featuresTitle || ''} onChange={(e) => setData({...data, settings: { ...data.settings, featuresTitle: e.target.value }})} className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-gold-500" />
            </div>
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              {(data.settings?.features || []).map((feature: any, idx: number) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl space-y-3">
                  <label className="block text-xs font-black text-indigo-500 uppercase">Característica {idx + 1}</label>
                  <input type="text" value={feature.title} onChange={(e) => {
                    const newFeatures = [...data.settings.features];
                    newFeatures[idx].title = e.target.value;
                    setData({...data, settings: { ...data.settings, features: newFeatures }});
                  }} className="w-full bg-white dark:bg-gray-900 border-none rounded-xl py-2 px-4 text-sm text-gray-900 dark:text-white font-bold" />
                  <textarea value={feature.desc} onChange={(e) => {
                    const newFeatures = [...data.settings.features];
                    newFeatures[idx].desc = e.target.value;
                    setData({...data, settings: { ...data.settings, features: newFeatures }});
                  }} className="w-full bg-white dark:bg-gray-900 border-none rounded-xl py-2 px-4 text-sm text-gray-500 dark:text-gray-400 h-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Catalog Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="font-black text-xl mb-2 dark:text-white flex items-center gap-2"><DollarSign className="text-gold-500" /> Sección Catálogo</h3>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Descripción del Catálogo</label>
              <textarea value={data.settings?.catalogDesc || ''} onChange={(e) => setData({...data, settings: { ...data.settings, catalogDesc: e.target.value }})} className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-gold-500 h-24" />
            </div>
          </div>

          {/* CTA & Footer */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-6">
            <h3 className="font-black text-xl mb-2 dark:text-white flex items-center gap-2"><Save className="text-gold-500" /> CTA Final & Footer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest">Banner de Acción Final</h4>
                <input type="text" placeholder="Título" value={data.settings?.ctaTitle || ''} onChange={(e) => setData({...data, settings: { ...data.settings, ctaTitle: e.target.value }})} className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white font-bold" />
                <input type="text" placeholder="Subtítulo" value={data.settings?.ctaSubtitle || ''} onChange={(e) => setData({...data, settings: { ...data.settings, ctaSubtitle: e.target.value }})} className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-gray-500" />
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest">Contenido del Footer</h4>
                <textarea placeholder="Descripción en el Footer" value={data.settings?.footerDesc || ''} onChange={(e) => setData({...data, settings: { ...data.settings, footerDesc: e.target.value }})} className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white font-medium h-32" />
              </div>
            </div>
          </div>

          <button type="submit" className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black px-8 py-5 rounded-3xl hover:shadow-2xl w-full transition-all hover:scale-[1.02] active:scale-95 text-lg">
            <Save className="w-6 h-6"/> Guardar Todos los Cambios del Sitio
          </button>
        </form>
      );
      case 'currencies': return (
        <table className="w-full text-left">
          <thead><tr className="border-b dark:border-gray-800 text-gray-500 text-sm uppercase"><th className="pb-3">Moneda</th><th className="pb-3">Símbolo</th><th className="pb-3">Valor vs USD</th><th className="pb-3 text-right">Acciones</th></tr></thead>
          <tbody>
            {data.currencies.map((c: any) => (
              <tr key={c.id} className="border-b dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="py-4 font-bold dark:text-white">{c.name}</td>
                <td className="py-4 font-bold text-gray-500">{c.symbol}</td>
                <td className="py-4 font-bold text-gold-500">{c.rateToDolar}</td>
                <td className="py-4 text-right">
                  <button onClick={() => { setCurrentItem(c); setIsEditing(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete('currencies', c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
      case 'faqs': return (
        <table className="w-full text-left">
          <thead><tr className="border-b dark:border-gray-800 text-gray-500 text-sm uppercase"><th className="pb-3">Pregunta</th><th className="pb-3 text-right">Acciones</th></tr></thead>
          <tbody>
            {data.faqs.map((f: any) => (
              <tr key={f.id} className="border-b dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="py-4 font-bold dark:text-white max-w-xs truncate">{f.q}</td>
                <td className="py-4 text-right">
                  <button onClick={() => { setCurrentItem(f); setIsEditing(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete('faqs', f.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
      case 'testimonials': return (
        <table className="w-full text-left">
          <thead><tr className="border-b dark:border-gray-800 text-gray-500 text-sm uppercase"><th className="pb-3">Usuario</th><th className="pb-3">Texto</th><th className="pb-3 text-right">Acciones</th></tr></thead>
          <tbody>
            {data.testimonials.map((t: any) => (
              <tr key={t.id} className="border-b dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="py-4 font-bold dark:text-white">{t.name}</td>
                <td className="py-4 text-xs dark:text-gray-400 max-w-sm truncate">{t.text}</td>
                <td className="py-4 text-right">
                  <button onClick={() => { setCurrentItem(t); setIsEditing(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete('testimonials', t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
      default: return (
        <table className="w-full text-left">
          <thead><tr className="border-b dark:border-gray-800 text-gray-500 text-sm uppercase"><th className="pb-3">Producto</th><th className="pb-3">Categoría</th><th className="pb-3">Precio</th><th className="pb-3 text-right">Acciones</th></tr></thead>
          <tbody>
            {data.products.map((p: any) => (
              <tr key={p.id} className="border-b dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="py-4 font-bold dark:text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                  </div>
                  {p.name}
                </td>
                <td className="py-4 font-bold text-gray-500">{p.category}</td>
                <td className="py-4 font-black tracking-tight dark:text-white">${p.price}</td>
                <td className="py-4 text-right">
                  <button onClick={() => { setCurrentItem(p); setIsEditing(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete('products', p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
            <h2 className="font-black text-gray-900 dark:text-white text-xl flex items-center gap-2 mb-1"><Settings className="text-gold-500" /> Admin</h2>
            <p className="text-xs font-bold text-green-500">🟢 Sistema Activo</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            {[
              { id: 'products', name: 'Productos', icon: Package },
              { id: 'categories', name: 'Categorías', icon: LayoutGrid },
              { id: 'currencies', name: 'Divisas', icon: DollarSign },
              { id: 'content', name: 'Contenido Web', icon: MessageSquare },
              { id: 'faqs', name: 'FAQ', icon: HelpCircle },
              { id: 'testimonials', name: 'Testimonios', icon: MessageSquare },
              { id: 'settings', name: 'Configuración', icon: Settings }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}>
                <tab.icon className="w-5 h-5" /> {tab.name}
              </button>
            ))}
          </div>

          <button onClick={handleLogout} className="mt-8 flex items-center justify-center gap-2 w-full p-3 rounded-xl font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>

        {/* Workspace */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden min-h-[60vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white capitalize tracking-tight flex items-center gap-2">
                Gestión de {activeTab}
              </h2>
              {activeTab !== 'settings' && (
                <button 
                  onClick={() => { setCurrentItem({}); setIsEditing(true); setImageFile(null); }}
                  className="flex items-center gap-2 bg-gold-500 text-gray-900 font-black px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-gold-500/30 transition-all hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5" /> Nuevo
                </button>
              )}
            </div>
            <div className="p-6 overflow-x-auto">
              {renderTable()}
            </div>
          </div>
        </div>

      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
              <h3 className="font-black text-xl text-gray-900 dark:text-white">{currentItem.id ? 'Editar' : 'Crear'} {activeTab}</h3>
              <button onClick={() => setIsEditing(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={saveItem} className="p-6 flex flex-col gap-4 overflow-y-auto">
              {/* Product Fields */}
              {activeTab === 'products' && (
                <>
                  <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre</label><input type="text" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" required /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Precio (USD)</label>
                      <input type="number" step="0.01" value={currentItem.price || ''} onChange={e => setCurrentItem({...currentItem, price: parseFloat(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                      <select value={currentItem.category || ''} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" required>
                        <option value="">Seleccionar...</option>
                        {data.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Imagen del Producto (Evitar si mantienes actual)</label>
                    <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" />
                    {currentItem.image && <p className="text-xs text-gray-400 mt-1">Actual: {currentItem.image.split('/').pop()}</p>}
                  </div>
                  <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Badge / Tag (Opcional)</label><input type="text" value={currentItem.tag || ''} onChange={e => setCurrentItem({...currentItem, tag: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" placeholder="Ej: Oferta, Nuevo..." /></div>
                </>
              )}

              {/* FAQ Fields */}
              {activeTab === 'faqs' && (
                <>
                  <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Pregunta</label><input type="text" value={currentItem.q || ''} onChange={e => setCurrentItem({...currentItem, q: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" required /></div>
                  <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Respuesta</label><textarea value={currentItem.a || ''} onChange={e => setCurrentItem({...currentItem, a: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500 h-32" required /></div>
                </>
              )}

              {/* Testimonials Fields */}
              {activeTab === 'testimonials' && (
                <>
                  <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre Usuario</label><input type="text" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" required /></div>
                  <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Rol / Badge</label><input type="text" value={currentItem.role || ''} onChange={e => setCurrentItem({...currentItem, role: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" placeholder="Ej: Pro Player, Streamer..." required /></div>
                  <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Testimonio</label><textarea value={currentItem.text || ''} onChange={e => setCurrentItem({...currentItem, text: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500 h-32" required /></div>
                </>
              )}

              {/* Category Fields */}
              {activeTab === 'categories' && (
                <>
                  <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre Categoría</label><input type="text" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" required /></div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Fondo (Subir Imagen)</label>
                    <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" />
                    {currentItem.bgImage && <p className="text-xs text-gray-400 mt-1">Actual: {currentItem.bgImage.split('/').pop()}</p>}
                  </div>
                  <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre Ícono (Ej: Gamepad2, Coins, Ticket)</label><input type="text" value={currentItem.icon || ''} onChange={e => setCurrentItem({...currentItem, icon: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" required /></div>
                </>
              )}

              {/* Currency Fields */}
              {activeTab === 'currencies' && (
                <>
                  <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre Divisa (Ej: COP, EUR)</label><input type="text" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" required /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Símbolo (Ej: $, €)</label><input type="text" value={currentItem.symbol || ''} onChange={e => setCurrentItem({...currentItem, symbol: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" required /></div>
                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Valor en Dólares (Tasa)</label><input type="number" step="0.0001" value={currentItem.rateToDolar || ''} onChange={e => setCurrentItem({...currentItem, rateToDolar: parseFloat(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500" required /></div>
                  </div>
                </>
              )}

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="submit" className="w-full flex justify-center items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-4 px-4 rounded-xl hover:bg-gold-500 hover:text-gray-900 transition-colors shadow-lg">
                  <Save className="w-5 h-5" /> Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
