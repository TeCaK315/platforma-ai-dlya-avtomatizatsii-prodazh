'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { ChartDataPoint } from '@/types';

interface ROIChartProps {
  data: ChartDataPoint[];
  chartType?: 'line' | 'bar';
}

export function ROIChart({ data, chartType = 'line' }: ROIChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-500" />
          ROI Trends
        </h2>
        <div className="flex gap-2">
          <span className="text-sm text-gray-400">
            {data.length} data points
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg">No data available yet</p>
          <p className="text-sm">Add investments and sales data to see ROI trends</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="roi"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 5 }}
                activeDot={{ r: 8 }}
                name="ROI"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 5 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ fill: '#EF4444', r: 5 }}
                name="Cost"
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="roi" fill="#8B5CF6" name="ROI" />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
              <Bar dataKey="cost" fill="#EF4444" name="Cost" />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </Card>
  );
}