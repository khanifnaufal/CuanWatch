'use client';

import React, { useState, useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { getCoinPrices, getSimpleCoinDetails } from '@/lib/coingecko.actions';
import { SearchModal } from '@/components/SearchModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';

const PortfolioPage = () => {
  const { portfolio, addAsset, removeAsset, isLoaded } = usePortfolio();
  const [prices, setPrices] = useState<Record<string, { usd: number }>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Modal state for adding asset details
  const [selectedCoin, setSelectedCoin] = useState<Partial<PortfolioItem> | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const fetchCurrentPrices = async () => {
    if (portfolio.length === 0) return;
    setIsUpdating(true);
    const ids = portfolio.map((item) => item.id);
    const newPrices = await getCoinPrices(ids);
    if (newPrices) {
      setPrices(newPrices);
    }
    setIsUpdating(false);
  };

  useEffect(() => {
    if (isLoaded && portfolio.length > 0) {
      fetchCurrentPrices();
    }
  }, [isLoaded, portfolio.length]);

  const handleCoinSelect = async (coinId: string) => {
    setIsFetchingMetadata(true);
    const details = await getSimpleCoinDetails(coinId);
    if (details) {
      setSelectedCoin(details);
      setBuyPrice(details.buyPrice?.toString() || '');
      setAddModalOpen(true);
    }
    setIsFetchingMetadata(false);
  };

  const handleAddAsset = () => {
    if (!selectedCoin || !amount || !buyPrice) return;
    
    addAsset({
      id: selectedCoin.id!,
      symbol: selectedCoin.symbol!,
      name: selectedCoin.name!,
      image: selectedCoin.image!,
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice),
    });
    
    setAddModalOpen(false);
    setAmount('');
    setBuyPrice('');
    setSelectedCoin(null);
  };

  const calculateStats = () => {
    let totalValue = 0;
    let totalProfit = 0;
    let totalCost = 0;

    portfolio.forEach((item) => {
      const currentPrice = prices[item.id]?.usd || item.buyPrice;
      const currentValue = item.amount * currentPrice;
      const cost = item.amount * item.buyPrice;
      
      totalValue += currentValue;
      totalCost += cost;
      totalProfit += (currentValue - cost);
    });

    const profitPercentage = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return { totalValue, totalProfit, profitPercentage };
  };

  const { totalValue, totalProfit, profitPercentage } = calculateStats();

  if (!isLoaded) return <div className="main-container py-20 text-center text-purple-100">Loading your vault...</div>;

  return (
    <main className="main-container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio Simulator</h1>
          <p className="text-purple-100/70">Track your imaginary bags with real-time prices.</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchCurrentPrices} 
            disabled={isUpdating || portfolio.length === 0}
            className="border-purple-600/20 bg-dark-500 hover:bg-dark-600"
          >
            <RefreshCcw className={cn("size-4", isUpdating && "animate-spin")} />
          </Button>
          
          <SearchModal 
            onSelect={handleCoinSelect}
            trigger={
              <Button className="bg-green-500 hover:bg-green-600 text-dark-900 font-bold px-6">
                <Plus className="size-4 mr-2" /> Add Asset
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-dark-500 border border-purple-600/10 p-6 rounded-2xl">
          <p className="text-purple-100/60 text-sm font-medium mb-1">Total Balance</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-dark-500 border border-purple-600/10 p-6 rounded-2xl">
          <p className="text-purple-100/60 text-sm font-medium mb-1">Total Profit/Loss</p>
          <div className="flex items-center gap-2">
            <p className={cn("text-3xl font-bold", totalProfit >= 0 ? "text-green-500" : "text-red-500")}>
              {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
            </p>
          </div>
        </div>
        <div className="bg-dark-500 border border-purple-600/10 p-6 rounded-2xl">
          <p className="text-purple-100/60 text-sm font-medium mb-1">24h Performance</p>
          <div className={cn("flex items-center gap-1 text-2xl font-bold", profitPercentage >= 0 ? "text-green-500" : "text-red-500")}>
            {profitPercentage >= 0 ? <TrendingUp className="size-6" /> : <TrendingDown className="size-6" />}
            {profitPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div className="bg-dark-500 border border-purple-600/10 rounded-2xl overflow-hidden">
        {portfolio.length === 0 ? (
          <div className="py-20 text-center">
            <div className="bg-dark-600 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-purple-600 size-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No assets yet</h3>
            <p className="text-purple-100/60">Start adding coins to see your portfolio performance.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-dark-600/50 border-b border-purple-600/10">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-purple-100/60 uppercase">Asset</th>
                  <th className="px-6 py-4 text-sm font-semibold text-purple-100/60 uppercase">Price</th>
                  <th className="px-6 py-4 text-sm font-semibold text-purple-100/60 uppercase">Holdings</th>
                  <th className="px-6 py-4 text-sm font-semibold text-purple-100/60 uppercase">Profit/Loss</th>
                  <th className="px-6 py-4 text-sm font-semibold text-purple-100/60 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-600/5">
                {portfolio.map((item) => {
                  const currentPrice = prices[item.id]?.usd || item.buyPrice;
                  const profit = (currentPrice - item.buyPrice) * item.amount;
                  const pPercentage = ((currentPrice - item.buyPrice) / item.buyPrice) * 100;
                  
                  return (
                    <tr key={item.id} className="hover:bg-purple-600/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-8 rounded-full bg-dark-600 overflow-hidden">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{item.name}</p>
                            <p className="text-xs text-purple-100/40 uppercase">{item.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{formatCurrency(currentPrice)}</p>
                        <p className="text-xs text-purple-100/40">Avg: {formatCurrency(item.buyPrice)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{item.amount} {item.symbol}</p>
                        <p className="text-xs text-purple-100/40">{formatCurrency(item.amount * currentPrice)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className={cn("font-medium", profit >= 0 ? "text-green-500" : "text-red-500")}>
                          {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                        </p>
                        <p className={cn("text-xs font-medium", profit >= 0 ? "text-green-500" : "text-red-500")}>
                          {profit >= 0 ? '+' : ''}{pPercentage.toFixed(2)}%
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeAsset(item.id)}
                          className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Asset Detail Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="bg-dark-950 border border-purple-600/20 text-white">
          <DialogHeader>
            <DialogTitle>Add to Portfolio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-100/60">Amount</label>
              <Input 
                type="number" 
                placeholder="0.00" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="bg-dark-900 border-purple-600/20 focus:border-purple-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-100/60">Buy Price (USD)</label>
              <Input 
                type="number" 
                placeholder="current price" 
                value={buyPrice} 
                onChange={(e) => setBuyPrice(e.target.value)}
                className="bg-dark-900 border-purple-600/20 focus:border-purple-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddAsset}
              className="bg-green-500 hover:bg-green-600 text-dark-900 font-bold"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PortfolioPage;
