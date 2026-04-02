import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface WhaleStatsProps {
  totalHoldings: number;
  totalValueUsd: number;
  marketCapDominance: number;
  coinSymbol: string;
}

export const WhaleStats = ({
  totalHoldings,
  totalValueUsd,
  marketCapDominance,
  coinSymbol,
}: WhaleStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-dark-500 border-purple-600/20">
        <CardContent className="pt-6">
          <p className="text-purple-100 text-sm mb-1">Total Holdings</p>
          <p className="text-2xl font-bold text-white">
            {totalHoldings.toLocaleString()} <span className="text-sm font-normal text-purple-100/60 uppercase">{coinSymbol}</span>
          </p>
        </CardContent>
      </Card>

      <Card className="bg-dark-500 border-purple-600/20">
        <CardContent className="pt-6">
          <p className="text-purple-100 text-sm mb-1">Total Value (USD)</p>
          <p className="text-2xl font-bold text-white">
            ${totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-dark-500 border-purple-600/20">
        <CardContent className="pt-6">
          <p className="text-purple-100 text-sm mb-1">Market Dominance</p>
          <p className="text-2xl font-bold text-green-500">
            {marketCapDominance.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
