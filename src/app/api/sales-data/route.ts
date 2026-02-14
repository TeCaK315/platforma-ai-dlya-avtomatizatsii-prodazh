import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';
import type { SalesData, APIResponse } from '@/types';

export async function GET(
  request: NextRequest
): Promise<NextResponse<APIResponse<SalesData[]>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const investmentId = searchParams.get('investmentId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const storage = new StorageService();
    let salesData = storage.getSalesData();

    if (investmentId) {
      salesData = salesData.filter(data => data.investmentId === investmentId);
    }

    if (startDate) {
      const start = new Date(startDate);
      salesData = salesData.filter(data => new Date(data.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      salesData = salesData.filter(data => new Date(data.date) <= end);
    }

    salesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(
      {
        success: true,
        data: salesData,
        message: `Retrieved ${salesData.length} sales data records`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sales data'
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<APIResponse<SalesData>>> {
  try {
    const body = await request.json();
    
    const { investmentId, date, revenue, dealsClosed, timeSaved, conversionRate } = body;

    if (!investmentId || !date || revenue === undefined || dealsClosed === undefined || timeSaved === undefined || conversionRate === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: investmentId, date, revenue, dealsClosed, timeSaved, conversionRate'
        },
        { status: 400 }
      );
    }

    if (typeof revenue !== 'number' || revenue < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Revenue must be a positive number'
        },
        { status: 400 }
      );
    }

    if (typeof dealsClosed !== 'number' || dealsClosed < 0 || !Number.isInteger(dealsClosed)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Deals closed must be a positive integer'
        },
        { status: 400 }
      );
    }

    if (typeof timeSaved !== 'number' || timeSaved < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Time saved must be a positive number'
        },
        { status: 400 }
      );
    }

    if (typeof conversionRate !== 'number' || conversionRate < 0 || conversionRate > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Conversion rate must be a number between 0 and 100'
        },
        { status: 400 }
      );
    }

    const storage = new StorageService();
    const investments = storage.getInvestments();
    
    const investmentExists = investments.some(inv => inv.id === investmentId);
    if (!investmentExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Investment not found'
        },
        { status: 404 }
      );
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid date format'
        },
        { status: 400 }
      );
    }

    const newSalesData: SalesData = {
      id: `sales_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      investmentId,
      date,
      revenue,
      dealsClosed,
      timeSaved,
      conversionRate,
      createdAt: new Date().toISOString()
    };

    const salesData = storage.getSalesData();
    salesData.push(newSalesData);
    storage.saveSalesData(salesData);

    return NextResponse.json(
      {
        success: true,
        data: newSalesData,
        message: 'Sales data added successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding sales data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add sales data'
      },
      { status: 500 }
    );
  }
}