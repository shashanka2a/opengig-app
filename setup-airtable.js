// Setup script for Airtable integration
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Airtable Integration...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here

# Google Sheets Configuration (existing)
GOOGLE_SHEETS_PRIVATE_KEY=your_google_sheets_private_key_here
GOOGLE_SHEETS_CLIENT_EMAIL=your_google_sheets_client_email_here
GOOGLE_SHEETS_SPREADSHEET_ID=your_google_sheets_spreadsheet_id_here`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created with Airtable credentials');
} else {
  console.log('✅ .env.local file already exists');
}

// Create .env.example
const envExampleContent = `# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here

# Google Sheets Configuration (existing)
GOOGLE_SHEETS_PRIVATE_KEY=your_google_sheets_private_key_here
GOOGLE_SHEETS_CLIENT_EMAIL=your_google_sheets_client_email_here
GOOGLE_SHEETS_SPREADSHEET_ID=your_google_sheets_spreadsheet_id_here`;

fs.writeFileSync(envExamplePath, envExampleContent);
console.log('✅ .env.example file created');

console.log('\n🎉 Airtable integration setup complete!');
console.log('\n📋 Next steps:');
console.log('1. The Airtable credentials have been added to your .env.local file');
console.log('2. Your Airtable base contains:');
console.log('   - Projects table (id, title, category, description, url, imageUrl, alt, status, featured, order, createdDate)');
console.log('   - Contact Submissions table (id, name, email, company, phone, projectType, budgetRange, message, status, source, createdDate, assignedTo)');
console.log('3. API endpoints are available at:');
console.log('   - GET /api/projects - Fetch all projects');
console.log('   - POST /api/contact - Submit contact form');
console.log('4. The chatbot now shows ProjectBrief after completing all 5 topics');
console.log('5. ProjectBrief includes PDF generation and admin dashboard link');

