import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';
import type { Investment, APIResponse } from '@/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<APIResponse<Investment>>> {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Investment ID is required'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const { toolName, cost, implementationDate, expectedBenefits, category, status } = body;

    if (!toolName || cost === undefined || !implementationDate || !expectedBenefits || !category || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: toolName, cost, implementationDate, expectedBenefits, category, status'
        },
        { status: 400 }
      );
    }

    if (typeof cost !== 'number' || cost < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cost must be a positive number'
        },
        { status: 400 }
      );
    }

    const validCategories = ['crm', 'email', 'analytics', 'chatbot', 'other'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid category. Must be one of: crm, email, analytics, chatbot, other'
        },
        { status: 400 }
      );
    }

    const validStatuses = ['active', 'inactive', 'pending'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status. Must be one of: active, inactive, pending'
        },
        { status: 400 }
      );
    }

    const storage = new StorageService();
    const investments = storage.getInvestments();
    
    const existingInvestmentIndex = investments.findIndex(inv => inv.id === id);
    
    if (existingInvestmentIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Investment not found'
        },
        { status: 404 }
      );
    }

    const existingInvestment = investments[existingInvestmentIndex];

    const updatedInvestment: Investment = {
      ...existingInvestment,
      toolName,
      cost,
      implementationDate,
      expectedBenefits,
      category,
      status
    };

    investments[existingInvestmentIndex] = updatedInvestment;
    storage.saveInvestments(investments);

    return NextResponse.json(
      {
        success: true,
        data: updatedInvestment,
        message: 'Investment updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating investment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update investment'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<APIResponse<{ id: string }>>> {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Investment ID is required'
        },
        { status: 400 }
      );
    }

    const storage = new StorageService();
    const investments = storage.getInvestments();
    
    const investmentIndex = investments.findIndex(inv => inv.id === id);
    
    if (investmentIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Investment not found'
        },
        { status: 404 }
      );
    }

    investments.splice(investmentIndex, 1);
    storage.saveInvestments(investments);

    const salesData = storage.getSalesData();
    const filteredSalesData = salesData.filter(data => data.investmentId !== id);
    storage.saveSalesData(filteredSalesData);

    return NextResponse.json(
      {
        success: true,
        data: { id },
        message: 'Investment and associated sales data deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting investment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete investment'
      },
      { status: 500 }
    );
  }
}