// Google Sheets API Integration Service
// This service handles logging data to your Google Sheets backend

interface LogClientDataParams {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
}

interface LogProjectDataParams {
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
}

export class GoogleSheetsService {
  private static readonly SPREADSHEET_ID = '1IWvMcB8PE4MxKPGN1cdVQhg57WqI9ozFLpi4bCrX2H8';
  private static readonly CLIENT_DATA_RANGE = 'Client Data!A:Z';
  private static readonly PROJECT_DATA_RANGE = 'Project Data!A:Z';

  /**
   * Log client data to Google Sheets
   */
  static async logClientData(data: LogClientDataParams): Promise<boolean> {
    try {
      const response = await fetch('/api/sheets/log-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          status: 'New Lead'
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error logging client data:', error);
      return false;
    }
  }

  /**
   * Log project data to Google Sheets
   */
  static async logProjectData(data: LogProjectDataParams): Promise<boolean> {
    try {
      const response = await fetch('/api/sheets/log-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error logging project data:', error);
      return false;
    }
  }

  /**
   * Generate a unique client ID
   */
  static generateClientId(): string {
    return `CLIENT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format data for Google Sheets
   */
  static formatClientDataForSheets(data: LogClientDataParams) {
    return [
      new Date().toISOString(), // Timestamp
      data.name, // Name
      data.email, // Email
      data.company, // Company
      data.projectType, // Project Type
      data.budget, // Budget
      data.timeline, // Timeline
      data.description, // Description
      'New Lead', // Status
      new Date().toLocaleDateString(), // Date
    ];
  }

  /**
   * Format project data for Google Sheets
   */
  static formatProjectDataForSheets(data: LogProjectDataParams) {
    return [
      new Date().toISOString(), // Timestamp
      data.clientId, // Client ID
      data.projectName, // Project Name
      data.projectType, // Project Type
      data.targetAudience, // Target Audience
      data.coreFeatures.join(', '), // Core Features
      data.designPreferences, // Design Preferences
      data.platformRequirements.join(', '), // Platform Requirements
      data.integrations.join(', '), // Integrations
      data.successMetrics, // Success Metrics
      data.technicalRequirements, // Technical Requirements
      data.userFlow, // User Flow
      data.competitorInfo, // Competitor Info
      data.budget, // Budget
      data.timeline, // Timeline
      data.status, // Status
      data.briefGenerated ? 'Yes' : 'No', // Brief Generated
      new Date().toLocaleDateString(), // Date
    ];
  }
}
