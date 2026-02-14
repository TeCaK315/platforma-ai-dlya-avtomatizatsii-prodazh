import { Investment, SalesData, ROIReport, OptimizationRecommendation } from '@/types';

const STORAGE_KEYS = {
  INVESTMENTS: 'ai_sales_investments',
  SALES_DATA: 'ai_sales_data',
  ROI_REPORTS: 'ai_sales_roi_reports',
  RECOMMENDATIONS: 'ai_sales_recommendations',
} as const;

class StorageServiceClass {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private getItem<T>(key: string): T[] {
    if (!this.isClient()) return [];
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  private setItem<T>(key: string, value: T[]): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  getInvestments(): Investment[] {
    return this.getItem<Investment>(STORAGE_KEYS.INVESTMENTS);
  }

  saveInvestments(investments: Investment[]): void {
    this.setItem(STORAGE_KEYS.INVESTMENTS, investments);
  }

  addInvestment(investment: Investment): void {
    const investments = this.getInvestments();
    investments.push(investment);
    this.saveInvestments(investments);
  }

  updateInvestment(id: string, updates: Partial<Investment>): void {
    const investments = this.getInvestments();
    const index = investments.findIndex(inv => inv.id === id);
    if (index !== -1) {
      investments[index] = { ...investments[index], ...updates };
      this.saveInvestments(investments);
    }
  }

  deleteInvestment(id: string): void {
    const investments = this.getInvestments();
    const filtered = investments.filter(inv => inv.id !== id);
    this.saveInvestments(filtered);
  }

  getInvestmentById(id: string): Investment | undefined {
    const investments = this.getInvestments();
    return investments.find(inv => inv.id === id);
  }

  getSalesData(): SalesData[] {
    return this.getItem<SalesData>(STORAGE_KEYS.SALES_DATA);
  }

  saveSalesData(salesData: SalesData[]): void {
    this.setItem(STORAGE_KEYS.SALES_DATA, salesData);
  }

  addSalesData(data: SalesData): void {
    const salesData = this.getSalesData();
    salesData.push(data);
    this.saveSalesData(salesData);
  }

  getSalesDataByInvestmentId(investmentId: string): SalesData[] {
    const salesData = this.getSalesData();
    return salesData.filter(data => data.investmentId === investmentId);
  }

  deleteSalesDataByInvestmentId(investmentId: string): void {
    const salesData = this.getSalesData();
    const filtered = salesData.filter(data => data.investmentId !== investmentId);
    this.saveSalesData(filtered);
  }

  getROIReports(): ROIReport[] {
    return this.getItem<ROIReport>(STORAGE_KEYS.ROI_REPORTS);
  }

  saveROIReports(reports: ROIReport[]): void {
    this.setItem(STORAGE_KEYS.ROI_REPORTS, reports);
  }

  addROIReport(report: ROIReport): void {
    const reports = this.getROIReports();
    const existingIndex = reports.findIndex(r => r.investmentId === report.investmentId);
    if (existingIndex !== -1) {
      reports[existingIndex] = report;
    } else {
      reports.push(report);
    }
    this.saveROIReports(reports);
  }

  getROIReportByInvestmentId(investmentId: string): ROIReport | undefined {
    const reports = this.getROIReports();
    return reports.find(report => report.investmentId === investmentId);
  }

  getRecommendations(): OptimizationRecommendation[] {
    return this.getItem<OptimizationRecommendation>(STORAGE_KEYS.RECOMMENDATIONS);
  }

  saveRecommendations(recommendations: OptimizationRecommendation[]): void {
    this.setItem(STORAGE_KEYS.RECOMMENDATIONS, recommendations);
  }

  addRecommendations(recommendations: OptimizationRecommendation[]): void {
    const existing = this.getRecommendations();
    const combined = [...existing, ...recommendations];
    this.saveRecommendations(combined);
  }

  clearAllData(): void {
    if (!this.isClient()) return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const StorageService = new StorageServiceClass();