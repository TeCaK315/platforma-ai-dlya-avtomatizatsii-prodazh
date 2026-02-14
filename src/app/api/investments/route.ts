import { NextRequest, NextResponse } from 'next/server';
import { Investment, APIResponse } from '@/types';
import { StorageService } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const investments = StorageService.getInvestments();

    const sortedInvestments = investments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json<APIResponse<Investment[]>>({
      success: true,
      data: sortedInvestments,
      message: `Retrieved ${sortedInvestments.length} investment(s)`,
    });

  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch investments',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.toolName || typeof body.toolName !== 'string' || body.toolName.trim() === '') {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Tool name is required and must be a non-empty string',
      }, { status: 400 });
    }

    if (!body.cost || typeof body.cost !== 'number' || body.cost <= 0) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Cost is required and must be a positive number',
      }, { status: 400 });
    }

    if (!body.implementationDate || typeof body.implementationDate !== 'string') {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Implementation date is required',
      }, { status: 400 });
    }

    if (!body.expectedBenefits || typeof body.expectedBenefits !== 'string') {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Expected benefits are required',
      }, { status: 400 });
    }

    const validCategories = ['crm', 'email', 'analytics', 'chatbot', 'other'];
    if (!body.category || !validCategories.includes(body.category)) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: `Category must be one of: ${validCategories.join(', ')}`,
      }, { status: 400 });
    }

    const validStatuses = ['active', 'inactive', 'pending'];
    const status = body.status && validStatuses.includes(body.status) ? body.status : 'active';

    const newInvestment: Investment = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      toolName: body.toolName.trim(),
      cost: body.cost,
      implementationDate: body.implementationDate,
      expectedBenefits: body.expectedBenefits.trim(),
      category: body.category,
      status,
      createdAt: new Date().toISOString(),
    };

    const savedInvestment = StorageService.addInvestment(newInvestment);

    return NextResponse.json<APIResponse<Investment>>({
      success: true,
      data: savedInvestment,
      message: 'Investment created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating investment:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create investment',
    }, { status: 500 });
  }
}