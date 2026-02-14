'use client';

import { useState, useEffect, useCallback } from 'react';
import { SalesData } from '@/types';

export const useSalesData = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/sales-data');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
      
      const data = await response.json();
      setSalesData(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSalesData = useCallback(async (data: Omit<SalesData, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const response = await fetch('/api/sales-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create sales data');
      }
      
      const result = await response.json();
      setSalesData(prev => [...prev, result.data]);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const getSalesDataByInvestment = useCallback((investmentId: string) => {
    return salesData.filter(data => data.investmentId === investmentId);
  }, [salesData]);

  const getLatestSalesData = useCallback((investmentId: string) => {
    const investmentData = salesData
      .filter(data => data.investmentId === investmentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return investmentData[0] || null;
  }, [salesData]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  return {
    salesData,
    loading,
    error,
    fetchSalesData,
    createSalesData,
    getSalesDataByInvestment,
    getLatestSalesData,
  };
};