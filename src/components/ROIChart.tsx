'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { AnalysisResult } from '@/types';

interface ROIChartProps {
  analyses: AnalysisResult[];
}

export const ROIChart: React.FC<ROIChartProps> = ({ analyses }) => {
  const chartData = analyses
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((analysis) => ({
      date: new Date(analysis.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      roi: analysis.metrics.roi_percentage,
      revenue: analysis.metrics.revenue_increase,
      savings: analysis.metrics.cost_savings,
      efficiency: analysis.metrics.efficiency_gain_percentage,
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">ROI Trends</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No data available. Complete an analysis to see trends.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-white mb-6">ROI Trends Over Time</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorROI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#50E3C2" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#50E3C2" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F5A623" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F5A623" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#EAEAEA',
            }}
            labelStyle={{ color: '#EAEAEA' }}
          />
          <Legend 
            wrapperStyle={{ color: '#EAEAEA' }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="roi"
            stroke="#4A90E2"
            fillOpacity={1}
            fill="url(#colorROI)"
            name="ROI %"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="efficiency"
            stroke="#50E3C2"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Efficiency %"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Avg ROI</span>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {(chartData.reduce((sum, d) => sum + d.roi, 0) / chartData.length).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Revenue</span>
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            ${(chartData.reduce((sum, d) => sum + d.revenue, 0) / 1000).toFixed(1)}K
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Savings</span>
            <div className="w-3 h-3 rounded-full bg-accent"></div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            ${(chartData.reduce((sum, d) => sum + d.savings, 0) / 1000).toFixed(1)}K
          </p>
        </div>
      </div>
    </div>
  );
};