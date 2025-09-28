import { NextRequest, NextResponse } from 'next/server';
import { createContactSubmission, isAirtableConfigured, ContactSubmission } from '@/lib/airtable';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, projectType, budgetRange, message } = body;
    
    if (!name || !email || !projectType || !budgetRange || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, projectType, budgetRange, message' },
        { status: 400 }
      );
    }

    // Check if Airtable is configured
    if (!isAirtableConfigured()) {
      console.warn('Airtable not configured, contact submission not saved');
      return NextResponse.json(
        { 
          success: true, 
          message: 'Contact submission received (Airtable not configured)',
          id: 'mock-id'
        }
      );
    }

    const submission: ContactSubmission = {
      name,
      email,
      company: body.company || '',
      phone: body.phone || '',
      projectType,
      budgetRange,
      message,
      status: 'New',
      source: 'Website',
      assignedTo: ''
    };

    const recordId = await createContactSubmission(submission);
    
    return NextResponse.json({
      success: true,
      message: 'Contact submission created successfully',
      id: recordId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to create contact submission' },
      { status: 500 }
    );
  }
}
