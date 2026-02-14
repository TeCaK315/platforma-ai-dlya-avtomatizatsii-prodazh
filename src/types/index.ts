export interface Investment {
  id: string;
  toolName: string;
  cost: number;
  implementationDate: string;
  expectedBenefits: string;
  category: 'crm' | 'email' | 'analytics' | 'chatbot' | 'other';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface SalesData {
  id: string;
  investmentId: string;
  date: string;
  revenue: number;
  dealsClosed: number;
  timeSaved: number;
  conversionRate: number;
  createdAt: string;
}

export interface ROIReport {
  investmentId: string;
  totalInvestment: number;
  totalRevenue: number;
  netProfit: number;
  roiPercentage: number;
  paybackPeriod: number;
  monthlyROI: ChartDataPoint[];
  generatedAt: string;
}

export interface ChartDataPoint {
  month: string;
  roi: number;
  revenue: number;
  cost: number;
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'cost_reduction' | 'revenue_increase' | 'efficiency' | 'automation';
  potentialImpact: string;
  actionItems: string[];
  estimatedROIIncrease: number;
  implementationEffort: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnalyzeROIRequest {
  investments: Investment[];
  salesData: SalesData[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface GenerateRecommendationsRequest {
  roiReport: ROIReport;
  investments: Investment[];
  salesData: SalesData[];
}