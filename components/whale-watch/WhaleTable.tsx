import React from 'react';
import DataTable from '@/components/DataTable';
import Image from 'next/image';

interface WhaleTableProps {
  companies: TreasuryCompany[];
  coinSymbol: string;
}

export const WhaleTable = ({ companies, coinSymbol }: WhaleTableProps) => {
  const columns: DataTableColumn<TreasuryCompany>[] = [
    {
      header: 'Company',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-white line-clamp-1">{row.name}</span>
          <span className="text-xs text-purple-100 uppercase">{row.symbol}</span>
        </div>
      ),
      cellClassName: 'min-w-[180px]',
    },
    {
      header: 'Country',
      cell: (row) => <span className="text-purple-100">{row.country}</span>,
    },
    {
      header: `Total ${coinSymbol.toUpperCase()} Holdings`,
      cell: (row) => (
        <span className="font-medium text-white">
          {row.total_holdings.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Current Value (USD)',
      cell: (row) => (
        <span className="font-medium text-white">
          ${row.total_current_value_usd.toLocaleString()}
        </span>
      ),
    },
    {
      header: '% of Supply',
      cell: (row) => (
        <span className="text-green-500 font-semibold">
          {row.percentage_of_total_supply.toFixed(4)}%
        </span>
      ),
      cellClassName: 'text-right',
      headClassName: 'text-right',
    },
  ];

  return (
    <div className="bg-dark-500 rounded-xl overflow-hidden border border-purple-600/10">
      <DataTable
        columns={columns}
        data={companies}
        rowKey={(row) => `${row.name}-${row.symbol}`}
        tableClassName="w-full"
      />
    </div>
  );
};
