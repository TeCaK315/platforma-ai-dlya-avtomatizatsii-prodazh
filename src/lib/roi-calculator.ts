import { Investment, SalesData, ROIReport, ChartDataPoint } from '@/types';
import { format, parseISO, differenceInMonths, startOfMonth, eachMonthOfInterval } from 'date-fns';

class ROICalculatorClass {
  calculateROI(investment: Investment, salesData: SalesData[]): ROIReport {
    const totalInvestment = investment.cost;
    const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
    const netProfit = totalRevenue - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
    
    const paybackPeriod = this.calculatePaybackPeriod(investment, salesData);
    const monthlyROI = this.calculateMonthlyROI(investment, salesData);

    return {
      investmentId: investment.id,
      totalInvestment,
      totalRevenue,
      netProfit,
      roiPercentage,
      paybackPeriod,
      monthlyROI,
      generatedAt: new Date().toISOString(),
    };
  }

  calculatePaybackPeriod(investment: Investment, salesData: SalesData[]): number {
    if (salesData.length === 0) return 0;

    const sortedData = [...salesData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulativeRevenue = 0;
    const investmentCost = investment.cost;

    for (let i = 0; i < sortedData.length; i++) {
      cumulativeRevenue += sortedData[i].revenue;
      if (cumulativeRevenue >= investmentCost) {
        const implementationDate = parseISO(investment.implementationDate);
        const paybackDate = parseISO(sortedData[i].date);
        return differenceInMonths(paybackDate, implementationDate);
      }
    }

    return 0;
  }

  calculateNetProfit(investment: Investment, salesData: SalesData[]): number {
    const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
    return totalRevenue - investment.cost;
  }

  calculateROIPercentage(investment: Investment, salesData: SalesData[]): number {
    const netProfit = this.calculateNetProfit(investment, salesData);
    return investment.cost > 0 ? (netProfit / investment.cost) * 100 : 0;
  }

  private calculateMonthlyROI(investment: Investment, salesData: SalesData[]): ChartDataPoint[] {
    if (salesData.length === 0) return [];

    const sortedData = [...salesData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const startDate = startOfMonth(parseISO(investment.implementationDate));
    const endDate = startOfMonth(parseISO(sortedData[sortedData.length - 1].date));

    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    const monthlyData: ChartDataPoint[] = months.map(month => {
      const monthStr = format(month, 'yyyy-MM');
      const monthData = sortedData.filter(data => {
        const dataMonth = format(parseISO(data.date), 'yyyy-MM');
        return dataMonth === monthStr;
      });

      const revenue = monthData.reduce((sum, data) => sum + data.revenue, 0);
      const cost = investment.cost / months.length;
      const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;

      return {
        month: format(month, 'MMM yyyy'),
        roi: Math.round(roi * 100) / 100,
        revenue: Math.round(revenue * 100) / 100,
        cost: Math.round(cost * 100) / 100,
      };
    });

    return monthlyData;
  }

  calculateAverageConversionRate(salesData: SalesData[]): number {
    if (salesData.length === 0) return 0;
    const totalConversionRate = salesData.reduce((sum, data) => sum + data.conversionRate, 0);
    return totalConversionRate / salesData.length;
  }

  calculateTotalTimeSaved(salesData: SalesData[]): number {
    return salesData.reduce((sum, data) => sum + data.timeSaved, 0);
  }

  calculateTotalDealsClosed(salesData: SalesData[]): number {
    return salesData.reduce((sum, data) => sum + data.dealsClosed, 0);
  }

  calculateAverageRevenuePerDeal(salesData: SalesData[]): number {
    const totalDeals = this.calculateTotalDealsClosed(salesData);
    const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
    return totalDeals > 0 ? totalRevenue / totalDeals : 0;
  }
}

export const ROICalculator = new ROICalculatorClass();