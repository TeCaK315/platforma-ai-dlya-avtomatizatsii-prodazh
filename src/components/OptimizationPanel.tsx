'use client';

import React, { useState } from 'react';
import { OptimizationRecommendation } from '@/types';
import { 
  TrendingUp, 
  DollarSign, 
  Zap, 
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface OptimizationPanelProps {
  recommendations: OptimizationRecommendation[];
}

export const OptimizationPanel: React.FC<OptimizationPanelProps> = ({ recommendations }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [implementedIds, setImplementedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const markAsImplemented = (id: string) => {
    setImplementedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getImpactIcon = (category: string) => {
    switch (category) {
      case 'cost_reduction':
        return <DollarSign className="w-5 h-5" />;
      case 'revenue_increase':
        return <TrendingUp className="w-5 h-5" />;
      case 'efficiency':
        return <Zap className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (recommendations.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">AI Optimization Recommendations</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p>No recommendations available. Complete an analysis to get AI-powered insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">AI Optimization Recommendations</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Zap className="w-4 h-4 text-accent" />
          <span>{recommendations.length} insights</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedRecommendations.map((rec) => {
          const isExpanded = expandedId === rec.id;
          const isImplemented = implementedIds.has(rec.id);

          return (
            <div
              key={rec.id}
              className={`bg-gray-800 rounded-lg border transition-all duration-300 ${
                isImplemented 
                  ? 'border-green-500/50 bg-green-500/5' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      rec.impact_category === 'cost_reduction' ? 'bg-blue-500/20 text-blue-400' :
                      rec.impact_category === 'revenue_increase' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {getImpactIcon(rec.impact_category)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-semibold">{rec.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                      </div>
                      
                      {isExpanded && (
                        <div className="mt-3 space-y-3">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {rec.description}
                          </p>
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <span className="text-gray-400">Impact: </span>
                              <span className="text-white font-semibold">
                                ${rec.estimated_impact.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Difficulty: </span>
                              <span className={`font-semibold ${getDifficultyColor(rec.implementation_difficulty)}`}>
                                {rec.implementation_difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isImplemented && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    <button
                      onClick={() => toggleExpand(rec.id)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-700 flex gap-3">
                    <button
                      onClick={() => markAsImplemented(rec.id)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        isImplemented
                          ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      {isImplemented ? 'Mark as Pending' : 'Mark as Implemented'}
                    </button>
                    
                    <button
                      className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-red-400">
              {recommendations.filter(r => r.priority === 'high').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">High Priority</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {recommendations.filter(r => r.priority === 'medium').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Medium Priority</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {recommendations.filter(r => r.priority === 'low').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Low Priority</p>
          </div>
        </div>
      </div>
    </div>
  );
};