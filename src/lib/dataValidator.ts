import { SalesData, InvestmentData, ValidationError } from '@/types';

export function validateSalesData(
  data: Omit<SalesData, 'id' | 'timestamp'>
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.period || data.period.trim() === '') {
    errors.push({
      field: 'period',
      message: 'Period is required',
    });
  }

  if (data.revenue === undefined || data.revenue === null) {
    errors.push({
      field: 'revenue',
      message: 'Revenue is required',
    });
  } else if (data.revenue < 0) {
    errors.push({
      field: 'revenue',
      message: 'Revenue must be a positive number',
    });
  }

  if (data.units_sold === undefined || data.units_sold === null) {
    errors.push({
      field: 'units_sold',
      message: 'Units sold is required',
    });
  } else if (data.units_sold < 0) {
    errors.push({
      field: 'units_sold',
      message: 'Units sold must be a positive number',
    });
  } else if (!Number.isInteger(data.units_sold)) {
    errors.push({
      field: 'units_sold',
      message: 'Units sold must be a whole number',
    });
  }

  if (data.average_deal_size === undefined || data.average_deal_size === null) {
    errors.push({
      field: 'average_deal_size',
      message: 'Average deal size is required',
    });
  } else if (data.average_deal_size < 0) {
    errors.push({
      field: 'average_deal_size',
      message: 'Average deal size must be a positive number',
    });
  }

  if (data.conversion_rate === undefined || data.conversion_rate === null) {
    errors.push({
      field: 'conversion_rate',
      message: 'Conversion rate is required',
    });
  } else if (data.conversion_rate < 0 || data.conversion_rate > 1) {
    errors.push({
      field: 'conversion_rate',
      message: 'Conversion rate must be between 0 and 1',
    });
  }

  if (data.sales_cycle_days === undefined || data.sales_cycle_days === null) {
    errors.push({
      field: 'sales_cycle_days',
      message: 'Sales cycle days is required',
    });
  } else if (data.sales_cycle_days < 0) {
    errors.push({
      field: 'sales_cycle_days',
      message: 'Sales cycle days must be a positive number',
    });
  } else if (!Number.isInteger(data.sales_cycle_days)) {
    errors.push({
      field: 'sales_cycle_days',
      message: 'Sales cycle days must be a whole number',
    });
  }

  return errors;
}

export function validateInvestmentData(
  data: Omit<InvestmentData, 'id' | 'timestamp'>
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.period || data.period.trim() === '') {
    errors.push({
      field: 'period',
      message: 'Period is required',
    });
  }

  if (data.ai_tools_cost === undefined || data.ai_tools_cost === null) {
    errors.push({
      field: 'ai_tools_cost',
      message: 'AI tools cost is required',
    });
  } else if (data.ai_tools_cost < 0) {
    errors.push({
      field: 'ai_tools_cost',
      message: 'AI tools cost must be a positive number',
    });
  }

  if (data.implementation_cost === undefined || data.implementation_cost === null) {
    errors.push({
      field: 'implementation_cost',
      message: 'Implementation cost is required',
    });
  } else if (data.implementation_cost < 0) {
    errors.push({
      field: 'implementation_cost',
      message: 'Implementation cost must be a positive number',
    });
  }

  if (data.training_cost === undefined || data.training_cost === null) {
    errors.push({
      field: 'training_cost',
      message: 'Training cost is required',
    });
  } else if (data.training_cost < 0) {
    errors.push({
      field: 'training_cost',
      message: 'Training cost must be a positive number',
    });
  }

  if (data.maintenance_cost === undefined || data.maintenance_cost === null) {
    errors.push({
      field: 'maintenance_cost',
      message: 'Maintenance cost is required',
    });
  } else if (data.maintenance_cost < 0) {
    errors.push({
      field: 'maintenance_cost',
      message: 'Maintenance cost must be a positive number',
    });
  }

  const totalCost =
    (data.ai_tools_cost || 0) +
    (data.implementation_cost || 0) +
    (data.training_cost || 0) +
    (data.maintenance_cost || 0);

  if (totalCost === 0) {
    errors.push({
      field: 'total',
      message: 'Total investment must be greater than zero',
    });
  }

  return errors;
}