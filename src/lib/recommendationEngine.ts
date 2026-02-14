import { ROIMetrics, OptimizationRecommendation, SalesData, InvestmentData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function generateRecommendations(
  metrics: ROIMetrics,
  salesData: SalesData,
  investmentData: InvestmentData
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];

  if (metrics.roi_percentage < 50) {
    recommendations.push({
      id: uuidv4(),
      title: 'Optimize AI Tool Selection',
      description: 'Current ROI is below target. Consider switching to more cost-effective AI tools or renegotiating contracts to reduce monthly costs by 20-30%.',
      priority: 'high',
      impact_category: 'cost_reduction',
      estimated_impact: investmentData.ai_tools_cost * 0.25,
      implementation_difficulty: 'medium',
    });
  }

  if (salesData.conversion_rate < 0.15) {
    recommendations.push({
      id: uuidv4(),
      title: 'Enhance Lead Qualification Process',
      description: 'Low conversion rate detected. Implement AI-powered lead scoring to focus on high-quality prospects and improve conversion by 40%.',
      priority: 'high',
      impact_category: 'revenue_increase',
      estimated_impact: salesData.revenue * 0.4,
      implementation_difficulty: 'medium',
    });
  }

  if (salesData.sales_cycle_days > 45) {
    recommendations.push({
      id: uuidv4(),
      title: 'Automate Follow-up Sequences',
      description: 'Sales cycle is longer than industry average. Deploy AI chatbots and automated email sequences to reduce cycle time by 30%.',
      priority: 'high',
      impact_category: 'efficiency',
      estimated_impact: salesData.units_sold * 200,
      implementation_difficulty: 'easy',
    });
  }

  if (investmentData.training_cost > investmentData.ai_tools_cost * 0.5) {
    recommendations.push({
      id: uuidv4(),
      title: 'Implement Self-Service Training',
      description: 'Training costs are high. Create AI-powered onboarding modules and interactive tutorials to reduce training expenses by 50%.',
      priority: 'medium',
      impact_category: 'cost_reduction',
      estimated_impact: investmentData.training_cost * 0.5,
      implementation_difficulty: 'medium',
    });
  }

  if (salesData.average_deal_size < 5000) {
    recommendations.push({
      id: uuidv4(),
      title: 'Upsell and Cross-sell Automation',
      description: 'Average deal size is below potential. Use AI recommendations to identify upsell opportunities and increase deal value by 25%.',
      priority: 'medium',
      impact_category: 'revenue_increase',
      estimated_impact: salesData.average_deal_size * salesData.units_sold * 0.25,
      implementation_difficulty: 'easy',
    });
  }

  if (metrics.efficiency_gain_percentage < 30) {
    recommendations.push({
      id: uuidv4(),
      title: 'Expand AI Automation Coverage',
      description: 'Efficiency gains are modest. Extend AI automation to proposal generation, contract management, and customer onboarding.',
      priority: 'medium',
      impact_category: 'efficiency',
      estimated_impact: investmentData.ai_tools_cost * 0.6,
      implementation_difficulty: 'hard',
    });
  }

  if (investmentData.maintenance_cost > investmentData.ai_tools_cost * 0.3) {
    recommendations.push({
      id: uuidv4(),
      title: 'Consolidate AI Tool Stack',
      description: 'Maintenance costs are high relative to tool costs. Consolidate to fewer, more integrated platforms to reduce overhead by 35%.',
      priority: 'low',
      impact_category: 'cost_reduction',
      estimated_impact: investmentData.maintenance_cost * 0.35,
      implementation_difficulty: 'hard',
    });
  }

  if (salesData.units_sold < 50) {
    recommendations.push({
      id: uuidv4(),
      title: 'Scale Outreach with AI SDRs',
      description: 'Sales volume is low. Deploy AI-powered Sales Development Representatives to increase outreach capacity by 300%.',
      priority: 'high',
      impact_category: 'revenue_increase',
      estimated_impact: salesData.revenue * 2,
      implementation_difficulty: 'medium',
    });
  }

  return prioritizeRecommendations(recommendations);
}

export function prioritizeRecommendations(
  recommendations: OptimizationRecommendation[]
): OptimizationRecommendation[] {
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const difficultyWeight = { easy: 3, medium: 2, hard: 1 };

  return recommendations.sort((a, b) => {
    const scoreA =
      priorityWeight[a.priority] * 2 +
      difficultyWeight[a.implementation_difficulty] +
      a.estimated_impact / 1000;
    const scoreB =
      priorityWeight[b.priority] * 2 +
      difficultyWeight[b.implementation_difficulty] +
      b.estimated_impact / 1000;

    return scoreB - scoreA;
  });
}