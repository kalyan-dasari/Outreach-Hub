import { Contact } from '../types';

export interface VariableDefinition {
  key: string;
  label: string;
  example: string;
  category: 'common' | 'student' | 'client';
}

export const AVAILABLE_VARIABLES: VariableDefinition[] = [
  { key: 'first_name', label: 'First Name', example: 'Alex', category: 'common' },
  { key: 'last_name', label: 'Last Name', example: 'Rivera', category: 'common' },
  { key: 'full_name', label: 'Full Name', example: 'Alex Rivera', category: 'common' },
  { key: 'email', label: 'Email Address', example: 'alex@example.com', category: 'common' },
  { key: 'company', label: 'Company / Org', example: 'Apex Dental', category: 'common' },
  { key: 'role', label: 'Role / Title', example: 'Practice Manager', category: 'common' },
  { key: 'city', label: 'City', example: 'Austin', category: 'common' },
  { key: 'website', label: 'Website', example: 'apexdentalclinic.com', category: 'client' },
  { key: 'industry', label: 'Industry', example: 'Healthcare & Wellness', category: 'client' },
  { key: 'observation', label: 'Observation Note', example: 'your mobile booking page takes 6s to load', category: 'client' },
  { key: 'offer', label: 'Assigned Offer', example: 'Free 3-Page Website Redesign Mockup', category: 'client' },
  { key: 'sender_name', label: 'Sender Name', example: 'Jordan Blake', category: 'common' },
  { key: 'college', label: 'College / Institute', example: 'Stanford Tech Institute', category: 'student' },
  { key: 'department', label: 'Department', example: 'Computer Science', category: 'student' },
  { key: 'batch', label: 'Batch Year', example: '2023-2027', category: 'student' },
  { key: 'course', label: 'Degree / Course', example: 'B.Tech', category: 'student' },
  { key: 'section', label: 'Section', example: 'Sec A', category: 'student' },
  { key: 'roll_number', label: 'Roll / Student ID', example: 'CS23B1042', category: 'student' },
];

/**
 * Extracts all `{{variable}}` or `{{variable | fallback}}` tokens from string
 */
export function extractVariables(template: string): string[] {
  if (!template) return [];
  const regex = /\{\{\s*([a-zA-Z0-9_-]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g;
  const matches = new Set<string>();
  let match;
  while ((match = regex.exec(template)) !== null) {
    matches.add(match[1].trim());
  }
  return Array.from(matches);
}

/**
 * Resolves a variable key for a given contact
 */
export function resolveContactValue(key: string, contact: Partial<Contact>, senderName: string = 'Outreach Team'): string {
  switch (key.toLowerCase()) {
    case 'first_name':
      return contact.firstName || '';
    case 'last_name':
      return contact.lastName || '';
    case 'full_name':
      return [contact.firstName, contact.lastName].filter(Boolean).join(' ') || '';
    case 'email':
      return contact.email || '';
    case 'company':
    case 'organization':
      return contact.organization || contact.college || '';
    case 'role':
      return contact.role || '';
    case 'city':
      return contact.city || '';
    case 'website':
    case 'website_url':
      return contact.website || contact.websiteUrl || '';
    case 'industry':
      return contact.industry || '';
    case 'observation':
    case 'personal_observation':
      return contact.personalObservation || '';
    case 'offer':
    case 'assigned_offer':
      return contact.assignedOffer || '';
    case 'sender_name':
      return senderName;
    case 'college':
      return contact.college || contact.organization || '';
    case 'department':
      return contact.department || '';
    case 'batch':
      return contact.batch || '';
    case 'course':
      return contact.course || '';
    case 'section':
      return contact.section || '';
    case 'roll_number':
      return contact.rollNumber || '';
    case 'phone':
      return contact.phone || '';
    default:
      return '';
  }
}

/**
 * Personalizes text using contact data and fallbacks.
 * Handles: {{first_name}} and {{first_name | fallback value}}
 */
export function personalizeText(
  template: string,
  contact: Partial<Contact>,
  senderName: string = 'Jordan Blake'
): string {
  if (!template) return '';

  return template.replace(/\{\{\s*([a-zA-Z0-9_-]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g, (_match, key, fallback) => {
    const value = resolveContactValue(key, contact, senderName);
    if (value && value.trim().length > 0) {
      return value.trim();
    }
    return fallback ? fallback.trim() : '';
  });
}

/**
 * Validates whether all required variables without fallbacks have values for a contact
 */
export function validateContactVariables(
  template: string,
  contact: Partial<Contact>
): { missingKeys: string[]; valid: boolean } {
  if (!template) return { missingKeys: [], valid: true };
  
  const regex = /\{\{\s*([a-zA-Z0-9_-]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g;
  const missing = new Set<string>();
  let match;

  while ((match = regex.exec(template)) !== null) {
    const key = match[1].trim();
    const fallback = match[2];
    const value = resolveContactValue(key, contact);
    if (!value && !fallback) {
      missing.add(key);
    }
  }

  const missingKeys = Array.from(missing);
  return {
    missingKeys,
    valid: missingKeys.length === 0,
  };
}
