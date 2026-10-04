import {
  Campaign,
  Contact,
  EmailEvent,
  ProviderSettings,
  Segment,
  SendingDomain,
  Sequence,
  SuppressionEntry,
  Template,
  UserProfile,
} from '../types';
import {
  INITIAL_CAMPAIGNS,
  INITIAL_CLIENT_LEADS,
  INITIAL_DOMAINS,
  INITIAL_EVENTS,
  INITIAL_PROVIDER_SETTINGS,
  INITIAL_SEGMENTS,
  INITIAL_SEQUENCES,
  INITIAL_STUDENTS,
  INITIAL_SUPPRESSION,
  INITIAL_TEMPLATES,
  INITIAL_USER,
} from './initialData';
import { getEmailProvider, EmailMessage } from '../services/emailProvider';
import { personalizeText } from '../lib/personalization';

const STORAGE_KEY = 'outreach_hub_data_v2';

export interface AppStoreState {
  user: UserProfile;
  contacts: Contact[];
  campaigns: Campaign[];
  templates: Template[];
  sequences: Sequence[];
  segments: Segment[];
  suppressionList: SuppressionEntry[];
  sendingDomains: SendingDomain[];
  providerSettings: ProviderSettings;
  emailEvents: EmailEvent[];
}

function loadInitialState(): AppStoreState {
  if (typeof window === 'undefined') {
    return {
      user: INITIAL_USER,
      contacts: [...INITIAL_STUDENTS, ...INITIAL_CLIENT_LEADS],
      campaigns: INITIAL_CAMPAIGNS,
      templates: INITIAL_TEMPLATES,
      sequences: INITIAL_SEQUENCES,
      segments: INITIAL_SEGMENTS,
      suppressionList: INITIAL_SUPPRESSION,
      sendingDomains: INITIAL_DOMAINS,
      providerSettings: INITIAL_PROVIDER_SETTINGS,
      emailEvents: INITIAL_EVENTS,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        user: parsed.user || INITIAL_USER,
        contacts: parsed.contacts || [...INITIAL_STUDENTS, ...INITIAL_CLIENT_LEADS],
        campaigns: parsed.campaigns || INITIAL_CAMPAIGNS,
        templates: parsed.templates || INITIAL_TEMPLATES,
        sequences: parsed.sequences || INITIAL_SEQUENCES,
        segments: parsed.segments || INITIAL_SEGMENTS,
        suppressionList: parsed.suppressionList || INITIAL_SUPPRESSION,
        sendingDomains: parsed.sendingDomains || INITIAL_DOMAINS,
        providerSettings: parsed.providerSettings || INITIAL_PROVIDER_SETTINGS,
        emailEvents: parsed.emailEvents || INITIAL_EVENTS,
      };
    }
  } catch (e) {
    console.error('Failed to load storage:', e);
  }

  return {
    user: INITIAL_USER,
    contacts: [...INITIAL_STUDENTS, ...INITIAL_CLIENT_LEADS],
    campaigns: INITIAL_CAMPAIGNS,
    templates: INITIAL_TEMPLATES,
    sequences: INITIAL_SEQUENCES,
    segments: INITIAL_SEGMENTS,
    suppressionList: INITIAL_SUPPRESSION,
    sendingDomains: INITIAL_DOMAINS,
    providerSettings: INITIAL_PROVIDER_SETTINGS,
    emailEvents: INITIAL_EVENTS,
  };
}

export class AppStore {
  private state: AppStoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = loadInitialState();
  }

  public getState(): AppStoreState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
    this.listeners.forEach((l) => l());
  }

  public resetToDemoData() {
    this.state = {
      user: INITIAL_USER,
      contacts: [...INITIAL_STUDENTS, ...INITIAL_CLIENT_LEADS],
      campaigns: INITIAL_CAMPAIGNS,
      templates: INITIAL_TEMPLATES,
      sequences: INITIAL_SEQUENCES,
      segments: INITIAL_SEGMENTS,
      suppressionList: INITIAL_SUPPRESSION,
      sendingDomains: INITIAL_DOMAINS,
      providerSettings: INITIAL_PROVIDER_SETTINGS,
      emailEvents: INITIAL_EVENTS,
    };
    this.notify();
  }

  // --- Contacts ---
  public addContact(contact: Omit<Contact, 'id' | 'createdAt'>): Contact {
    const newContact: Contact = {
      ...contact,
      id: `cnt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      notes: contact.notes || [],
    };
    this.state.contacts = [newContact, ...this.state.contacts];
    this.notify();
    return newContact;
  }

  public updateContact(id: string, updates: Partial<Contact>) {
    this.state.contacts = this.state.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.notify();
  }

  public deleteContact(id: string) {
    this.state.contacts = this.state.contacts.filter((c) => c.id !== id);
    this.notify();
  }

  public bulkAddContacts(newContacts: Array<Omit<Contact, 'id' | 'createdAt'>>): { count: number } {
    const formatted: Contact[] = newContacts.map((c, i) => ({
      ...c,
      id: `cnt_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      notes: c.notes || [],
    }));
    this.state.contacts = [...formatted, ...this.state.contacts];
    
    // Add event log
    this.addEmailEvent({
      contactId: formatted[0]?.id || 'bulk',
      contactName: `${formatted.length} contacts`,
      contactEmail: 'system@outreachhub.io',
      eventType: 'sent',
      timestamp: new Date().toISOString(),
      details: `Successfully imported ${formatted.length} new contacts into directory.`,
    });

    this.notify();
    return { count: formatted.length };
  }

  public bulkTagContacts(ids: string[], tagToAdd: string) {
    this.state.contacts = this.state.contacts.map((c) => {
      if (ids.includes(c.id) && !c.tags.includes(tagToAdd)) {
        return { ...c, tags: [...c.tags, tagToAdd] };
      }
      return c;
    });
    this.notify();
  }

  public bulkDeleteContacts(ids: string[]) {
    this.state.contacts = this.state.contacts.filter((c) => !ids.includes(c.id));
    this.notify();
  }

  public addNote(contactId: string, content: string, author: string = 'Jordan Blake') {
    const note = {
      id: `note_${Date.now()}`,
      content,
      author,
      createdAt: new Date().toISOString(),
    };
    this.state.contacts = this.state.contacts.map((c) => {
      if (c.id === contactId) {
        return {
          ...c,
          notes: [note, ...(c.notes || [])],
        };
      }
      return c;
    });
    this.notify();
  }

  // --- Suppression ---
  public isEmailSuppressed(email: string): boolean {
    const clean = email.trim().toLowerCase();
    return this.state.suppressionList.some((s) => s.email.trim().toLowerCase() === clean);
  }

  public addSuppression(email: string, reason: SuppressionEntry['reason'], source: string = 'Manual') {
    const clean = email.trim().toLowerCase();
    if (this.isEmailSuppressed(clean)) return;

    const entry: SuppressionEntry = {
      id: `sup_${Date.now()}`,
      email: clean,
      reason,
      date: new Date().toISOString(),
      source,
    };
    this.state.suppressionList = [entry, ...this.state.suppressionList];
    
    // Update any contact status if present
    this.state.contacts = this.state.contacts.map((c) => {
      if (c.email.trim().toLowerCase() === clean) {
        return { ...c, status: reason === 'Hard bounce' ? 'Bounced' : 'Unsubscribed' };
      }
      return c;
    });

    this.notify();
  }

  public removeSuppression(id: string) {
    this.state.suppressionList = this.state.suppressionList.filter((s) => s.id !== id);
    this.notify();
  }

  // --- Campaigns ---
  public addCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'deliveredCount' | 'openedCount' | 'clickedCount' | 'repliedCount' | 'bouncedCount' | 'unsubscribedCount'>): Campaign {
    const newCamp: Campaign = {
      ...campaign,
      id: `cmp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      repliedCount: 0,
      bouncedCount: 0,
      unsubscribedCount: 0,
    };
    this.state.campaigns = [newCamp, ...this.state.campaigns];
    this.notify();
    return newCamp;
  }

  public updateCampaign(id: string, updates: Partial<Campaign>) {
    this.state.campaigns = this.state.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.notify();
  }

  public deleteCampaign(id: string) {
    this.state.campaigns = this.state.campaigns.filter((c) => c.id !== id);
    this.notify();
  }

  /**
   * Dispatches a campaign through the configured email provider.
   * Filters out suppressed emails, simulates delivery, and triggers initial events.
   */
  public async sendCampaignNow(campaignId: string, recipients: Contact[]) {
    const camp = this.state.campaigns.find((c) => c.id === campaignId);
    if (!camp) return;

    // Filter suppression list
    const validRecipients = recipients.filter((r) => !this.isEmailSuppressed(r.email));
    
    // Set status to sending
    this.updateCampaign(campaignId, {
      status: 'Sending',
      totalRecipients: validRecipients.length,
      sentAt: new Date().toISOString(),
    });

    const provider = getEmailProvider(this.state.providerSettings.activeProvider, this.state.providerSettings);

    const messages: EmailMessage[] = validRecipients.map((r) => {
      const pSubject = personalizeText(camp.subject, r, camp.fromName);
      const pHtml = personalizeText(camp.bodyHtml, r, camp.fromName);
      return {
        to: r.email,
        recipientName: `${r.firstName} ${r.lastName}`.trim(),
        from: { name: camp.fromName, email: camp.fromEmail },
        replyTo: camp.replyTo,
        subject: pSubject,
        html: pHtml,
        metadata: {
          campaignId: camp.id,
          campaignName: camp.name,
          contactId: r.id,
        },
      };
    });

    try {
      const results = await provider.sendBatch(messages);
      const successful = results.filter((res) => res.status === 'sent');
      const failed = results.filter((res) => res.status === 'failed');

      // Add events
      successful.slice(0, 15).forEach((item) => {
        const contact = validRecipients.find((r) => r.email === item.to);
        if (contact) {
          this.addEmailEvent({
            contactId: contact.id,
            contactName: `${contact.firstName} ${contact.lastName}`.trim(),
            contactEmail: contact.email,
            campaignId: camp.id,
            campaignName: camp.name,
            eventType: 'delivered',
            timestamp: new Date().toISOString(),
            details: `Delivered via ${provider.name}`,
            subject: camp.subject,
          });
          // Update contact last contacted
          this.updateContact(contact.id, {
            status: contact.status === 'New' ? 'Contacted' : contact.status,
            lastContacted: new Date().toISOString(),
          });
        }
      });

      // Handle any bounces
      failed.forEach((item) => {
        this.addSuppression(item.to, 'Hard bounce', 'SMTP Delivery Rejection');
      });

      // Update Campaign statistics with realistic delivery rates
      const delivered = successful.length;
      const opens = Math.floor(delivered * 0.65);
      const clicks = Math.floor(opens * 0.45);
      const replies = Math.max(1, Math.floor(clicks * 0.22));

      this.updateCampaign(campaignId, {
        status: 'Completed',
        deliveredCount: delivered,
        openedCount: opens,
        clickedCount: clicks,
        repliedCount: replies,
        bouncedCount: failed.length,
      });

      // Generate a realistic mock reply event for engagement
      if (validRecipients[0]) {
        const first = validRecipients[0];
        setTimeout(() => {
          this.addEmailEvent({
            contactId: first.id,
            contactName: `${first.firstName} ${first.lastName}`.trim(),
            contactEmail: first.email,
            campaignId: camp.id,
            campaignName: camp.name,
            eventType: 'replied',
            timestamp: new Date().toISOString(),
            details: `Replied: "Thanks for reaching out! Let's schedule a call."`,
            subject: `Re: ${camp.subject}`,
          });
          this.updateContact(first.id, {
            status: 'Replied',
            lastReplied: new Date().toISOString(),
          });
        }, 3000);
      }
    } catch (e) {
      console.error('Failed to send campaign batch:', e);
      this.updateCampaign(campaignId, { status: 'Draft' });
    }
  }

  // --- Templates ---
  public addTemplate(template: Omit<Template, 'id' | 'createdAt' | 'lastModified'>): Template {
    const newTpl: Template = {
      ...template,
      id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    this.state.templates = [newTpl, ...this.state.templates];
    this.notify();
    return newTpl;
  }

  public updateTemplate(id: string, updates: Partial<Template>) {
    this.state.templates = this.state.templates.map((t) =>
      t.id === id ? { ...t, ...updates, lastModified: new Date().toISOString() } : t
    );
    this.notify();
  }

  public deleteTemplate(id: string) {
    this.state.templates = this.state.templates.filter((t) => t.id !== id);
    this.notify();
  }

  // --- Sequences ---
  public addSequence(sequence: Omit<Sequence, 'id' | 'createdAt' | 'activeEnrollments' | 'completedCount'>): Sequence {
    const newSeq: Sequence = {
      ...sequence,
      id: `seq_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      activeEnrollments: 0,
      completedCount: 0,
    };
    this.state.sequences = [newSeq, ...this.state.sequences];
    this.notify();
    return newSeq;
  }

  public updateSequence(id: string, updates: Partial<Sequence>) {
    this.state.sequences = this.state.sequences.map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.notify();
  }

  public deleteSequence(id: string) {
    this.state.sequences = this.state.sequences.filter((s) => s.id !== id);
    this.notify();
  }

  // --- Email Events ---
  public addEmailEvent(event: Omit<EmailEvent, 'id'>) {
    const newEvent: EmailEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    this.state.emailEvents = [newEvent, ...this.state.emailEvents];
    this.notify();
  }

  // --- Settings ---
  public updateProviderSettings(settings: Partial<ProviderSettings>) {
    this.state.providerSettings = {
      ...this.state.providerSettings,
      ...settings,
    };
    this.notify();
  }

  public addSendingDomain(domain: string, defaultFrom: string) {
    const newDomain: SendingDomain = {
      id: `dom_${Date.now()}`,
      domain,
      spf: true,
      dkim: true,
      dmarc: false,
      verified: false,
      defaultFrom,
    };
    this.state.sendingDomains = [...this.state.sendingDomains, newDomain];
    this.notify();
  }

  public verifyDomain(id: string) {
    this.state.sendingDomains = this.state.sendingDomains.map((d) =>
      d.id === id ? { ...d, spf: true, dkim: true, dmarc: true, verified: true } : d
    );
    this.notify();
  }

  public deleteDomain(id: string) {
    this.state.sendingDomains = this.state.sendingDomains.filter((d) => d.id !== id);
    this.notify();
  }
}

export const appStore = new AppStore();
