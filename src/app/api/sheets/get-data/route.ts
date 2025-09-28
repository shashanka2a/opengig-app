import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsAPI } from '@/lib/googleSheetsAPI';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type') || 'all';

    let clientData = [];
    let projectData = [];

    if (dataType === 'all' || dataType === 'clients') {
      clientData = await GoogleSheetsAPI.getClientData();
    }

    if (dataType === 'all' || dataType === 'projects') {
      projectData = await GoogleSheetsAPI.getProjectData();
    }

    return NextResponse.json({
      success: true,
      data: {
        clients: clientData,
        projects: projectData,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data from Google Sheets' },
      { status: 500 }
    );
  }
}
