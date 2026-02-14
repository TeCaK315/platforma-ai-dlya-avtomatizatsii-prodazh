import { NextRequest, NextResponse } from 'next/server';
import { loadAnalysisResults } from '@/lib/storage';
import type { AnalysisResult } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const allAnalyses = loadAnalysisResults();

    const sortedAnalyses = allAnalyses.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const paginatedAnalyses = sortedAnalyses.slice(offset, offset + limit);

    const summary = {
      total_analyses: allAnalyses.length,
      average_roi: allAnalyses.length > 0
        ? allAnalyses.reduce((sum, a) => sum + a.metrics.total_roi, 0) / allAnalyses.length
        : 0,
      average_payback_period: allAnalyses.length > 0
        ? allAnalyses.reduce((sum, a) => sum + a.metrics.payback_period_months, 0) / allAnalyses.length
        : 0,
      total_revenue_increase: allAnalyses.reduce((sum, a) => sum + a.metrics.revenue_increase, 0),
      total_cost_savings: allAnalyses.reduce((sum, a) => sum + a.metrics.cost_savings, 0)
    };

    const historyData = paginatedAnalyses.map((analysis: AnalysisResult) => ({
      id: analysis.id,
      date: analysis.created_at,
      period: analysis.sales_data.period,
      revenue: analysis.sales_data.revenue,
      total_investment: 
        analysis.investment_data.ai_tools_cost +
        analysis.investment_data.implementation_cost +
        analysis.investment_data.training_cost +
        analysis.investment_data.maintenance_cost,
      roi_percentage: analysis.metrics.roi_percentage,
      payback_period: analysis.metrics.payback_period_months,
      cost_savings: analysis.metrics.cost_savings,
      revenue_increase: analysis.metrics.revenue_increase,
      recommendations_count: analysis.recommendations.length,
      high_priority_recommendations: analysis.recommendations.filter(r => r.priority === 'high').length
    }));

    return NextResponse.json({
      success: true,
      data: {
        analyses: historyData,
        summary,
        pagination: {
          total: allAnalyses.length,
          limit,
          offset,
          has_more: offset + limit < allAnalyses.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching analysis history' },
      { status: 500 }
    );
  }
}