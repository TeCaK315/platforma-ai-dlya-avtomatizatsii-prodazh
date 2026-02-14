'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Edit2, Trash2, ArrowUpDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Investment } from '@/types';

interface InvestmentTableProps {
  investments: Investment[];
  onDelete: (id: string) => void;
  onEdit: (investment: Investment) => void;
}

export function InvestmentTable({ investments, onDelete, onEdit }: InvestmentTableProps) {
  const [sortField, setSortField] = useState<keyof Investment>('implementationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Investment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInvestments = [...investments].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const getStatusIcon = (status: Investment['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getCategoryColor = (category: Investment['category']) => {
    const colors = {
      crm: 'bg-blue-500',
      email: 'bg-purple-500',
      analytics: 'bg-green-500',
      chatbot: 'bg-orange-500',
      other: 'bg-gray-500',
    };
    return colors[category];
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">Investment Portfolio</h2>
      
      {investments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="text-lg">No investments yet</p>
          <p className="text-sm">Add your first investment to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                  <button
                    onClick={() => handleSort('toolName')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    Tool Name
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                  <button
                    onClick={() => handleSort('cost')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    Cost
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Category</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                  <button
                    onClick={() => handleSort('implementationDate')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    Date
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedInvestments.map((investment) => (
                <tr
                  key={investment.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{investment.toolName}</p>
                      <p className="text-gray-400 text-sm truncate max-w-xs">
                        {investment.expectedBenefits}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-white font-semibold">
                    ${investment.cost.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`${getCategoryColor(investment.category)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      {investment.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {new Date(investment.implementationDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(investment.status)}
                      <span className="text-gray-300 capitalize">{investment.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(investment)}
                        className="text-blue-500 hover:text-blue-400 transition-colors p-2 hover:bg-gray-700 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(investment.id)}
                        className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-gray-700 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}