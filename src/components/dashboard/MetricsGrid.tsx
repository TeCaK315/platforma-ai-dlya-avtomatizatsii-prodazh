'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Percent, Target } from 'lucide-react';
import type { MetricCard } from '@/types';

interface MetricsGridProps {
  metrics: MetricCard[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    metrics.forEach((metric, index) => {
      const numericValue = typeof metric.value === 'number' ? metric.value : parseFloat(String(metric.value).replace(/[^0-9.-]/g, ''));
      if (!isNaN(numericValue)) {
        let current = 0;
        const increment = numericValue / 30;
        const timer = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
          }
          setAnimatedValues(prev => ({ ...prev, [index]: current }));
        }, 20);
      }
    });
  }, [metrics]);

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'dollar': <DollarSign className="w-6 h-6" />,
      'calendar': <Calendar className="w-6 h-6" />,
      'percent': <Percent className="w-6 h-6" />,
      'target': <Target className="w-6 h-6" />,
    };
    return iconMap[iconName] || <Target className="w-6 h-6" />;
  };

  const formatValue = (value: string | number, animatedValue?: number): string => {
    if (typeof value === 'number' && animatedValue !== undefined) {
      if (value > 1000) {
        return `$${(animatedValue / 1000).toFixed(1)}K`;
      }
      return animatedValue.toFixed(0);
    }
    return String(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} gradient={true} hover={true}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-400 text-sm font-medium mb-2">{metric.title}</p>
              <p className="text-3xl font-bold text-white mb-2">
                {formatValue(metric.value, animatedValues[index])}
              </p>
              <div className="flex items-center gap-2">
                {metric.trend === 'up' && (
                  <div className="flex items-center text-green-500 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>{metric.change > 0 ? '+' : ''}{metric.change}%</span>
                  </div>
                )}
                {metric.trend === 'down' && (
                  <div className="flex items-center text-red-500 text-sm">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span>{metric.change}%</span>
                  </div>
                )}
                {metric.trend === 'neutral' && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <span>{metric.change}%</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
              {getIcon(metric.icon)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}