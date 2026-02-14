'use client';

import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import type { DataInputForm as DataInputFormType, ValidationError } from '@/types';

interface DataInputFormProps {
  onAnalysisComplete: () => void;
}

export function DataInputForm({ onAnalysisComplete }: DataInputFormProps) {
  const [formData, setFormData] = useState<DataInputFormType>({
    sales: {
      period: '',
      revenue: 0,
      units_sold: 0,
      average_deal_size: 0,
      conversion_rate: 0,
      sales_cycle_days: 0
    },
    investment: {
      ai_tools_cost: 0,
      implementation_cost: 0,
      training_cost: 0,
      maintenance_cost: 0,
      period: ''
    }
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSalesChange = (field: keyof typeof formData.sales, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      sales: {
        ...prev.sales,
        [field]: value
      }
    }));
    setErrors([]);
    setSuccessMessage(null);
  };

  const handleInvestmentChange = (field: keyof typeof formData.investment, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      investment: {
        ...prev.investment,
        [field]: value
      }
    }));
    setErrors([]);
    setSuccessMessage(null);
  };

  const validateForm = (): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    if (!formData.sales.period.trim()) {
      validationErrors.push({ field: 'sales.period', message: 'Sales period is required' });
    }

    if (formData.sales.revenue <= 0) {
      validationErrors.push({ field: 'sales.revenue', message: 'Revenue must be greater than 0' });
    }

    if (formData.sales.units_sold <= 0) {
      validationErrors.push({ field: 'sales.units_sold', message: 'Units sold must be greater than 0' });
    }

    if (formData.sales.average_deal_size <= 0) {
      validationErrors.push({ field: 'sales.average_deal_size', message: 'Average deal size must be greater than 0' });
    }

    if (formData.sales.conversion_rate < 0 || formData.sales.conversion_rate > 100) {
      validationErrors.push({ field: 'sales.conversion_rate', message: 'Conversion rate must be between 0 and 100' });
    }

    if (formData.sales.sales_cycle_days <= 0) {
      validationErrors.push({ field: 'sales.sales_cycle_days', message: 'Sales cycle days must be greater than 0' });
    }

    if (!formData.investment.period.trim()) {
      validationErrors.push({ field: 'investment.period', message: 'Investment period is required' });
    }

    if (formData.investment.ai_tools_cost < 0) {
      validationErrors.push({ field: 'investment.ai_tools_cost', message: 'AI tools cost cannot be negative' });
    }

    if (formData.investment.implementation_cost < 0) {
      validationErrors.push({ field: 'investment.implementation_cost', message: 'Implementation cost cannot be negative' });
    }

    if (formData.investment.training_cost < 0) {
      validationErrors.push({ field: 'investment.training_cost', message: 'Training cost cannot be negative' });
    }

    if (formData.investment.maintenance_cost < 0) {
      validationErrors.push({ field: 'investment.maintenance_cost', message: 'Maintenance cost cannot be negative' });
    }

    const totalInvestment = formData.investment.ai_tools_cost + 
                           formData.investment.implementation_cost + 
                           formData.investment.training_cost + 
                           formData.investment.maintenance_cost;

    if (totalInvestment === 0) {
      validationErrors.push({ field: 'investment', message: 'Total investment must be greater than 0' });
    }

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/analyze-roi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze ROI');
      }

      const result = await response.json();
      setSuccessMessage('Analysis completed successfully!');
      
      setTimeout(() => {
        onAnalysisComplete();
      }, 1500);
    } catch (error) {
      setErrors([{
        field: 'general',
        message: error instanceof Error ? error.message : 'Failed to submit analysis'
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white">New ROI Analysis</h2>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-500" size={20} />
            <h3 className="font-semibold text-red-300">Validation Errors</h3>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-300 text-sm">{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg flex items-center gap-2">
          <CheckCircle className="text-green-500" size={20} />
          <p className="text-green-300">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">Sales Data</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Period
              </label>
              <input
                type="text"
                value={formData.sales.period}
                onChange={(e) => handleSalesChange('period', e.target.value)}
                placeholder="e.g., Q1 2024"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Revenue ($)
              </label>
              <input
                type="number"
                value={formData.sales.revenue || ''}
                onChange={(e) => handleSalesChange('revenue', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Units Sold
              </label>
              <input
                type="number"
                value={formData.sales.units_sold || ''}
                onChange={(e) => handleSalesChange('units_sold', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Average Deal Size ($)
              </label>
              <input
                type="number"
                value={formData.sales.average_deal_size || ''}
                onChange={(e) => handleSalesChange('average_deal_size', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Conversion Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.sales.conversion_rate || ''}
                onChange={(e) => handleSalesChange('conversion_rate', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sales Cycle (days)
              </label>
              <input
                type="number"
                value={formData.sales.sales_cycle_days || ''}
                onChange={(e) => handleSalesChange('sales_cycle_days', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-secondary">Investment Data</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Period
              </label>
              <input
                type="text"
                value={formData.investment.period}
                onChange={(e) => handleInvestmentChange('period', e.target.value)}
                placeholder="e.g., Q1 2024"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                AI Tools Cost ($)
              </label>
              <input
                type="number"
                value={formData.investment.ai_tools_cost || ''}
                onChange={(e) => handleInvestmentChange('ai_tools_cost', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Implementation Cost ($)
              </label>
              <input
                type="number"
                value={formData.investment.implementation_cost || ''}
                onChange={(e) => handleInvestmentChange('implementation_cost', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Training Cost ($)
              </label>
              <input
                type="number"
                value={formData.investment.training_cost || ''}
                onChange={(e) => handleInvestmentChange('training_cost', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maintenance Cost ($)
              </label>
              <input
                type="number"
                value={formData.investment.maintenance_cost || ''}
                onChange={(e) => handleInvestmentChange('maintenance_cost', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div className="pt-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Total Investment:</span>
                  <span className="text-white font-semibold">
                    ${(formData.investment.ai_tools_cost + 
                       formData.investment.implementation_cost + 
                       formData.investment.training_cost + 
                       formData.investment.maintenance_cost).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Save size={20} />
              Analyze ROI
            </>
          )}
        </button>
      </div>
    </form>
  );
}