import { ROIReport, Investment, SalesData, OptimizationRecommendation } from '@/types';
import { v4 as uuidv4 } from 'uuid';

class RecommendationEngineClass {
  generateRecommendations(
    roiReport: ROIReport,
    investment: Investment,
    salesData: SalesData[]
  ): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    recommendations.push(...this.analyzeROIPerformance(roiReport, investment));
    recommendations.push(...this.analyzeConversionRates(salesData, investment));
    recommendations.push(...this.analyzeTimeSavings(salesData, investment));
    recommendations.push(...this.analyzeCostEfficiency(roiReport, investment));
    recommendations.push(...this.analyzeRevenueGrowth(salesData, investment));

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private analyzeROIPerformance(roiReport: ROIReport, investment: Investment): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    if (roiReport.roiPercentage < 50) {
      recommendations.push({
        id: uuidv4(),
        title: 'Low ROI Alert: Optimize Tool Usage',
        description: `Your ${investment.toolName} is showing ROI of ${roiReport.roiPercentage.toFixed(1)}%, which is below the 50% threshold. Consider reviewing implementation strategy and team training.`,
        priority: 'high',
        category: 'efficiency',
        potentialImpact: `Potential to increase ROI by 30-50% through better utilization`,
        actionItems: [
          'Conduct team training session on advanced features',
          'Review current workflows and identify bottlenecks',
          'Set up automation rules to maximize efficiency',
          'Benchmark against industry best practices',
        ],
        estimatedROIIncrease: 35,
        implementationEffort: 'medium',
        createdAt: new Date().toISOString(),
      });
    }

    if (roiReport.paybackPeriod > 12) {
      recommendations.push({
        id: uuidv4(),
        title: 'Extended Payback Period: Accelerate Returns',
        description: `Payback period of ${roiReport.paybackPeriod} months is longer than optimal. Focus on quick wins to accelerate ROI.`,
        priority: 'high',
        category: 'revenue_increase',
        potentialImpact: `Reduce payback period by 3-6 months`,
        actionItems: [
          'Identify high-value use cases for immediate implementation',
          'Focus on features with direct revenue impact',
          'Increase adoption rate across sales team',
          'Optimize pricing strategy for better margins',
        ],
        estimatedROIIncrease: 25,
        implementationEffort: 'medium',
        createdAt: new Date().toISOString(),
      });
    }

    if (roiReport.roiPercentage > 100 && roiReport.roiPercentage < 200) {
      recommendations.push({
        id: uuidv4(),
        title: 'Strong ROI: Scale Your Success',
        description: `With ${roiReport.roiPercentage.toFixed(1)}% ROI, you're seeing good returns. Consider scaling to maximize impact.`,
        priority: 'medium',
        category: 'revenue_increase',
        potentialImpact: `Potential to double current returns through scaling`,
        actionItems: [
          'Expand tool usage to additional team members',
          'Explore advanced features and integrations',
          'Document and share best practices across organization',
          'Consider upgrading to premium tier for enhanced capabilities',
        ],
        estimatedROIIncrease: 40,
        implementationEffort: 'low',
        createdAt: new Date().toISOString(),
      });
    }

    return recommendations;
  }

  private analyzeConversionRates(salesData: SalesData[], investment: Investment): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    if (salesData.length === 0) return recommendations;

    const avgConversionRate = salesData.reduce((sum, data) => sum + data.conversionRate, 0) / salesData.length;

    if (avgConversionRate < 15) {
      recommendations.push({
        id: uuidv4(),
        title: 'Low Conversion Rate: Optimize Sales Funnel',
        description: `Average conversion rate of ${avgConversionRate.toFixed(1)}% is below industry standard. Focus on lead qualification and nurturing.`,
        priority: 'high',
        category: 'revenue_increase',
        potentialImpact: `Increase conversion rate by 5-10 percentage points`,
        actionItems: [
          'Implement lead scoring to prioritize high-quality prospects',
          'Set up automated nurture campaigns',
          'Analyze lost deals to identify common objections',
          'Create targeted content for different buyer personas',
        ],
        estimatedROIIncrease: 45,
        implementationEffort: 'high',
        createdAt: new Date().toISOString(),
      });
    }

    if (avgConversionRate >= 15 && avgConversionRate < 25) {
      recommendations.push({
        id: uuidv4(),
        title: 'Good Conversion Rate: Fine-tune for Excellence',
        description: `Your ${avgConversionRate.toFixed(1)}% conversion rate is solid. Small optimizations can push you to top-tier performance.`,
        priority: 'medium',
        category: 'efficiency',
        potentialImpact: `Achieve 25%+ conversion rate through targeted improvements`,
        actionItems: [
          'A/B test email templates and call scripts',
          'Implement real-time lead alerts for hot prospects',
          'Optimize follow-up timing and frequency',
          'Leverage AI insights for personalized outreach',
        ],
        estimatedROIIncrease: 20,
        implementationEffort: 'medium',
        createdAt: new Date().toISOString(),
      });
    }

    const recentData = salesData.slice(-3);
    const recentAvg = recentData.reduce((sum, data) => sum + data.conversionRate, 0) / recentData.length;
    const olderData = salesData.slice(0, -3);
    const olderAvg = olderData.length > 0 
      ? olderData.reduce((sum, data) => sum + data.conversionRate, 0) / olderData.length 
      : recentAvg;

    if (recentAvg < olderAvg * 0.9) {
      recommendations.push({
        id: uuidv4(),
        title: 'Declining Conversion Trend: Immediate Action Required',
        description: `Conversion rate has dropped from ${olderAvg.toFixed(1)}% to ${recentAvg.toFixed(1)}%. Investigate and address root causes.`,
        priority: 'high',
        category: 'efficiency',
        potentialImpact: `Recover lost conversion rate and prevent further decline`,
        actionItems: [
          'Review recent changes to sales process or messaging',
          'Analyze competitor activities and market conditions',
          'Conduct team feedback session to identify challenges',
          'Refresh training on objection handling',
        ],
        estimatedROIIncrease: 30,
        implementationEffort: 'medium',
        createdAt: new Date().toISOString(),
      });
    }

    return recommendations;
  }

  private analyzeTimeSavings(salesData: SalesData[], investment: Investment): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    if (salesData.length === 0) return recommendations;

    const totalTimeSaved = salesData.reduce((sum, data) => sum + data.timeSaved, 0);
    const avgTimeSavedPerMonth = totalTimeSaved / salesData.length;

    if (avgTimeSavedPerMonth < 20) {
      recommendations.push({
        id: uuidv4(),
        title: 'Low Time Savings: Maximize Automation',
        description: `Only ${avgTimeSavedPerMonth.toFixed(1)} hours saved per month. Your ${investment.toolName} has untapped automation potential.`,
        priority: 'medium',
        category: 'automation',
        potentialImpact: `Save an additional 15-25 hours per month through automation`,
        actionItems: [
          'Audit manual tasks that can be automated',
          'Set up workflow automation for repetitive processes',
          'Enable email templates and sequences',
          'Integrate with other tools to eliminate data entry',
        ],
        estimatedROIIncrease: 28,
        implementationEffort: 'medium',
        createdAt: new Date().toISOString(),
      });
    }

    if (avgTimeSavedPerMonth >= 40) {
      recommendations.push({
        id: uuidv4(),
        title: 'Excellent Time Savings: Reinvest in Growth',
        description: `You're saving ${avgTimeSavedPerMonth.toFixed(1)} hours per month. Reinvest this time into high-value activities.`,
        priority: 'low',
        category: 'efficiency',
        potentialImpact: `Convert saved time into additional revenue opportunities`,
        actionItems: [
          'Allocate saved time to strategic account planning',
          'Increase focus on relationship building with key accounts',
          'Invest time in professional development and skill building',
          'Explore new market segments or product lines',
        ],
        estimatedROIIncrease: 15,
        implementationEffort: 'low',
        createdAt: new Date().toISOString(),
      });
    }

    return recommendations;
  }

  private analyzeCostEfficiency(roiReport: ROIReport, investment: Investment): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    const costPerRevenuePoint = roiReport.totalRevenue > 0 
      ? (roiReport.totalInvestment / roiReport.totalRevenue) * 100 
      : 100;

    if (costPerRevenuePoint > 30) {
      recommendations.push({
        id: uuidv4(),
        title: 'High Cost-to-Revenue Ratio: Optimize Spending',
        description: `Your cost represents ${costPerRevenuePoint.toFixed(1)}% of revenue. Look for ways to reduce costs or increase revenue efficiency.`,
        priority: 'high',
        category: 'cost_reduction',
        potentialImpact: `Reduce cost-to-revenue ratio by 10-15 percentage points`,
        actionItems: [
          'Review subscription tier and downgrade if features are unused',
          'Negotiate better pricing with vendor based on usage',
          'Consolidate tools to eliminate redundant subscriptions',
          'Optimize user licenses and remove inactive accounts',
        ],
        estimatedROIIncrease: 22,
        implementationEffort: 'low',
        createdAt: new Date().toISOString(),
      });
    }

    if (investment.category === 'crm' && roiReport.roiPercentage < 80) {
      recommendations.push({
        id: uuidv4(),
        title: 'CRM Optimization: Enhance Data Quality',
        description: `CRM systems typically deliver 100%+ ROI. Focus on data quality and adoption to maximize value.`,
        priority: 'medium',
        category: 'efficiency',
        potentialImpact: `Improve ROI by 25-40% through better CRM utilization`,
        actionItems: [
          'Implement data hygiene protocols and regular cleanup',
          'Set up mandatory field requirements for deal stages',
          'Create custom dashboards for sales team visibility',
          'Integrate with marketing automation for lead tracking',
        ],
        estimatedROIIncrease: 32,
        implementationEffort: 'medium',
        createdAt: new Date().toISOString(),
      });
    }

    return recommendations;
  }

  private analyzeRevenueGrowth(salesData: SalesData[], investment: Investment): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    if (salesData.length < 2) return recommendations;

    const sortedData = [...salesData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const recentRevenue = sortedData.slice(-3).reduce((sum, data) => sum + data.revenue, 0) / 3;
    const olderRevenue = sortedData.slice(0, 3).reduce((sum, data) => sum + data.revenue, 0) / 3;

    const growthRate = olderRevenue > 0 ? ((recentRevenue - olderRevenue) / olderRevenue) * 100 : 0;

    if (growthRate < 10) {
      recommendations.push({
        id: uuidv4(),
        title: 'Stagnant Revenue Growth: Accelerate Sales Velocity',
        description: `Revenue growth of ${growthRate.toFixed(1)}% is below target. Focus on increasing deal size and velocity.`,
        priority: 'high',
        category: 'revenue_increase',
        potentialImpact: `Achieve 20%+ monthly revenue growth`,
        actionItems: [
          'Implement upselling and cross-selling strategies',
          'Shorten sales cycle through better qualification',
          'Expand into new market segments',
          'Launch targeted campaigns for high-value accounts',
        ],
        estimatedROIIncrease: 38,
        implementationEffort: 'high',
        createdAt: new Date().toISOString(),
      });
    }

    if (growthRate > 30) {
      recommendations.push({
        id: uuidv4(),
        title: 'Strong Growth: Maintain Momentum',
        description: `Excellent ${growthRate.toFixed(1)}% revenue growth. Document what's working and scale successful strategies.`,
        priority: 'low',
        category: 'efficiency',
        potentialImpact: `Sustain high growth rate and prevent plateau`,
        actionItems: [
          'Document winning strategies and create playbooks',
          'Share best practices across entire sales team',
          'Invest in tools and resources that support growth',
          'Monitor key metrics to catch early warning signs',
        ],
        estimatedROIIncrease: 12,
        implementationEffort: 'low',
        createdAt: new Date().toISOString(),
      });
    }

    const avgDealsPerMonth = sortedData.reduce((sum, data) => sum + data.dealsClosed, 0) / sortedData.length;
    if (avgDealsPerMonth < 10) {
      recommendations.push({
        id: uuidv4(),
        title: 'Low Deal Volume: Increase Pipeline Activity',
        description: `Average of ${avgDealsPerMonth.toFixed(1)} deals per month. Focus on top-of-funnel activities to increase volume.`,
        priority: 'medium',
        category: 'revenue_increase',
        potentialImpact: `Double deal volume through increased prospecting`,
        actionItems: [
          'Increase daily prospecting activities',
          'Leverage AI tools for lead generation',
          'Expand outreach channels (email, social, phone)',
          'Partner with marketing for lead generation campaigns',
        ],
        estimatedROIIncrease: 35,
        implementationEffort: 'medium',
        createdAt: new Date().toISOString(),
      });
    }

    return recommendations;
  }
}

export const RecommendationEngine = new RecommendationEngineClass();