import React, { Suspense } from 'react';
import CoinOverview from '@/components/home/CoinOverview';
import TrendingCoins from '@/components/home/TrendingCoins';
import {
  CategoriesFallback,
  CoinOverviewFallback,
  TrendingCoinsFallback,
  TopGainersLosersFallback,
} from '@/components/home/fallback';
import Categories from '@/components/home/Categories';
import TopGainersLosers from '@/components/home/TopGainersLosers';
import FearGreedIndex from '@/components/home/FearGreedIndex';
import MarketDominance from '@/components/home/MarketDominance';
import { getFearGreedIndex } from '@/lib/alternative.actions';
import { getGlobalMarketData } from '@/lib/coingecko.actions';

const MarketInsights = async () => {
  const fngData = await getFearGreedIndex();
  const globalData = await getGlobalMarketData();

  if (!fngData || !globalData) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
      <div className="bg-dark-500 rounded-xl p-5 border border-purple-600/10 h-full">
        <FearGreedIndex data={fngData.data[0]} />
      </div>
      <div className="bg-dark-500 rounded-xl p-5 border border-purple-600/10 h-full">
        <MarketDominance data={globalData.data} />
      </div>
    </section>
  );
};

const Page = async () => {
  return (
    <main className="main-container">
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>

        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <Suspense fallback={<div className="h-64 w-full bg-dark-500 animate-pulse rounded-xl mt-7" />}>
        <MarketInsights />
      </Suspense>

      <section className="w-full mt-7">
        <Suspense fallback={<TopGainersLosersFallback />}>
          <TopGainersLosers />
        </Suspense>
      </section>

      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesFallback/>}>
          <Categories />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;