'use client';

import { useState, useEffect } from 'react';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('cuanwatch_portfolio');
    if (savedPortfolio) {
      try {
        setPortfolio(JSON.parse(savedPortfolio));
      } catch (e) {
        console.error('Failed to parse portfolio from localStorage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cuanwatch_portfolio', JSON.stringify(portfolio));
    }
  }, [portfolio, isLoaded]);

  const addAsset = (item: PortfolioItem) => {
    setPortfolio((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === item.id);
      if (existingIndex > -1) {
        // Average up/down or just add more? For simulator, let's just add to amount
        // and calculate new average buy price
        const updated = [...prev];
        const existing = updated[existingIndex];
        const totalAmount = existing.amount + item.amount;
        const totalCost = (existing.amount * existing.buyPrice) + (item.amount * item.buyPrice);
        
        updated[existingIndex] = {
          ...existing,
          amount: totalAmount,
          buyPrice: totalCost / totalAmount
        };
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeAsset = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
  };

  const updateAsset = (id: string, amount: number, buyPrice: number) => {
    setPortfolio((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, amount, buyPrice } : item
      )
    );
  };

  return { portfolio, addAsset, removeAsset, updateAsset, isLoaded };
};
