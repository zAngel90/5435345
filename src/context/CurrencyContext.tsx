import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config/api';

type Currency = {
  id: string;
  name: string;
  symbol: string;
  rateToDolar: number;
};

type CurrencyContextType = {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  vbucksRate: number;
  setSelectedCurrencyByName: (name: string) => void;
  formatPrice: (usdPrice: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [vbucksRate, setVbucksRate] = useState<number>(0.25);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/currencies`),
      fetch(`${API_URL}/settings`)
    ])
      .then(async ([currRes, settingsRes]) => {
        const data = await currRes.json();
        const settings = await settingsRes.json();
        
        if (settings && settings.vbucksRateInUsd) {
          setVbucksRate(settings.vbucksRateInUsd);
        }

        if(data && data.length > 0) {
          setCurrencies(data);
          const hasCop = data.find((c: any) => c.name === 'COP');
          if (hasCop) setSelectedCurrency(hasCop);
          else setSelectedCurrency(data[0]);
        }
      })
      .catch(err => console.error("Error loading currency/settings data:", err));
  }, []);

  const setSelectedCurrencyByName = (name: string) => {
    const currency = currencies.find(c => c.name === name);
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  const formatPrice = (usdPrice: number) => {
    // If not loaded or no valid conversion, fallback to USD
    if (!selectedCurrency || !selectedCurrency.rateToDolar) return `${Number(usdPrice).toFixed(2)}`;
    
    // Safely parse the price since sometimes it's passed as string in legacy code
    const numericPrice = typeof usdPrice === 'string' ? parseFloat(usdPrice) : usdPrice;
    if (isNaN(numericPrice)) return "0.00";

    const converted = numericPrice * selectedCurrency.rateToDolar;

    // Use full numbers for currencies with high inflation / large denominations
    if (selectedCurrency.name === 'COP' || selectedCurrency.name === 'CLP' || selectedCurrency.name === 'ARS') {
      return `${Math.round(converted).toLocaleString('es-CO')}`;
    }

    // Default formatting for smaller denomination currencies
    return `${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currencies, selectedCurrency, vbucksRate, setSelectedCurrencyByName, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
