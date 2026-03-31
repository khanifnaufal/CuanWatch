import { fetcher } from '@/lib/coingecko.actions';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { TopGainersLosersFallback } from './fallback';

const TopGainersLosers = async () => {
  let coins: CoinMarketData[];
  try {
    coins = await fetcher<CoinMarketData[]>(
      'coins/markets',
      { vs_currency: 'usd', order: 'market_cap_desc', per_page: 250, page: 1 },
      300
    );
  } catch (error) {
    console.error('Error fetching market coins for gainers/losers:', error);
    return <TopGainersLosersFallback />;
  }

  // Filter out any coin without price change data, then sort by percentage change
  const validCoins = coins.filter(c => typeof c.price_change_percentage_24h === 'number');
  
  // Sort descending for gainers (Top 5)
  const gainers = [...validCoins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 5);
  // Sort ascending for losers (Top 5)
  const losers = [...validCoins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 5);

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: 'Token',
      cellClassName: 'name-cell',
      cell: (coin) => (
        <Link href={`/coins/${coin.id}`} className="flex items-center gap-3">
          <Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full" />
          <div className="flex flex-col">
            <p className="font-semibold text-sm ">{coin.name}</p>
            <span className="text-xs text-zinc-500 uppercase">{coin.symbol}</span>
          </div>
        </Link>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell max-w-[100px]',
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: '24h',
      cellClassName: 'change-cell text-right w-[90px]',
      cell: (coin) => {
        const change = coin.price_change_percentage_24h;
        const isUp = change > 0;
        const isDown = change < 0;
        return (
          <div className={cn('flex items-center justify-end gap-1 font-medium', isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-zinc-400')}>
            <span>{formatPercentage(Math.abs(change))}</span>
            {isUp && <TrendingUp size={14} />}
            {isDown && <TrendingDown size={14} />}
          </div>
        );
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Gainers Card */}
      <div className="bg-[#121212] rounded-2xl border border-zinc-800/50 p-6 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Top Gainers</h4>
            <p className="text-xs text-zinc-400">Coins with highest 24h gains</p>
          </div>
        </div>
        <DataTable
          data={gainers}
          columns={columns}
          rowKey={(coin) => coin.id}
          tableClassName="w-full"
          headerRowClassName="border-b border-zinc-800"
          headerCellClassName="py-3 text-xs text-zinc-500 font-medium text-left"
          bodyRowClassName="hover:bg-zinc-800/20 transition-colors border-b border-zinc-800/30 last:border-0"
          bodyCellClassName="py-3"
        />
      </div>

      {/* Losers Card */}
      <div className="bg-[#121212] rounded-2xl border border-zinc-800/50 p-6 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-red-500/10 rounded-lg">
            <TrendingDown className="text-red-500" size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Top Losers</h4>
            <p className="text-xs text-zinc-400">Coins with highest 24h losses</p>
          </div>
        </div>
        <DataTable
          data={losers}
          columns={columns}
          rowKey={(coin) => coin.id}
          tableClassName="w-full"
          headerRowClassName="border-b border-zinc-800"
          headerCellClassName="py-3 text-xs text-zinc-500 font-medium text-left"
          bodyRowClassName="hover:bg-zinc-800/20 transition-colors border-b border-zinc-800/30 last:border-0"
          bodyCellClassName="py-3"
        />
      </div>
    </div>
  );
};

export default TopGainersLosers;
