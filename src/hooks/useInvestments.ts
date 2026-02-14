'use client';

import { useState, useEffect, useCallback } from 'react';
import { Investment } from '@/types';

export const useInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/investments');
      
      if (!response.ok) {
        throw new Error('Failed to fetch investments');
      }
      
      const data = await response.json();
      setInvestments(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createInvestment = useCallback(async (investment: Omit<Investment, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investment),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create investment');
      }
      
      const data = await response.json();
      setInvestments(prev => [...prev, data.data]);
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const updateInvestment = useCallback(async (id: string, updates: Partial<Investment>) => {
    try {
      setError(null);
      const response = await fetch(`/api/investments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update investment');
      }
      
      const data = await response.json();
      setInvestments(prev => prev.map(inv => inv.id === id ? data.data : inv));
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const deleteInvestment = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/investments/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete investment');
      }
      
      setInvestments(prev => prev.filter(inv => inv.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return {
    investments,
    loading,
    error,
    fetchInvestments,
    createInvestment,
    updateInvestment,
    deleteInvestment,
  };
};