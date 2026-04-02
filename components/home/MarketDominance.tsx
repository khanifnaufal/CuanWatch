'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MarketDominanceProps {
  data: GlobalData['data'];
}

const MarketDominance = ({ data }: MarketDominanceProps) => {
  const dominance = data.market_cap_percentage;
  
  // Prepare data for the chart
  const mainCoins = [
    { name: 'Bitcoin (BTC)', value: dominance.btc, color: '#f7931a' },
    { name: 'Ethereum (ETH)', value: dominance.eth, color: '#627eea' },
    { name: 'Others', value: 100 - (dominance.btc + dominance.eth), color: '#334155' },
  ];

  return (
    <div id="market-dominance" className="flex flex-col h-full">
      <h4 className="w-full">Market Dominance</h4>
      <div className="h-64 mt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mainCoins}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {mainCoins.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f1316', border: '1px solid #1e2833', borderRadius: '8px' }}
              itemStyle={{ color: '#a3aed0' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-purple-100/60 mt-auto pb-4 px-5 text-center">
        Total Market Cap Change (24h): 
        <span className={data.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-500' : 'text-red-500'}>
          {data.market_cap_change_percentage_24h_usd.toFixed(2)}%
        </span>
      </p>
    </div>
  );
};

export default MarketDominance;
