'use client';

import { useState, useCallback } from 'react';
import { ROIReport, Investment, SalesData } from '@/types';

export const useROIAnalysis = () => {
  const [report, setReport] = useState<ROIReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeROI = useCallback(async (
    investments: Investment[],
    salesData: SalesData[],
    dateRange?: { start: string; end: string }
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/roi/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investments,
          salesData,
          dateRange,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze ROI');
      }
      
      const data = await response.json();
      setReport(data.data);
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setReport(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeInvestmentROI = useCallback(async (
    investmentId: string,
    investments: Investment[],
    salesData: SalesData[]
  ) => {
    const investment = investments.find(inv => inv.id === investmentId);
    const investmentSalesData = salesData.filter(data => data.investmentId === investmentId);
    
    if (!investment) {
      throw new Error('Investment not found');
    }
    
    return analyzeROI([investment], investmentSalesData);
  }, [analyzeROI]);

  const clearReport = useCallback(() => {
    setReport(null);
    setError(null);
  }, []);

  return {
    report,
    loading,
    error,
    analyzeROI,
    analyzeInvestmentROI,
    clearReport,
  };
};