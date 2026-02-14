import { SalesData, InvestmentData, AnalysisResult } from '@/types';

const STORAGE_KEYS = {
  SALES_DATA: 'roi_platform_sales_data',
  INVESTMENT_DATA: 'roi_platform_investment_data',
  ANALYSIS_RESULTS: 'roi_platform_analysis_results',
};

export function saveSalesData(data: SalesData): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = loadSalesData();
    const updated = [...existing.filter(item => item.id !== data.id), data];
    localStorage.setItem(STORAGE_KEYS.SALES_DATA, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving sales data:', error);
  }
}

export function loadSalesData(): SalesData[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SALES_DATA);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading sales data:', error);
    return [];
  }
}

export function saveInvestmentData(data: InvestmentData): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = loadInvestmentData();
    const updated = [...existing.filter(item => item.id !== data.id), data];
    localStorage.setItem(STORAGE_KEYS.INVESTMENT_DATA, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving investment data:', error);
  }
}

export function loadInvestmentData(): InvestmentData[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVESTMENT_DATA);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading investment data:', error);
    return [];
  }
}

export function saveAnalysisResult(result: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = loadAnalysisResults();
    const updated = [result, ...existing].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.ANALYSIS_RESULTS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving analysis result:', error);
  }
}

export function loadAnalysisResults(): AnalysisResult[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYSIS_RESULTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading analysis results:', error);
    return [];
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.SALES_DATA);
    localStorage.removeItem(STORAGE_KEYS.INVESTMENT_DATA);
    localStorage.removeItem(STORAGE_KEYS.ANALYSIS_RESULTS);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}