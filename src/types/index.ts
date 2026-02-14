export interface SalesData {
  id: string;
  period: string;
  revenue: number;
  units_sold: number;
  average_deal_size: number;
  conversion_rate: number;
  sales_cycle_days: number;
  timestamp: string;
}

export interface InvestmentData {
  id: string;
  ai_tools_cost: number;
  implementation_cost: number;
  training_cost: number;
  maintenance_cost: number;
  period: string;
  timestamp: string;
}

export interface ROIMetrics {
  total_roi: number;
  roi_percentage: number;
  payback_period_months: number;
  cost_savings: number;
  revenue_increase: number;
  efficiency_gain_percentage: number;
  time_saved_hours: number;
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact_category: 'cost_reduction' | 'revenue_increase' | 'efficiency';
  estimated_impact: number;
  implementation_difficulty: 'easy' | 'medium' | 'hard';
}

export interface AnalysisResult {
  id: string;
  sales_data: SalesData;
  investment_data: InvestmentData;
  metrics: ROIMetrics;
  recommendations: OptimizationRecommendation[];
  created_at: string;
}

export interface DashboardData {
  current_metrics: ROIMetrics | null;
  recent_analyses: AnalysisResult[];
  recommendations: OptimizationRecommendation[];
}

export interface DataInputForm {
  sales: Omit<SalesData, 'id' | 'timestamp'>;
  investment: Omit<InvestmentData, 'id' | 'timestamp'>;
}

export interface ValidationError {
  field: string;
  message: string;
}