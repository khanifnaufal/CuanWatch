import React from 'react';
import DataTable from '@/components/DataTable';
import { cn } from '@/lib/utils';

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton" />
        <div className="info">
          <div className="header-line-sm skeleton" />
          <div className="header-line-lg skeleton" />
        </div>
      </div>
      <div className="chart">
        <div className="chart-skeleton skeleton" />
      </div>
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  const columns = [
    {
      header: 'Name',
      cell: () => (
        <div className="name-link">
          <div className="name-image skeleton" />
          <div className="name-line skeleton" />
        </div>
      ),
    },
    {
      header: '24h Change',
      cell: () => (
        <div className="price-change">
          <div className="change-icon skeleton" />
          <div className="change-line skeleton" />
        </div>
      ),
    },
    {
      header: 'Price',
      cell: () => <div className="price-line skeleton" />,
    },
  ];

  const dummyData = Array.from({ length: 6 }, (_, i) => ({ id: i }));

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={dummyData}
        columns={columns as any}
        rowKey={(item: any) => item.id}
        tableClassName="trending-coins-table"
      />
    </div>
  );
};

export const CategoriesFallback = () => {
  const columns = [
    {
      header: 'Category',
      cellClassName: 'category-cell',
      cell: () => <div className="category-line skeleton" />,
    },
    {
      header: 'Top Gainers',
      cellClassName: 'top-gainers-cell',
      cell: () => (
        <div className="flex gap-1">
          <div className="gainer-image skeleton" />
          <div className="gainer-image skeleton" />
          <div className="gainer-image skeleton" />
        </div>
      ),
    },
    {
      header: '24h Change',
      cellClassName: 'change-header-cell',
      cell: () => (
        <div className="change-cell">
          <div className="change-icon skeleton" />
          <div className="change-line skeleton" />
        </div>
      ),
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: () => <div className="value-skeleton-lg skeleton" />,
    },
    {
      header: '24h Volume',
      cellClassName: 'volume-cell',
      cell: () => <div className="value-skeleton-md skeleton" />,
    },
  ];

  const dummyData = Array.from({ length: 10 }, (_, i) => ({ id: i }));

  return (
    <div id="categories-fallback">
      <h4>Top Categories</h4>
      <DataTable
        data={dummyData}
        columns={columns as any}
        rowKey={(item: any) => item.id}
        tableClassName="mt-3"
      />
    </div>
  );
};

export const TopGainersLosersFallback = () => {
  const columns = [
    {
      header: 'Token',
      cellClassName: 'name-cell',
      cell: () => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full skeleton" />
          <div className="flex flex-col gap-1">
            <div className="h-4 w-16 skeleton rounded" />
            <div className="h-3 w-8 skeleton rounded" />
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell max-w-[100px]',
      cell: () => <div className="h-4 w-16 skeleton rounded" />,
    },
    {
      header: '24h',
      cellClassName: 'change-cell text-right w-[90px]',
      cell: () => (
        <div className="flex justify-end">
          <div className="h-4 w-12 skeleton rounded" />
        </div>
      ),
    },
  ];

  const dummyData = Array.from({ length: 5 }, (_, i) => ({ id: i }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <div className="bg-[#121212] rounded-2xl border border-zinc-800/50 p-6 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 w-10 h-10 skeleton rounded-lg" />
          <div className="space-y-2">
            <div className="w-24 h-5 skeleton rounded" />
            <div className="w-32 h-3 skeleton rounded" />
          </div>
        </div>
        <DataTable
          data={dummyData}
          columns={columns as any}
          rowKey={(item: any) => item.id}
          tableClassName="w-full"
          headerRowClassName="border-b border-zinc-800"
          headerCellClassName="py-3 text-xs text-zinc-500 font-medium text-left"
          bodyRowClassName="border-b border-zinc-800/30 last:border-0"
          bodyCellClassName="py-3"
        />
      </div>

      <div className="bg-[#121212] rounded-2xl border border-zinc-800/50 p-6 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 w-10 h-10 skeleton rounded-lg" />
          <div className="space-y-2">
            <div className="w-24 h-5 skeleton rounded" />
            <div className="w-32 h-3 skeleton rounded" />
          </div>
        </div>
        <DataTable
          data={dummyData}
          columns={columns as any}
          rowKey={(item: any) => item.id}
          tableClassName="w-full"
          headerRowClassName="border-b border-zinc-800"
          headerCellClassName="py-3 text-xs text-zinc-500 font-medium text-left"
          bodyRowClassName="border-b border-zinc-800/30 last:border-0"
          bodyCellClassName="py-3"
        />
      </div>
    </div>
  );
};