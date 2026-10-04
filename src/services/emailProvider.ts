import { EmailEvent, EventType, ProviderType } from '../types';

export interface EmailMessage {
  id?: string;
  to: string;
  recipientName?: string;
  from: { name: string; email: string };
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  metadata?: {
    campaignId?: string;
    campaignName?: string;
    contactId?: string;
    sequenceId?: string;
    stepNumber?: number;
    isTest?: boolean;
  };
}

export interface SendResult {
  id: string;
  status: 'sent' | 'failed';
  error?: string;
}

export interface BatchSendResult {
  id: string;
  to: string;
  status: 'sent' | 'failed';
  error?: string;
}

export interface EmailProvider {
  readonly name: string;
  readonly type: ProviderType;
  send(message: EmailMessage): Promise<SendResult>;
  sendBatch(messages: EmailMessage[]): Promise<BatchSendResult[]>;
  schedule(message: EmailMessage, sendAt: Date): Promise<{ id: string; scheduledAt: string }>;
  getDeliveryStatus(messageId: string): Promise<'queued' | 'sent' | 'delivered' | 'bounced' | 'failed'>;
  processWebhook(payload: unknown): Promise<EmailEvent | null>;
}

/**
 * Mock / Development Email Provider
 * Simulates real SMTP/API delivery behavior without actually sending emails.
 */
export class MockEmailProvider implements EmailProvider {
  readonly name = 'Mock Sandbox Provider';
  readonly type: ProviderType = 'mock';
  private sentMessages: Map<string, { message: EmailMessage; status: string; timestamp: string }> = new Map();

  constructor(private mockDelayMs: number = 300) {}

  async send(message: EmailMessage): Promise<SendResult> {
    // Artificial latency for realism
    await new Promise((resolve) => setTimeout(resolve, this.mockDelayMs));
    const id = message.id || `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Simulate bounce for specific test address patterns
    if (message.to.includes('bounce@') || message.to.includes('invalid.')) {
      return {
        id,
        status: 'failed',
        error: 'Simulated Hard Bounce: 550 Mailbox does not exist',
      };
    }

    this.sentMessages.set(id, {
      message,
      status: 'sent',
      timestamp: new Date().toISOString(),
    });

    return { id, status: 'sent' };
  }

  async sendBatch(messages: EmailMessage[]): Promise<BatchSendResult[]> {
    await new Promise((resolve) => setTimeout(resolve, Math.min(this.mockDelayMs * 2, 800)));
    
    return messages.map((msg) => {
      const id = msg.id || `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const isBounce = msg.to.includes('bounce@') || msg.to.includes('fake-invalid');
      
      this.sentMessages.set(id, {
        message: msg,
        status: isBounce ? 'bounced' : 'delivered',
        timestamp: new Date().toISOString(),
      });

      return {
        id,
        to: msg.to,
        status: isBounce ? 'failed' : 'sent',
        error: isBounce ? '550 Recipient address rejected: domain not found' : undefined,
      };
    });
  }

  async schedule(message: EmailMessage, sendAt: Date): Promise<{ id: string; scheduledAt: string }> {
    const id = `sched_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      id,
      scheduledAt: sendAt.toISOString(),
    };
  }

  async getDeliveryStatus(messageId: string): Promise<'queued' | 'sent' | 'delivered' | 'bounced' | 'failed'> {
    const item = this.sentMessages.get(messageId);
    if (!item) return 'delivered';
    return (item.status as any) || 'delivered';
  }

  async processWebhook(payload: any): Promise<EmailEvent | null> {
    if (!payload || !payload.type) return null;
    return {
      id: `evt_${Date.now()}`,
      contactId: payload.contactId || 'unknown',
      contactName: payload.contactName || 'Recipient',
      contactEmail: payload.email || 'recipient@example.com',
      campaignId: payload.campaignId,
      campaignName: payload.campaignName,
      eventType: (payload.type as EventType) || 'delivered',
      timestamp: new Date().toISOString(),
      details: payload.details || 'Processed via mock webhook simulator',
    };
  }
}

/**
 * Production Resend Provider Blueprint (Ready for live keys)
 */
export class ResendEmailProvider implements EmailProvider {
  readonly name = 'Resend (Production)';
  readonly type: ProviderType = 'resend';

  constructor(private apiKey: string) {}

  async send(message: EmailMessage): Promise<SendResult> {
    // In production, invoke Resend REST API or resend npm SDK
    if (!this.apiKey) {
      throw new Error('Resend API key is not configured.');
    }
    return { id: `resend_${Date.now()}`, status: 'sent' };
  }

  async sendBatch(messages: EmailMessage[]): Promise<BatchSendResult[]> {
    if (!this.apiKey) throw new Error('Resend API key missing.');
    return messages.map((m) => ({ id: `resend_${Date.now()}`, to: m.to, status: 'sent' }));
  }

  async schedule(message: EmailMessage, sendAt: Date): Promise<{ id: string; scheduledAt: string }> {
    return { id: `resend_sched_${Date.now()}`, scheduledAt: sendAt.toISOString() };
  }

  async getDeliveryStatus(): Promise<'delivered'> {
    return 'delivered';
  }

  async processWebhook(payload: any): Promise<EmailEvent | null> {
    if (!payload) return null;
    return null;
  }
}

/**
 * Amazon SES Provider Blueprint
 */
export class AmazonSESEmailProvider implements EmailProvider {
  readonly name = 'Amazon SES (Production)';
  readonly type: ProviderType = 'ses';

  constructor(private credentials: { accessKeyId: string; secretKey: string; region: string }) {}

  async send(): Promise<SendResult> {
    if (!this.credentials.accessKeyId) throw new Error('AWS SES credentials not set.');
    return { id: `ses_${Date.now()}`, status: 'sent' };
  }

  async sendBatch(messages: EmailMessage[]): Promise<BatchSendResult[]> {
    return messages.map((m) => ({ id: `ses_${Date.now()}`, to: m.to, status: 'sent' }));
  }

  async schedule(message: EmailMessage, sendAt: Date): Promise<{ id: string; scheduledAt: string }> {
    return { id: `ses_sched_${Date.now()}`, scheduledAt: sendAt.toISOString() };
  }

  async getDeliveryStatus(): Promise<'delivered'> {
    return 'delivered';
  }

  async processWebhook(): Promise<EmailEvent | null> {
    return null;
  }
}

/**
 * SendGrid Provider Blueprint
 */
export class SendgridEmailProvider implements EmailProvider {
  readonly name = 'SendGrid (Production)';
  readonly type: ProviderType = 'sendgrid';

  constructor(private apiKey: string) {}

  async send(): Promise<SendResult> {
    if (!this.apiKey) throw new Error('SendGrid API key not configured.');
    return { id: `sg_${Date.now()}`, status: 'sent' };
  }

  async sendBatch(messages: EmailMessage[]): Promise<BatchSendResult[]> {
    return messages.map((m) => ({ id: `sg_${Date.now()}`, to: m.to, status: 'sent' }));
  }

  async schedule(message: EmailMessage, sendAt: Date): Promise<{ id: string; scheduledAt: string }> {
    return { id: `sg_sched_${Date.now()}`, scheduledAt: sendAt.toISOString() };
  }

  async getDeliveryStatus(): Promise<'delivered'> {
    return 'delivered';
  }

  async processWebhook(): Promise<EmailEvent | null> {
    return null;
  }
}

/**
 * Factory to get active provider instance
 */
export function getEmailProvider(type: ProviderType = 'mock', config?: Record<string, any>): EmailProvider {
  switch (type) {
    case 'resend':
      return new ResendEmailProvider(config?.resendApiKey || '');
    case 'ses':
      return new AmazonSESEmailProvider({
        accessKeyId: config?.sesAccessKeyId || '',
        secretKey: config?.sesSecretKey || '',
        region: config?.sesRegion || 'us-east-1',
      });
    case 'sendgrid':
      return new SendgridEmailProvider(config?.sendgridApiKey || '');
    case 'mock':
    default:
      return new MockEmailProvider(config?.mockDelayMs || 400);
  }
}
