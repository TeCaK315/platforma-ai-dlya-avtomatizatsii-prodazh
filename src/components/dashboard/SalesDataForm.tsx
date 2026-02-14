'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { BarChart3, Loader2 } from 'lucide-react';
import type { SalesData, Investment } from '@/types';

interface SalesDataFormProps {
  investments: Investment[];
  onSubmit: (salesData: Omit<SalesData, 'id' | 'createdAt'>) => Promise<void>;
}

export function SalesDataForm({ investments, onSubmit }: SalesDataFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    investmentId: '',
    date: '',
    revenue: '',
    dealsClosed: '',
    timeSaved: '',
    conversionRate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.investmentId) {
      newErrors.investmentId = 'Please select an investment';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.revenue || parseFloat(formData.revenue) < 0) {
      newErrors.revenue = 'Revenue must be 0 or greater';
    }
    
    if (!formData.dealsClosed || parseInt(formData.dealsClosed) < 0) {
      newErrors.dealsClosed = 'Deals closed must be 0 or greater';
    }
    
    if (!formData.timeSaved || parseFloat(formData.timeSaved) < 0) {
      newErrors.timeSaved = 'Time saved must be 0 or greater';
    }
    
    if (!formData.conversionRate || parseFloat(formData.conversionRate) < 0 || parseFloat(formData.conversionRate) > 100) {
      newErrors.conversionRate = 'Conversion rate must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        investmentId: formData.investmentId,
        date: formData.date,
        revenue: parseFloat(formData.revenue),
        dealsClosed: parseInt(formData.dealsClosed),
        timeSaved: parseFloat(formData.timeSaved),
        conversionRate: parseFloat(formData.conversionRate),
      });

      setFormData({
        investmentId: formData.investmentId,
        date: '',
        revenue: '',
        dealsClosed: '',
        timeSaved: '',
        conversionRate: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to add sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-green-500" />
        Add Sales Data
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Investment
          </label>
          <select
            value={formData.investmentId}
            onChange={(e) => setFormData({ ...formData, investmentId: e.target.value })}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          >
            <option value="">Select an investment</option>
            {investments.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.toolName}
              </option>
            ))}
          </select>
          {errors.investmentId && <p className="text-red-500 text-sm mt-1">{errors.investmentId}</p>}
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Revenue ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="10000"
            />
            {errors.revenue && <p className="text-red-500 text-sm mt-1">{errors.revenue}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Deals Closed
            </label>
            <input
              type="number"
              value={formData.dealsClosed}
              onChange={(e) => setFormData({ ...formData, dealsClosed: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="15"
            />
            {errors.dealsClosed && <p className="text-red-500 text-sm mt-1">{errors.dealsClosed}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Time Saved (hours)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.timeSaved}
              onChange={(e) => setFormData({ ...formData, timeSaved: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="20"
            />
            {errors.timeSaved && <p className="text-red-500 text-sm mt-1">{errors.timeSaved}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Conversion Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.conversionRate}
              onChange={(e) => setFormData({ ...formData, conversionRate: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="25.5"
            />
            {errors.conversionRate && <p className="text-red-500 text-sm mt-1">{errors.conversionRate}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <BarChart3 className="w-5 h-5" />
              Add Sales Data
            </>
          )}
        </button>
      </form>
    </Card>
  );
}