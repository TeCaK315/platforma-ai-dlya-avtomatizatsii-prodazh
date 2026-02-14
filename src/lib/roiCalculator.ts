import { SalesData, InvestmentData, ROIMetrics } from '@/types';

export function calculateROI(
  salesData: SalesData,
  investmentData: InvestmentData
): ROIMetrics {
  const totalInvestment =
    investmentData.ai_tools_cost +
    investmentData.implementation_cost +
    investmentData.training_cost +
    investmentData.maintenance_cost;

  const costSavings = calculateCostSavings(salesData, investmentData);
  const revenueIncrease = calculateRevenueIncrease(salesData);
  const totalReturn = costSavings + revenueIncrease;
  const totalROI = totalReturn - totalInvestment;
  const roiPercentage = totalInvestment > 0 ? (totalROI / totalInvestment) * 100 : 0;
  const paybackPeriod = calculatePaybackPeriod(totalInvestment, totalReturn);

  const efficiencyGain = salesData.sales_cycle_days > 0
    ? ((30 - salesData.sales_cycle_days) / 30) * 100
    : 0;

  const timeSaved = salesData.units_sold * (salesData.sales_cycle_days * 0.2);

  return {
    total_roi: Math.round(totalROI * 100) / 100,
    roi_percentage: Math.round(roiPercentage * 100) / 100,
    payback_period_months: Math.round(paybackPeriod * 10) / 10,
    cost_savings: Math.round(costSavings * 100) / 100,
    revenue_increase: Math.round(revenueIncrease * 100) / 100,
    efficiency_gain_percentage: Math.round(efficiencyGain * 100) / 100,
    time_saved_hours: Math.round(timeSaved * 100) / 100,
  };
}

export function calculatePaybackPeriod(
  totalInvestment: number,
  monthlyReturn: number
): number {
  if (monthlyReturn <= 0) return 999;
  return totalInvestment / monthlyReturn;
}

export function calculateCostSavings(
  salesData: SalesData,
  investmentData: InvestmentData
): number {
  const automationSavings = investmentData.ai_tools_cost * 0.3;
  const efficiencySavings = salesData.units_sold * 50;
  const maintenanceReduction = investmentData.maintenance_cost * 0.15;

  return automationSavings + efficiencySavings + maintenanceReduction;
}

export function calculateRevenueIncrease(salesData: SalesData): number {
  const conversionImprovement = salesData.conversion_rate * 0.25;
  const additionalRevenue = salesData.revenue * conversionImprovement;
  const dealSizeIncrease = salesData.average_deal_size * 0.1 * salesData.units_sold;

  return additionalRevenue + dealSizeIncrease;
}