import { google } from 'googleapis';

interface ClientData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
}

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
}

export class GoogleSheetsAPI {
  private static readonly SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1IWvMcB8PE4MxKPGN1cdVQhg57WqI9ozFLpi4bCrX2H8';
  private static readonly CLIENT_DATA_RANGE = 'Client Data!A:J';
  private static readonly PROJECT_DATA_RANGE = 'Project Data!A:S';

  private static getAuth() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return auth;
  }

  /**
   * Log client data to Google Sheets
   */
  static async logClientData(data: ClientData): Promise<boolean> {
    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });

      const values = [
        [
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
        ]
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: this.SPREADSHEET_ID,
        range: this.CLIENT_DATA_RANGE,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });

      console.log('Client data logged to Google Sheets successfully');
      return true;
    } catch (error) {
      console.error('Error logging client data to Google Sheets:', error);
      return false;
    }
  }

  /**
   * Log project data to Google Sheets
   */
  static async logProjectData(data: ProjectData): Promise<boolean> {
    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });

      const values = [
        [
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
        ]
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: this.SPREADSHEET_ID,
        range: this.PROJECT_DATA_RANGE,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });

      console.log('Project data logged to Google Sheets successfully');
      return true;
    } catch (error) {
      console.error('Error logging project data to Google Sheets:', error);
      return false;
    }
  }

  /**
   * Get all client data from Google Sheets
   */
  static async getClientData(): Promise<any[]> {
    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.SPREADSHEET_ID,
        range: this.CLIENT_DATA_RANGE,
      });

      return response.data.values || [];
    } catch (error) {
      console.error('Error fetching client data from Google Sheets:', error);
      return [];
    }
  }

  /**
   * Get all project data from Google Sheets
   */
  static async getProjectData(): Promise<any[]> {
    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.SPREADSHEET_ID,
        range: this.PROJECT_DATA_RANGE,
      });

      return response.data.values || [];
    } catch (error) {
      console.error('Error fetching project data from Google Sheets:', error);
      return [];
    }
  }

  /**
   * Update project status in Google Sheets
   */
  static async updateProjectStatus(clientId: string, status: string, briefGenerated: boolean = false): Promise<boolean> {
    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });

      // First, get all data to find the row
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.SPREADSHEET_ID,
        range: this.PROJECT_DATA_RANGE,
      });

      const rows = response.data.values || [];
      const headerRow = rows[0];
      const clientIdColumnIndex = headerRow.indexOf('Client ID');
      const statusColumnIndex = headerRow.indexOf('Status');
      const briefGeneratedColumnIndex = headerRow.indexOf('Brief Generated');

      if (clientIdColumnIndex === -1 || statusColumnIndex === -1) {
        throw new Error('Required columns not found in spreadsheet');
      }

      // Find the row with matching client ID
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][clientIdColumnIndex] === clientId) {
          // Update the status and brief generated columns
          const updateRange = `Project Data!${String.fromCharCode(65 + statusColumnIndex)}${i + 1}:${String.fromCharCode(65 + briefGeneratedColumnIndex)}${i + 1}`;
          
          await sheets.spreadsheets.values.update({
            spreadsheetId: this.SPREADSHEET_ID,
            range: updateRange,
            valueInputOption: 'RAW',
            requestBody: {
              values: [[status, briefGenerated ? 'Yes' : 'No']],
            },
          });

          console.log(`Project status updated for client ${clientId}: ${status}`);
          return true;
        }
      }

      console.warn(`Client ID ${clientId} not found in spreadsheet`);
      return false;
    } catch (error) {
      console.error('Error updating project status in Google Sheets:', error);
      return false;
    }
  }
}
