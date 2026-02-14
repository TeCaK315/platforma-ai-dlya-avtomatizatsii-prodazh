import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { 
  calculateROI, 
  calculatePaybackPeriod, 
  calculateCostSavings, 
  calculateRevenueIncrease 
} from '@/lib/roiCalculator';
import { generateRecommendations } from '@/lib/recommendationEngine';
import { validateSalesData, validateInvestmentData } from '@/lib/dataValidator';
import { saveAnalysisResult } from '@/lib/storage';
import type { SalesData, InvestmentData, ROIMetrics, AnalysisResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sales, investment } = body;

    if (!sales || !investment) {
      return NextResponse.json(
        { error: 'Missing sales or investment data' },
        { status: 400 }
      );
    }

    const salesValidation = validateSalesData(sales);
    if (!salesValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid sales data', details: salesValidation.errors },
        { status: 400 }
      );
    }

    const investmentValidation = validateInvestmentData(investment);
    if (!investmentValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid investment data', details: investmentValidation.errors },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    
    const salesData: SalesData = {
      id: uuidv4(),
      ...sales,
      timestamp
    };

    const investmentData: InvestmentData = {
      id: uuidv4(),
      ...investment,
      timestamp
    };

    const totalInvestment = 
      investmentData.ai_tools_cost +
      investmentData.implementation_cost +
      investmentData.training_cost +
      investmentData.maintenance_cost;

    const roi = calculateROI(salesData.revenue, totalInvestment);
    const paybackPeriod = calculatePaybackPeriod(totalInvestment, salesData.revenue);
    const costSavings = calculateCostSavings(totalInvestment, salesData.revenue);
    const revenueIncrease = calculateRevenueIncrease(salesData.revenue, totalInvestment);

    const efficiencyGain = salesData.conversion_rate > 0 
      ? Math.min(((salesData.conversion_rate - 0.15) / 0.15) * 100, 100)
      : 0;

    const timeSaved = salesData.sales_cycle_days > 0
      ? Math.max((30 - salesData.sales_cycle_days) * 8, 0)
      : 0;

    const metrics: ROIMetrics = {
      total_roi: roi,
      roi_percentage: (roi / totalInvestment) * 100,
      payback_period_months: paybackPeriod,
      cost_savings: costSavings,
      revenue_increase: revenueIncrease,
      efficiency_gain_percentage: efficiencyGain,
      time_saved_hours: timeSaved
    };

    const recommendations = generateRecommendations(metrics, salesData, investmentData);

    const analysisResult: AnalysisResult = {
      id: uuidv4(),
      sales_data: salesData,
      investment_data: investmentData,
      metrics,
      recommendations,
      created_at: timestamp
    };

    saveAnalysisResult(analysisResult);

    return NextResponse.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('Error analyzing ROI:', error);
    return NextResponse.json(
      { error: 'Internal server error during ROI analysis' },
      { status: 500 }
    );
  }
}