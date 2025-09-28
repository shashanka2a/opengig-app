import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsAPI } from '@/lib/googleSheetsAPI';

interface ClientData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  timestamp: string;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const clientData: ClientData = await request.json();
    
    // Log to Google Sheets
    const success = await GoogleSheetsAPI.logClientData(clientData);
    
    if (success) {
      console.log('Client data logged to Google Sheets successfully');
      return NextResponse.json({ 
        success: true, 
        message: 'Client data logged successfully to Google Sheets',
        data: clientData 
      });
    } else {
      console.error('Failed to log client data to Google Sheets');
      return NextResponse.json(
        { success: false, error: 'Failed to log client data to Google Sheets' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error logging client data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log client data' },
      { status: 500 }
    );
  }
}
