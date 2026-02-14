import { NextRequest, NextResponse } from 'next/server';
import { loadAnalysisResults } from '@/lib/storage';
import { prioritizeRecommendations } from '@/lib/recommendationEngine';
import type { OptimizationRecommendation } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const analyses = loadAnalysisResults();

    if (analyses.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          recommendations: [],
          message: 'No analysis results found. Please run an ROI analysis first.'
        }
      });
    }

    const latestAnalysis = analyses.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    const allRecommendations: OptimizationRecommendation[] = latestAnalysis.recommendations;

    const prioritizedRecommendations = prioritizeRecommendations(allRecommendations);

    const topRecommendations = prioritizedRecommendations.slice(0, 10);

    const recommendationsByCategory = {
      cost_reduction: topRecommendations.filter(r => r.impact_category === 'cost_reduction'),
      revenue_increase: topRecommendations.filter(r => r.impact_category === 'revenue_increase'),
      efficiency: topRecommendations.filter(r => r.impact_category === 'efficiency')
    };

    return NextResponse.json({
      success: true,
      data: {
        recommendations: topRecommendations,
        by_category: recommendationsByCategory,
        analysis_id: latestAnalysis.id,
        analysis_date: latestAnalysis.created_at,
        total_count: allRecommendations.length
      }
    });

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching recommendations' },
      { status: 500 }
    );
  }
}