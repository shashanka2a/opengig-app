import Airtable from 'airtable';

// Initialize Airtable with environment variables
const getAirtableBase = () => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error('Missing Airtable environment variables: AIRTABLE_API_KEY and AIRTABLE_BASE_ID are required');
  }

  return new Airtable({ apiKey }).base(baseId);
};

// Project interface matching Airtable schema
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  imageUrl: string;
  alt: string;
  status: string;
  featured: boolean;
  order: number;
  createdDate: string;
}

// Contact submission interface matching Airtable schema
export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType: string;
  budgetRange: string;
  message: string;
  status?: string;
  source?: string;
  assignedTo?: string;
}

// Get all projects from Airtable
export async function getProjects(): Promise<Project[]> {
  try {
    const base = getAirtableBase();
    const records = await base('Projects').select({
      sort: [{ field: 'order', direction: 'asc' }]
    }).all();

    return records.map(record => ({
      id: record.id,
      title: record.get('title') as string || '',
      category: record.get('category') as string || '',
      description: record.get('description') as string || '',
      url: record.get('url') as string || '',
      imageUrl: record.get('imageUrl') as string || '',
      alt: record.get('alt') as string || '',
      status: record.get('status') as string || '',
      featured: record.get('featured') as boolean || false,
      order: record.get('order') as number || 0,
      createdDate: record.get('createdDate') as string || record._rawJson.createdTime
    }));
  } catch (error) {
    console.error('Error fetching projects from Airtable:', error);
    throw new Error('Failed to fetch projects from Airtable');
  }
}

// Create a new contact submission in Airtable
export async function createContactSubmission(submission: ContactSubmission): Promise<string> {
  try {
    const base = getAirtableBase();
    const record = await base('Contact Submissions').create({
      'Name': submission.name,
      'Email': submission.email,
      'Company': submission.company || '',
      'Phone': submission.phone || '',
      'Project Type': submission.projectType,
      'Budget Range': submission.budgetRange,
      'Message': submission.message,
      'Status': submission.status || 'New',
      'Source': submission.source || 'Website',
      'Assigned To': submission.assignedTo || '',
      'Created Date': new Date().toISOString()
    });

    return record.id;
  } catch (error) {
    console.error('Error creating contact submission in Airtable:', error);
    throw new Error('Failed to create contact submission in Airtable');
  }
}

// Check if Airtable is properly configured
export function isAirtableConfigured(): boolean {
  return !!(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID);
}
