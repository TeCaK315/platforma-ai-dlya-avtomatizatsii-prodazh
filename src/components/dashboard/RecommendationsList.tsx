'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Lightbulb, ChevronDown, ChevronUp, AlertCircle, TrendingUp, DollarSign, Zap } from 'lucide-react';
import type { OptimizationRecommendation } from '@/types';

interface RecommendationsListProps {
  recommendations: OptimizationRecommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cost_reduction':
        return <DollarSign className="w-5 h-5" />;
      case 'revenue_increase':
        return <TrendingUp className="w-5 h-5" />;
      case 'efficiency':
        return <Zap className="w-5 h-5" />;
      case 'automation':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        AI Recommendations
      </h2>

      {recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Lightbulb className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg">No recommendations yet</p>
          <p className="text-sm">Add more data to get AI-powered insights</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-all duration-300 border border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-2 rounded-lg">
                    {getCategoryIcon(rec.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{rec.title}</h3>
                    <p className="text-gray-400 text-sm">{rec.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`${getPriorityColor(rec.priority)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                    {rec.priority.toUpperCase()}
                  </span>
                  <button
                    onClick={() => toggleExpand(rec.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {expandedIds.has(rec.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300">
                    +{rec.estimatedROIIncrease}% ROI
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <span className={getEffortColor(rec.implementationEffort)}>
                    {rec.implementationEffort} effort
                  </span>
                </div>
              </div>

              {expandedIds.has(rec.id) && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Potential Impact:</h4>
                    <p className="text-gray-400 text-sm">{rec.potentialImpact}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Action Items:</h4>
                    <ul className="space-y-2">
                      {rec.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-400 text-sm">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mt-4">
                    Implement Recommendation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}