import { NextRequest, NextResponse } from 'next/server';
import { Investment, SalesData, ROIReport, ChartDataPoint, AnalyzeROIRequest, APIResponse } from '@/types';
import { ROICalculator } from '@/lib/roi-calculator';
import { format, parseISO, differenceInMonths, startOfMonth, eachMonthOfInterval } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeROIRequest = await request.json();
    const { investments, salesData, dateRange } = body;

    if (!investments || !Array.isArray(investments) || investments.length === 0) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Investments array is required and must not be empty',
      }, { status: 400 });
    }

    if (!salesData || !Array.isArray(salesData)) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Sales data array is required',
      }, { status: 400 });
    }

    const reports: ROIReport[] = [];

    for (const investment of investments) {
      const relatedSalesData = salesData.filter(sd => sd.investmentId === investment.id);

      if (relatedSalesData.length === 0) {
        continue;
      }

      const totalInvestment = investment.cost;
      const totalRevenue = relatedSalesData.reduce((sum, sd) => sum + sd.revenue, 0);
      
      const netProfit = ROICalculator.calculateNetProfit(totalRevenue, totalInvestment);
      const roiPercentage = ROICalculator.calculateROIPercentage(netProfit, totalInvestment);
      
      const implementationDate = parseISO(investment.implementationDate);
      const latestSalesDate = relatedSalesData.length > 0 
        ? parseISO(relatedSalesData[relatedSalesData.length - 1].date)
        : new Date();
      
      const monthsElapsed = differenceInMonths(latestSalesDate, implementationDate) || 1;
      const paybackPeriod = ROICalculator.calculatePaybackPeriod(totalInvestment, totalRevenue, monthsElapsed);

      const monthlyROI: ChartDataPoint[] = [];
      
      if (relatedSalesData.length > 0) {
        const sortedSalesData = [...relatedSalesData].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const firstDate = parseISO(sortedSalesData[0].date);
        const lastDate = parseISO(sortedSalesData[sortedSalesData.length - 1].date);
        
        const months = eachMonthOfInterval({ start: startOfMonth(firstDate), end: startOfMonth(lastDate) });

        months.forEach(monthDate => {
          const monthStr = format(monthDate, 'yyyy-MM');
          const monthSales = sortedSalesData.filter(sd => {
            const salesMonth = format(parseISO(sd.date), 'yyyy-MM');
            return salesMonth === monthStr;
          });

          const monthRevenue = monthSales.reduce((sum, sd) => sum + sd.revenue, 0);
          const monthlyCost = totalInvestment / monthsElapsed;
          const monthNetProfit = monthRevenue - monthlyCost;
          const monthROI = monthlyCost > 0 ? (monthNetProfit / monthlyCost) * 100 : 0;

          monthlyROI.push({
            month: format(monthDate, 'MMM yyyy'),
            roi: Math.round(monthROI * 100) / 100,
            revenue: Math.round(monthRevenue * 100) / 100,
            cost: Math.round(monthlyCost * 100) / 100,
          });
        });
      }

      const report: ROIReport = {
        investmentId: investment.id,
        totalInvestment: Math.round(totalInvestment * 100) / 100,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        netProfit: Math.round(netProfit * 100) / 100,
        roiPercentage: Math.round(roiPercentage * 100) / 100,
        paybackPeriod: Math.round(paybackPeriod * 100) / 100,
        monthlyROI,
        generatedAt: new Date().toISOString(),
      };

      reports.push(report);
    }

    if (reports.length === 0) {
      return NextResponse.json<APIResponse<ROIReport[]>>({
        success: true,
        data: [],
        message: 'No sales data available for the provided investments',
      });
    }

    return NextResponse.json<APIResponse<ROIReport[]>>({
      success: true,
      data: reports,
      message: `Successfully analyzed ROI for ${reports.length} investment(s)`,
    });

  } catch (error) {
    console.error('Error analyzing ROI:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze ROI',
    }, { status: 500 });
  }
}