'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ROIMetricsCardProps {
  title: string;
  value: string;
  percentage: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

export function ROIMetricsCard({ title, value, percentage, icon, trend }: ROIMetricsCardProps) {
  const isPositive = trend === 'up' ? percentage >= 0 : percentage <= 0;
  const displayPercentage = Math.abs(percentage);

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-800 hover:border-primary">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
          <div className="text-primary">
            {icon}
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded ${
          isPositive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span className="text-sm font-semibold">
            {displayPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white mb-4">{value}</p>

      <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
            isPositive 
              ? 'bg-gradient-to-r from-secondary to-primary' 
              : 'bg-gradient-to-r from-red-500 to-orange-500'
          }`}
          style={{
            width: `${Math.min(displayPercentage, 100)}%`,
            animation: 'slideIn 1s ease-out'
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}