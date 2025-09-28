import { NextRequest, NextResponse } from 'next/server';

// Mock data for testing
const mockClientData = {
  name: "Test User",
  email: "test@example.com",
  company: "Test Company",
  projectType: "Web Application",
  budget: "$5,000 - $10,000",
  timeline: "2-3 months",
  description: "A test project for Google Sheets integration"
};

const mockProjectData = {
  clientId: "TEST_CLIENT_001",
  projectName: "Test Company - Web Application",
  projectType: "Web Application",
  targetAudience: "Test users and customers",
  coreFeatures: ["User Authentication", "Dashboard", "Reports"],
  designPreferences: "Modern, clean design",
  platformRequirements: ["Web", "Mobile"],
  integrations: ["Google Analytics", "Email"],
  successMetrics: "Increase user engagement by 30%",
  technicalRequirements: "React frontend, Node.js backend",
  userFlow: "Login → Dashboard → Reports",
  competitorInfo: "Similar to existing solutions",
  budget: "$5,000 - $10,000",
  timeline: "2-3 months",
  status: "Test",
  briefGenerated: false
};

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Google Sheets integration...');
    
    // Check if environment variables are set
    const requiredEnvVars = [
      'GOOGLE_SHEETS_SPREADSHEET_ID',
      'GOOGLE_SERVICE_ACCOUNT_EMAIL',
      'GOOGLE_PRIVATE_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        missing: missingVars,
        message: 'Please set up your .env.local file with Google Sheets credentials'
      }, { status: 500 });
    }

    // Test the Google Sheets API
    const { GoogleSheetsAPI } = await import('@/lib/googleSheetsAPI');
    
    // Test client data logging
    console.log('📝 Testing client data logging...');
    const clientSuccess = await GoogleSheetsAPI.logClientData(mockClientData);
    
    // Test project data logging
    console.log('📝 Testing project data logging...');
    const projectSuccess = await GoogleSheetsAPI.logProjectData(mockProjectData);
    
    // Test data retrieval
    console.log('📖 Testing data retrieval...');
    const clientData = await GoogleSheetsAPI.getClientData();
    const projectData = await GoogleSheetsAPI.getProjectData();

    return NextResponse.json({
      success: true,
      message: 'Google Sheets integration test completed',
      results: {
        clientDataLogging: clientSuccess,
        projectDataLogging: projectSuccess,
        clientDataRows: clientData.length,
        projectDataRows: projectData.length
      },
      testData: {
        client: mockClientData,
        project: mockProjectData
      }
    });

  } catch (error) {
    console.error('❌ Google Sheets test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Google Sheets integration test failed'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();
    
    if (type === 'client') {
      const { GoogleSheetsAPI } = await import('@/lib/googleSheetsAPI');
      const success = await GoogleSheetsAPI.logClientData(data);
      return NextResponse.json({ success, message: 'Client data logged' });
    }
    
    if (type === 'project') {
      const { GoogleSheetsAPI } = await import('@/lib/googleSheetsAPI');
      const success = await GoogleSheetsAPI.logProjectData(data);
      return NextResponse.json({ success, message: 'Project data logged' });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    
  } catch (error) {
    console.error('❌ POST test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

