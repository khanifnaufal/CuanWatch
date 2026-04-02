import React from 'react';
import { getPublicTreasury } from '@/lib/coingecko.actions';
import { WhaleStats } from '@/components/whale-watch/WhaleStats';
import { WhaleTable } from '@/components/whale-watch/WhaleTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Whale Watch | CuanWatch',
  description: 'Monitor public companies holding Bitcoin and Ethereum in their treasury.',
};

export default async function WhaleWatchPage() {
  const btcData = await getPublicTreasury('bitcoin');
  const ethData = await getPublicTreasury('ethereum');

  return (
    <main className="main-container">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Whale Watch</h1>
        <p className="text-purple-100 text-lg">
          Track public companies with the largest crypto treasury holdings.
        </p>
      </div>

      <Tabs defaultValue="bitcoin" className="w-full flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-purple-600/10 pb-4">
          <TabsList className="bg-dark-500 border border-purple-600/20 p-1 h-12">
            <TabsTrigger 
              value="bitcoin" 
              className="px-8 font-semibold data-active:bg-green-500 data-active:text-dark-900"
            >
              Bitcoin (BTC)
            </TabsTrigger>
            <TabsTrigger 
              value="ethereum" 
              className="px-8 font-semibold data-active:bg-green-500 data-active:text-dark-900"
            >
              Ethereum (ETH)
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bitcoin" className="mt-0 focus-visible:outline-none">
          {btcData ? (
            <>
              <WhaleStats 
                totalHoldings={btcData.total_holdings}
                totalValueUsd={btcData.total_value_usd}
                marketCapDominance={btcData.market_cap_dominance}
                coinSymbol="BTC"
              />
              <WhaleTable companies={btcData.companies} coinSymbol="BTC" />
            </>
          ) : (
            <div className="p-12 text-center bg-dark-500 rounded-xl border border-purple-600/10">
              <p className="text-purple-100">No Bitcoin treasury data available at the moment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ethereum" className="mt-0 focus-visible:outline-none">
          {ethData ? (
            <>
              <WhaleStats 
                totalHoldings={ethData.total_holdings}
                totalValueUsd={ethData.total_value_usd}
                marketCapDominance={ethData.market_cap_dominance}
                coinSymbol="ETH"
              />
              <WhaleTable companies={ethData.companies} coinSymbol="ETH" />
            </>
          ) : (
            <div className="p-12 text-center bg-dark-500 rounded-xl border border-purple-600/10">
              <p className="text-purple-100">No Ethereum treasury data available at the moment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <section className="mt-12 p-6 bg-dark-500/50 rounded-xl border border-purple-600/10">
        <h2 className="text-xl font-bold mb-4">Why monitor Public Treasuries?</h2>
        <p className="text-purple-100 leading-relaxed italic">
          &ldquo;When public companies start holding Bitcoin, they are treating it as a reserve asset. This institutional adoption signals a major shift in how the world views digital assets, moving them from speculative assets to mainstream financial tools.&rdquo;
        </p>
      </section>
    </main>
  );
}
