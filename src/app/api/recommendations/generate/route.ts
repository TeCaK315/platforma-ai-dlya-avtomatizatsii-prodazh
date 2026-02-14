import { NextRequest, NextResponse } from 'next/server';
import { OptimizationRecommendation, GenerateRecommendationsRequest, APIResponse } from '@/types';
import { RecommendationEngine } from '@/lib/recommendation-engine';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRecommendationsRequest = await request.json();
    const { roiReport, investments, salesData } = body;

    if (!roiReport) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'ROI report is required',
      }, { status: 400 });
    }

    if (!investments || !Array.isArray(investments)) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Investments array is required',
      }, { status: 400 });
    }

    if (!salesData || !Array.isArray(salesData)) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Sales data array is required',
      }, { status: 400 });
    }

    const recommendations: OptimizationRecommendation[] = RecommendationEngine.generateRecommendations(
      roiReport,
      investments,
      salesData
    );

    const sortedRecommendations = recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.estimatedROIIncrease - a.estimatedROIIncrease;
    });

    return NextResponse.json<APIResponse<OptimizationRecommendation[]>>({
      success: true,
      data: sortedRecommendations,
      message: `Generated ${sortedRecommendations.length} optimization recommendation(s)`,
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate recommendations',
    }, { status: 500 });
  }
}