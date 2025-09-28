import { NextRequest, NextResponse } from 'next/server';
import { getProjects, isAirtableConfigured } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  try {
    // Check if Airtable is configured
    if (!isAirtableConfigured()) {
      console.warn('Airtable not configured, returning empty projects array');
      return NextResponse.json({ 
        projects: [],
        message: 'Airtable not configured - returning empty projects array'
      });
    }

    const projects = await getProjects();
    return NextResponse.json({ 
      projects,
      count: projects.length,
      success: true
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch projects',
        message: 'Unable to retrieve projects from Airtable. Please try again later.',
        projects: []
      },
      { status: 500 }
    );
  }
}
