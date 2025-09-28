import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsAPI } from '@/lib/googleSheetsAPI';

interface ProjectData {
  clientId: string;
  projectName: string;
  projectType: string;
  targetAudience: string;
  coreFeatures: string[];
  designPreferences: string;
  platformRequirements: string[];
  integrations: string[];
  successMetrics: string;
  technicalRequirements: string;
  userFlow: string;
  competitorInfo: string;
  budget: string;
  timeline: string;
  status: string;
  briefGenerated: boolean;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const projectData: ProjectData = await request.json();
    
    // Log to Google Sheets
    const success = await GoogleSheetsAPI.logProjectData(projectData);
    
    if (success) {
      console.log('Project data logged to Google Sheets successfully');
      return NextResponse.json({ 
        success: true, 
        message: 'Project data logged successfully to Google Sheets',
        data: projectData 
      });
    } else {
      console.error('Failed to log project data to Google Sheets');
      return NextResponse.json(
        { success: false, error: 'Failed to log project data to Google Sheets' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error logging project data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log project data' },
      { status: 500 }
    );
  }
}
