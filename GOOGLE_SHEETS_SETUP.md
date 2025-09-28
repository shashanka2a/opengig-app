# Gator Innovation - Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets as a backend for logging client and project data for Gator Innovation, powered by OpenGig.

## 📋 Prerequisites

1. Google account
2. Access to Google Cloud Console
3. Your Google Sheets spreadsheet: [https://docs.google.com/spreadsheets/d/1IWvMcB8PE4MxKPGN1cdVQhg57WqI9ozFLpi4bCrX2H8/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1IWvMcB8PE4MxKPGN1cdVQhg57WqI9ozFLpi4bCrX2H8/edit?usp=sharing)

## 🔧 Setup Steps

### Step 1: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `opengig-sheets-service`
   - Description: `Service account for OpenGig Google Sheets integration`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### Step 3: Generate Service Account Key

1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file (keep it secure!)

### Step 4: Share Your Google Sheet

1. Open your Google Sheet: [https://docs.google.com/spreadsheets/d/1IWvMcB8PE4MxKPGN1cdVQhg57WqI9ozFLpi4bCrX2H8/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1IWvMcB8PE4MxKPGN1cdVQhg57WqI9ozFLpi4bCrX2H8/edit?usp=sharing)
2. Click "Share" button
3. Add the service account email (from the JSON file) as an editor
4. The email will look like: `opengig-sheets-service@your-project.iam.gserviceaccount.com`

### Step 5: Set Up Your Sheet Structure

Create the following sheets in your Google Spreadsheet:

#### Sheet 1: "Client Data"
Headers (Row 1):
```
Timestamp | Name | Email | Company | Project Type | Budget | Timeline | Description | Status | Date
```

#### Sheet 2: "Project Data"
Headers (Row 1):
```
Timestamp | Client ID | Project Name | Project Type | Target Audience | Core Features | Design Preferences | Platform Requirements | Integrations | Success Metrics | Technical Requirements | User Flow | Competitor Info | Budget | Timeline | Status | Brief Generated | Date
```

### Step 6: Environment Variables

Create a `.env.local` file in your project root:

```env
# Google Sheets API Configuration
GOOGLE_SHEETS_API_KEY=your_api_key_here
GOOGLE_SHEETS_SPREADSHEET_ID=1IWvMcB8PE4MxKPGN1cdVQhg57WqI9ozFLpi4bCrX2H8
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

**Important**: Replace the values with your actual credentials from the JSON file.

## 🔄 How It Works

### Client Data Logging
When a user completes the initial form, the following data is logged:
- Personal information (name, email, company)
- Project details (type, budget, timeline, description)
- Timestamp and status

### Project Data Logging
When a user completes the chatbot conversation, detailed project data is logged:
- All conversation insights
- Technical requirements
- Design preferences
- Platform requirements
- Success metrics

## 📊 Data Structure

### Client Data Fields
```typescript
{
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
```

### Project Data Fields
```typescript
{
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
```

## 🚀 Testing the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Fill out the form and complete the chatbot conversation
3. Check your Google Sheet for new data entries
4. Check the browser console for logging messages

## 🔒 Security Notes

- Keep your service account JSON file secure
- Never commit the `.env.local` file to version control
- Use environment variables in production
- Regularly rotate your service account keys

## 🛠️ Troubleshooting

### Common Issues

1. **"Permission denied" error**
   - Ensure the service account has edit access to the sheet
   - Check that the service account email is correctly shared

2. **"API key not valid" error**
   - Verify your API key in the Google Cloud Console
   - Ensure the Google Sheets API is enabled

3. **"Spreadsheet not found" error**
   - Double-check the spreadsheet ID in your environment variables
   - Ensure the spreadsheet is accessible

### Debug Mode

Enable debug logging by adding this to your `.env.local`:
```env
DEBUG_GOOGLE_SHEETS=true
```

## 📈 Analytics & Insights

With this setup, you can:
- Track lead generation and conversion rates
- Analyze project requirements and trends
- Monitor client engagement patterns
- Export data for further analysis

## 🔄 Next Steps

1. Set up automated reports
2. Create data visualization dashboards
3. Implement data validation rules
4. Set up email notifications for new leads

---

**Need Help?** Check the [Google Sheets API documentation](https://developers.google.com/sheets/api) for more advanced features.
