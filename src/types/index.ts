export type NavigationTab =
  | 'dashboard'
  | 'campaigns'
  | 'students'
  | 'clients'
  | 'contacts'
  | 'sequences'
  | 'templates'
  | 'analytics'
  | 'inbox'
  | 'suppression'
  | 'settings';

export type ContactType = 'Student' | 'Client Lead' | 'Partner' | 'Faculty' | 'Organization' | 'Other';

export type ContactStatus = 
  | 'New'
  | 'Active'
  | 'Contacted'
  | 'Replied'
  | 'Interested'
  | 'Not Interested'
  | 'Converted'
  | 'Unsubscribed'
  | 'Bounced';

export type LeadStatus =
  | 'New'
  | 'Researched'
  | 'Contacted'
  | 'Follow-up'
  | 'Replied'
  | 'Interested'
  | 'Meeting'
  | 'Proposal'
  | 'Won'
  | 'Lost'
  | 'Do Not Contact';

export interface NoteItem {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  role?: string;
  city?: string;
  website?: string;
  contactType: ContactType;
  tags: string[];
  status: ContactStatus;
  source: string;
  notes: NoteItem[];
  createdAt: string;
  lastContacted?: string;
  lastReplied?: string;
  
  // Student Specific
  college?: string;
  department?: string;
  batch?: string;
  year?: string;
  course?: string;
  section?: string;
  rollNumber?: string;
  isGeneratedRecipient?: boolean;

  // Client Lead Specific
  industry?: string;
  leadStatus?: LeadStatus;
  leadSource?: string;
  assignedOffer?: string;
  personalObservation?: string;
  websiteUrl?: string;
  nextFollowUpDate?: string;
  dealValue?: number;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  contactType?: ContactType;
  filterCriteria: {
    college?: string;
    department?: string;
    batch?: string;
    industry?: string;
    status?: string;
    tags?: string[];
  };
  contactCount: number;
  createdAt: string;
}

export type CampaignStatus = 
  | 'Draft'
  | 'Scheduled'
  | 'Sending'
  | 'Completed'
  | 'Paused'
  | 'Cancelled';

export type CampaignType = 'student' | 'client' | 'general';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  subject: string;
  previewText?: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  templateId?: string;
  bodyHtml: string;
  bodyText?: string;
  status: CampaignStatus;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  audienceDescription: string;
  totalRecipients: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  repliedCount: number;
  bouncedCount: number;
  unsubscribedCount: number;
  targetFilter?: {
    contactType?: ContactType;
    college?: string;
    department?: string;
    batch?: string;
    year?: string;
    industry?: string;
    status?: ContactStatus;
    tags?: string[];
  };
}

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'unsubscribed';
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  repliedAt?: string;
  error?: string;
}

export type EventType = 
  | 'sent'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'replied'
  | 'bounced'
  | 'unsubscribed';

export interface EmailEvent {
  id: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  campaignId?: string;
  campaignName?: string;
  eventType: EventType;
  timestamp: string;
  details?: string;
  subject?: string;
}

export type TemplateCategory = 
  | 'Student'
  | 'Client Outreach'
  | 'Follow-up'
  | 'Announcement'
  | 'Newsletter'
  | 'Event'
  | 'Partnership'
  | string;

export interface Template {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  preheader?: string;
  content: string;
  body?: string;
  category: string;
  variablesUsed?: string[];
  variables?: string[];
  createdAt: string;
  lastModified?: string;
}

export interface SequenceStep {
  id?: string;
  stepNumber?: number;
  stepOrder?: number;
  delayDays: number;
  subject: string;
  content?: string;
  body?: string;
  actionType?: 'email';
}

export interface Sequence {
  id: string;
  name: string;
  description: string;
  targetAudience: 'Client Lead' | 'Student' | string;
  status: 'Active' | 'Draft' | 'Paused';
  steps: SequenceStep[];
  stopConditions: string[];
  activeEnrollments: number;
  completedCount: number;
  createdAt: string;
}

export type SuppressionReason = 
  | 'Unsubscribed'
  | 'Hard bounce'
  | 'Soft bounce'
  | 'Spam complaint'
  | 'Manually suppressed'
  | 'Manual suppression'
  | string;

export interface SuppressionEntry {
  id: string;
  email: string;
  reason: SuppressionReason;
  date?: string;
  createdAt?: string;
  source?: string;
  sourceCampaign?: string;
  notes?: string;
}

export interface SendingDomain {
  id: string;
  domain: string;
  spf?: boolean;
  dkim?: boolean;
  dmarc?: boolean;
  spfStatus?: string;
  dkimStatus?: string;
  dmarcStatus?: string;
  verified: boolean;
  defaultFrom?: string;
}

export type ProviderType = 'mock' | 'resend' | 'ses' | 'sendgrid';

export interface ProviderSettings {
  activeProvider: ProviderType;
  mockDelayMs?: number;
  simulateEvents?: boolean;
  resendApiKey?: string;
  sesAccessKeyId?: string;
  sesSecretKey?: string;
  sesRegion?: string;
  sendgridApiKey?: string;
  sendingDomains?: SendingDomain[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  avatarUrl?: string;
}
