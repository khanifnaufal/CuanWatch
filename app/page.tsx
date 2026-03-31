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