'use client';

import React, { useState } from 'react';
import { AnalysisResult } from '@/types';
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface RecentAnalysesProps {
  analyses: AnalysisResult[];
}

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({ analyses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const itemsPerPage = 5;

  const sortedAnalyses = [...analyses].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalPages = Math.ceil(sortedAnalyses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnalyses = sortedAnalyses.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDetails = (analysis: AnalysisResult) => {
    setSelectedAnalysis(analysis);
  };

  const closeModal = () => {
    setSelectedAnalysis(null);
  };

  if (analyses.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Analyses</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p>No analyses yet. Complete your first analysis to see history.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Analyses</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{analyses.length} total</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Period</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">ROI %</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Savings</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Payback</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAnalyses.map((analysis, index) => (
                <tr
                  key={analysis.id}
                  className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                    index === 0 ? 'bg-gray-800/30' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">
                        {formatDate(analysis.created_at)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-white font-medium">
                      {analysis.sales_data.period}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">
                        {analysis.metrics.roi_percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm text-white font-medium">
                      ${(analysis.metrics.revenue_increase / 1000).toFixed(1)}K
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm text-white font-medium">
                      ${(analysis.metrics.cost_savings / 1000).toFixed(1)}K
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm text-gray-300">
                      {analysis.metrics.payback_period_months.toFixed(1)} mo
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleViewDetails(analysis)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, analyses.length)} of {analyses.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              <span className="text-sm text-gray-300 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Analysis Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Analysis Date</p>
                  <p className="text-white font-semibold">{formatDate(selectedAnalysis.created_at)}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Period</p>
                  <p className="text-white font-semibold">{selectedAnalysis.sales_data.period}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">ROI Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <p className="text-sm text-gray-400">ROI Percentage</p>
                    </div>
                    <p className="text-2xl font-bold text-green-400">
                      {selectedAnalysis.metrics.roi_percentage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-blue-400" />
                      <p className="text-sm text-gray-400">Total ROI</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      ${(selectedAnalysis.metrics.total_roi / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-gray-400">Payback Period</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {selectedAnalysis.metrics.payback_period_months.toFixed(1)} mo
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Revenue Increase</p>
                    <p className="text-xl font-bold text-white">
                      ${selectedAnalysis.metrics.revenue_increase.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Cost Savings</p>
                    <p className="text-xl font-bold text-white">
                      ${selectedAnalysis.metrics.cost_savings.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Efficiency Gain</p>
                    <p className="text-xl font-bold text-white">
                      {selectedAnalysis.metrics.efficiency_gain_percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Sales Data</h4>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Revenue</p>
                    <p className="text-white font-semibold">${selectedAnalysis.sales_data.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Units Sold</p>
                    <p className="text-white font-semibold">{selectedAnalysis.sales_data.units_sold}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Avg Deal Size</p>
                    <p className="text-white font-semibold">${selectedAnalysis.sales_data.average_deal_size.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Conversion Rate</p>
                    <p className="text-white font-semibold">{selectedAnalysis.sales_data.conversion_rate}%</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Recommendations ({selectedAnalysis.recommendations.length})
                </h4>
                <div className="space-y-3">
                  {selectedAnalysis.recommendations.map((rec) => (
                    <div key={rec.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-white font-semibold">{rec.title}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};