import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import TiendaDiaria from './pages/TiendaDiaria';
import Admin from './pages/Admin';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';

import { CurrencyProvider } from './context/CurrencyContext';

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogo" element={<Catalog />} />
                <Route path="/tienda-diaria" element={<TiendaDiaria />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
