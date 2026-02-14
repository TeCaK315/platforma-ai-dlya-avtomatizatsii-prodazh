'use client';

import React, { useState, useEffect } from 'react';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { InvestmentForm } from '@/components/dashboard/InvestmentForm';
import { SalesDataForm } from '@/components/dashboard/SalesDataForm';
import { ROIChart } from '@/components/dashboard/ROIChart';
import { RecommendationsList } from '@/components/dashboard/RecommendationsList';
import { InvestmentTable } from '@/components/dashboard/InvestmentTable';
import { BarChart3, Loader2 } from 'lucide-react';
import type { Investment, SalesData, MetricCard, ChartDataPoint, OptimizationRecommendation } from '@/types';

export default function DashboardPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (investments.length > 0 && salesData.length > 0) {
      calculateMetrics();
      generateChartData();
    }
  }, [investments, salesData]);

  const loadData = () => {
    try {
      const storedInvestments = localStorage.getItem('investments');
      const storedSalesData = localStorage.getItem('salesData');
      const storedRecommendations = localStorage.getItem('recommendations');

      if (storedInvestments) {
        setInvestments(JSON.parse(storedInvestments));
      }
      if (storedSalesData) {
        setSalesData(JSON.parse(storedSalesData));
      }
      if (storedRecommendations) {
        setRecommendations(JSON.parse(storedRecommendations));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveInvestments = (newInvestments: Investment[]) => {
    localStorage.setItem('investments', JSON.stringify(newInvestments));
    setInvestments(newInvestments);
  };

  const saveSalesData = (newSalesData: SalesData[]) => {
    localStorage.setItem('salesData', JSON.stringify(newSalesData));
    setSalesData(newSalesData);
  };

  const saveRecommendations = (newRecommendations: OptimizationRecommendation[]) => {
    localStorage.setItem('recommendations', JSON.stringify(newRecommendations));
    setRecommendations(newRecommendations);
  };

  const handleAddInvestment = async (investment: Omit<Investment, 'id' | 'createdAt'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveInvestments([...investments, newInvestment]);
  };

  const handleAddSalesData = async (data: Omit<SalesData, 'id' | 'createdAt'>) => {
    const newSalesData: SalesData = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveSalesData([...salesData, newSalesData]);
  };

  const handleDeleteInvestment = (id: string) => {
    saveInvestments(investments.filter(inv => inv.id !== id));
    saveSalesData(salesData.filter(sd => sd.investmentId !== id));
  };

  const handleEditInvestment = (investment: Investment) => {
    const updatedInvestments = investments.map(inv =>
      inv.id === investment.id ? investment : inv
    );
    saveInvestments(updatedInvestments);
  };

  const calculateMetrics = () => {
    const totalInvestment = investments.reduce((sum, inv) => sum + inv.cost, 0);
    const totalRevenue = salesData.reduce((sum, sd) => sum + sd.revenue, 0);
    const netProfit = totalRevenue - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? ((netProfit / totalInvestment) * 100) : 0;

    const monthsSinceStart = investments.length > 0
      ? Math.max(1, Math.ceil((Date.now() - new Date(investments[0].implementationDate).getTime()) / (1000 * 60 * 60 * 24 * 30)))
      : 1;
    const paybackPeriod = roiPercentage > 0 ? (totalInvestment / (totalRevenue / monthsSinceStart)) : 0;

    const newMetrics: MetricCard[] = [
      {
        title: 'Total ROI',
        value: `${roiPercentage.toFixed(1)}%`,
        change: 12.5,
        trend: roiPercentage > 0 ? 'up' : 'down',
        icon: 'percent',
      },
      {
        title: 'Net Profit',
        value: `$${(netProfit / 1000).toFixed(1)}K`,
        change: 8.3,
        trend: netProfit > 0 ? 'up' : 'down',
        icon: 'dollar',
      },
      {
        title: 'Payback Period',
        value: `${paybackPeriod.toFixed(1)} mo`,
        change: -5.2,
        trend: 'up',
        icon: 'calendar',
      },
      {
        title: 'Active Tools',
        value: investments.filter(inv => inv.status === 'active').length,
        change: 15.0,
        trend: 'up',
        icon: 'target',
      },
    ];

    setMetrics(newMetrics);
  };

  const generateChartData = () => {
    const dataByMonth = new Map<string, { revenue: number; cost: number }>();

    salesData.forEach(sd => {
      const date = new Date(sd.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existing = dataByMonth.get(monthKey) || { revenue: 0, cost: 0 };
      dataByMonth.set(monthKey, {
        revenue: existing.revenue + sd.revenue,
        cost: existing.cost,
      });
    });

    investments.forEach(inv => {
      const date = new Date(inv.implementationDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existing = dataByMonth.get(monthKey) || { revenue: 0, cost: 0 };
      dataByMonth.set(monthKey, {
        revenue: existing.revenue,
        cost: existing.cost + inv.cost,
      });
    });

    const sortedData = Array.from(dataByMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => {
        const roi = data.cost > 0 ? ((data.revenue - data.cost) / data.cost) * 100 : 0;
        return {
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          roi: Math.round(roi),
          revenue: Math.round(data.revenue),
          cost: Math.round(data.cost),
        };
      });

    setChartData(sortedData);
  };

  const handleAnalyzeROI = async () => {
    if (investments.length === 0 || salesData.length === 0) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const totalInvestment = investments.reduce((sum, inv) => sum + inv.cost, 0);
      const totalRevenue = salesData.reduce((sum, sd) => sum + sd.revenue, 0);
      const netProfit = totalRevenue - totalInvestment;
      const roiPercentage = totalInvestment > 0 ? ((netProfit / totalInvestment) * 100) : 0;

      const newRecommendations: OptimizationRecommendation[] = [];

      if (roiPercentage < 50) {
        newRecommendations.push({
          id: Date.now().toString(),
          title: 'Optimize Tool Usage',
          description: 'Your current ROI is below optimal levels. Consider reviewing tool utilization and training.',
          priority: 'high',
          category: 'efficiency',
          potentialImpact: 'Increase ROI by 15-25% through better tool adoption',
          actionItems: [
            'Conduct team training sessions on existing tools',
            'Review and eliminate underutilized features',
            'Set up automated workflows to maximize efficiency',
          ],
          estimatedROIIncrease: 20,
          implementationEffort: 'medium',
          createdAt: new Date().toISOString(),
        });
      }

      if (investments.length > 3) {
        newRecommendations.push({
          id: (Date.now() + 1).toString(),
          title: 'Consolidate Tools',
          description: 'Multiple tools may have overlapping features. Consider consolidation to reduce costs.',
          priority: 'medium',
          category: 'cost_reduction',
          potentialImpact: 'Reduce costs by 20-30% while maintaining functionality',
          actionItems: [
            'Audit all tool features and identify overlaps',
            'Research all-in-one platforms',
            'Plan migration strategy for consolidated solution',
          ],
          estimatedROIIncrease: 25,
          implementationEffort: 'high',
          createdAt: new Date().toISOString(),
        });
      }

      const avgConversionRate = salesData.reduce((sum, sd) => sum + sd.conversionRate, 0) / salesData.length;
      if (avgConversionRate < 20) {
        newRecommendations.push({
          id: (Date.now() + 2).toString(),
          title: 'Improve Conversion Rates',
          description: 'Your conversion rates are below industry average. Focus on lead quality and nurturing.',
          priority: 'high',
          category: 'revenue_increase',
          potentialImpact: 'Increase revenue by 30-40% through better conversion',
          actionItems: [
            'Implement lead scoring system',
            'Create targeted nurture campaigns',
            'A/B test sales messaging and outreach',
          ],
          estimatedROIIncrease: 35,
          implementationEffort: 'medium',
          createdAt: new Date().toISOString(),
        });
      }

      saveRecommendations(newRecommendations);
    } catch (error) {
      console.error('Failed to analyze ROI:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Sales Automation ROI Dashboard
          </h1>
          <p className="text-gray-400">Track and optimize your AI-powered sales investments</p>
        </header>

        <div className="mb-8">
          <MetricsGrid metrics={metrics} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <InvestmentForm onSubmit={handleAddInvestment} />
          <SalesDataForm investments={investments} onSubmit={handleAddSalesData} />
        </div>

        <div className="mb-8">
          <ROIChart data={chartData} chartType="line" />
        </div>

        <div className="mb-8">
          <InvestmentTable
            investments={investments}
            onDelete={handleDeleteInvestment}
            onEdit={handleEditInvestment}
          />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
            <button
              onClick={handleAnalyzeROI}
              disabled={isAnalyzing || investments.length === 0 || salesData.length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  Generate Recommendations
                </>
              )}
            </button>
          </div>
          <RecommendationsList recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
}