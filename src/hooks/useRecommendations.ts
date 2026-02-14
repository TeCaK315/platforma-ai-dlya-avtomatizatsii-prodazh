'use client';

import { useState, useCallback } from 'react';
import { OptimizationRecommendation, ROIReport, Investment, SalesData } from '@/types';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = useCallback(async (
    roiReport: ROIReport,
    investments: Investment[],
    salesData: SalesData[]
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roiReport,
          investments,
          salesData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }
      
      const data = await response.json();
      setRecommendations(data.data || []);
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRecommendations([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const filterRecommendations = useCallback((
    priority?: 'high' | 'medium' | 'low',
    category?: 'cost_reduction' | 'revenue_increase' | 'efficiency' | 'automation'
  ) => {
    return recommendations.filter(rec => {
      if (priority && rec.priority !== priority) return false;
      if (category && rec.category !== category) return false;
      return true;
    });
  }, [recommendations]);

  const getHighPriorityRecommendations = useCallback(() => {
    return recommendations
      .filter(rec => rec.priority === 'high')
      .sort((a, b) => b.estimatedROIIncrease - a.estimatedROIIncrease);
  }, [recommendations]);

  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
    setError(null);
  }, []);

  return {
    recommendations,
    loading,
    error,
    generateRecommendations,
    filterRecommendations,
    getHighPriorityRecommendations,
    clearRecommendations,
  };
};