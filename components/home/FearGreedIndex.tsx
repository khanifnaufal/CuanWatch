'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface FearGreedIndexProps {
  data: FearGreedData;
}

const FearGreedIndex = ({ data }: FearGreedIndexProps) => {
  const value = parseInt(data.value);
  
  // Data for the gauge background
  const gaugeData = [
    { value: 20, color: '#ff685f' }, // Extreme Fear
    { value: 20, color: '#ff9f5f' }, // Fear
    { value: 20, color: '#dabe44' }, // Neutral
    { value: 20, color: '#99e39e' }, // Greed
    { value: 20, color: '#76da44' }, // Extreme Greed
  ];

  // Calculate needle rotation (0 to 180 degrees)
  // 0 is Extreme Fear, 180 is Extreme Greed
  const needleRotation = (value / 100) * 180 - 90;

  return (
    <div id="trending-coins" className="flex flex-col items-center">
      <h4 className="w-full">Market Sentiment</h4>
      <div className="relative h-48 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.3} />
              ))}
            </Pie>
            {/* Active section highlight */}
            <Pie
              data={[{ value: value }, { value: 100 - value }]}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={180 - (value / 100) * 180}
              innerRadius="60%"
              outerRadius="95%"
              dataKey="value"
              stroke="none"
            >
              <Cell fill={value < 40 ? '#ff685f' : value < 60 ? '#dabe44' : '#76da44'} />
              <Cell fill="transparent" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Value Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white"
          >
            {value}
          </motion.span>
          <span className="text-purple-100 font-medium uppercase tracking-wider text-sm mt-1">
            {data.value_classification}
          </span>
        </div>
      </div>
      
      <p className="text-xs text-purple-100/60 mt-4 px-5 text-center">
        The Fear & Greed Index is a tool used to measure the emotions and sentiments of the crypto market.
      </p>
    </div>
  );
};

export default FearGreedIndex;
