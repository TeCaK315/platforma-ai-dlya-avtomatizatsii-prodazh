'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Clock, Zap, BarChart3, AlertCircle } from 'lucide-react';
import { DataInputForm } from '@/components/DataInputForm';
import { ROIMetricsCard } from '@/components/ROIMetricsCard';
import type { DashboardData, AnalysisResult, ROIMetrics } from '@/types';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    current_metrics: null,
    recent_analyses: [],
    recommendations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showInputForm, setShowInputForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const historyResponse = await fetch('/api/history');
      if (!historyResponse.ok) {
        throw new Error('Failed to load history');
      }
      const historyData = await historyResponse.json();

      const recommendationsResponse = await fetch('/api/recommendations');
      if (!recommendationsResponse.ok) {
        throw new Error('Failed to load recommendations');
      }
      const recommendationsData = await recommendationsResponse.json();

      const latestAnalysis = historyData.analyses && historyData.analyses.length > 0 
        ? historyData.analyses[0] 
        : null;

      setDashboardData({
        current_metrics: latestAnalysis ? latestAnalysis.metrics : null,
        recent_analyses: historyData.analyses || [],
        recommendations: recommendationsData.recommendations || []
      });

      if (!latestAnalysis) {
        setShowInputForm(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      setShowInputForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysisComplete = () => {
    setShowInputForm(false);
    loadDashboardData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Sales ROI Analytics
            </h1>
            <button
              onClick={() => setShowInputForm(!showInputForm)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {showInputForm ? 'Hide Form' : 'New Analysis'}
            </button>
          </div>
          <p className="text-gray-400">Track and optimize your AI-powered sales performance</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {showInputForm && (
          <div className="mb-8">
            <DataInputForm onAnalysisComplete={handleAnalysisComplete} />
          </div>
        )}

        {dashboardData.current_metrics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ROIMetricsCard
                title="Total ROI"
                value={`$${dashboardData.current_metrics.total_roi.toLocaleString()}`}
                percentage={dashboardData.current_metrics.roi_percentage}
                icon={<DollarSign size={24} />}
                trend="up"
              />
              <ROIMetricsCard
                title="ROI Percentage"
                value={`${dashboardData.current_metrics.roi_percentage.toFixed(1)}%`}
                percentage={dashboardData.current_metrics.roi_percentage}
                icon={<TrendingUp size={24} />}
                trend="up"
              />
              <ROIMetricsCard
                title="Payback Period"
                value={`${dashboardData.current_metrics.payback_period_months.toFixed(1)} mo`}
                percentage={-dashboardData.current_metrics.payback_period_months * 2}
                icon={<Clock size={24} />}
                trend="down"
              />
              <ROIMetricsCard
                title="Efficiency Gain"
                value={`${dashboardData.current_metrics.efficiency_gain_percentage.toFixed(1)}%`}
                percentage={dashboardData.current_metrics.efficiency_gain_percentage}
                icon={<Zap size={24} />}
                trend="up"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={24} className="text-primary" />
                  Financial Impact
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Cost Savings</span>
                      <span className="text-secondary font-semibold">
                        ${dashboardData.current_metrics.cost_savings.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((dashboardData.current_metrics.cost_savings / dashboardData.current_metrics.total_roi) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Revenue Increase</span>
                      <span className="text-accent font-semibold">
                        ${dashboardData.current_metrics.revenue_increase.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((dashboardData.current_metrics.revenue_increase / dashboardData.current_metrics.total_roi) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Time Saved</span>
                      <span className="text-primary font-semibold">
                        {dashboardData.current_metrics.time_saved_hours.toLocaleString()} hours
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((dashboardData.current_metrics.time_saved_hours / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Optimization Recommendations</h3>
                {dashboardData.recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.recommendations.slice(0, 3).map((rec) => (
                      <div
                        key={rec.id}
                        className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-primary transition-colors duration-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white">{rec.title}</h4>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              rec.priority === 'high'
                                ? 'bg-red-900/30 text-red-300'
                                : rec.priority === 'medium'
                                ? 'bg-yellow-900/30 text-yellow-300'
                                : 'bg-blue-900/30 text-blue-300'
                            }`}
                          >
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{rec.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            Impact: ${rec.estimated_impact.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            Difficulty: {rec.implementation_difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No recommendations available yet
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Recent Analyses</h3>
              {dashboardData.recent_analyses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Period</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">ROI</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">ROI %</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">Payback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recent_analyses.slice(0, 5).map((analysis) => (
                        <tr
                          key={analysis.id}
                          className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-gray-300">
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {analysis.sales_data.period}
                          </td>
                          <td className="py-3 px-4 text-right text-secondary font-semibold">
                            ${analysis.metrics.total_roi.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-primary font-semibold">
                            {analysis.metrics.roi_percentage.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-right text-gray-300">
                            {analysis.metrics.payback_period_months.toFixed(1)} mo
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No analyses yet</p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-gray-900 rounded-lg p-12 text-center shadow-xl">
            <BarChart3 size={64} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Data Available</h3>
            <p className="text-gray-400 mb-6">
              Start by creating your first ROI analysis to see insights
            </p>
            <button
              onClick={() => setShowInputForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Create First Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}