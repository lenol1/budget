import React, { createContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [exchangeRates, setExchangeRates] = useState([]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.monobank.ua/bank/currency');
        if (!response.ok) throw new Error('Failed to fetch exchange rates');
        const data = await response.json();
        setExchangeRates(data.filter((rate) => rate.rateBuy && rate.rateSell));
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  return (
    <CurrencyContext.Provider value={{ exchangeRates }}>
      {children}
    </CurrencyContext.Provider>
  );
};
