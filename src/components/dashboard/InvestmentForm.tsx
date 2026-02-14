'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Plus, Loader2 } from 'lucide-react';
import type { Investment } from '@/types';

interface InvestmentFormProps {
  onSubmit: (investment: Omit<Investment, 'id' | 'createdAt'>) => Promise<void>;
}

export function InvestmentForm({ onSubmit }: InvestmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    toolName: '',
    cost: '',
    implementationDate: '',
    expectedBenefits: '',
    category: 'crm' as Investment['category'],
    status: 'active' as Investment['status'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.toolName.trim()) {
      newErrors.toolName = 'Tool name is required';
    }
    
    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'Cost must be greater than 0';
    }
    
    if (!formData.implementationDate) {
      newErrors.implementationDate = 'Implementation date is required';
    }
    
    if (!formData.expectedBenefits.trim()) {
      newErrors.expectedBenefits = 'Expected benefits are required';
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
        toolName: formData.toolName,
        cost: parseFloat(formData.cost),
        implementationDate: formData.implementationDate,
        expectedBenefits: formData.expectedBenefits,
        category: formData.category,
        status: formData.status,
      });

      setFormData({
        toolName: '',
        cost: '',
        implementationDate: '',
        expectedBenefits: '',
        category: 'crm',
        status: 'active',
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to add investment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-blue-500" />
        Add New Investment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Tool Name
          </label>
          <input
            type="text"
            value={formData.toolName}
            onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="e.g., HubSpot CRM"
          />
          {errors.toolName && <p className="text-red-500 text-sm mt-1">{errors.toolName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="5000"
            />
            {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Implementation Date
            </label>
            <input
              type="date"
              value={formData.implementationDate}
              onChange={(e) => setFormData({ ...formData, implementationDate: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {errors.implementationDate && <p className="text-red-500 text-sm mt-1">{errors.implementationDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Investment['category'] })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="crm">CRM</option>
              <option value="email">Email Automation</option>
              <option value="analytics">Analytics</option>
              <option value="chatbot">Chatbot</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Investment['status'] })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Expected Benefits
          </label>
          <textarea
            value={formData.expectedBenefits}
            onChange={(e) => setFormData({ ...formData, expectedBenefits: e.target.value })}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            rows={3}
            placeholder="Describe the expected benefits..."
          />
          {errors.expectedBenefits && <p className="text-red-500 text-sm mt-1">{errors.expectedBenefits}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Investment
            </>
          )}
        </button>
      </form>
    </Card>
  );
}