-- ==========================================================
-- Outreach Hub: Production Relational Schema (PostgreSQL / Supabase)
-- ==========================================================

-- 1. Users / Team Members
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    organization VARCHAR(255) NOT NULL DEFAULT 'Outreach Hub',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tags
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(30) DEFAULT '#6366f1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Contacts
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) DEFAULT '',
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    organization VARCHAR(255),
    role VARCHAR(150),
    city VARCHAR(100),
    website VARCHAR(255),
    contact_type VARCHAR(50) NOT NULL DEFAULT 'Student', -- 'Student', 'Client Lead', 'Partner', 'Faculty', etc.
    status VARCHAR(50) NOT NULL DEFAULT 'New', -- 'New', 'Active', 'Contacted', 'Replied', 'Interested', 'Bounced', etc.
    source VARCHAR(100) DEFAULT 'CSV Import',
    
    -- Student Attributes
    college VARCHAR(255),
    department VARCHAR(150),
    batch VARCHAR(50),
    year VARCHAR(20),
    course VARCHAR(100),
    section VARCHAR(50),
    roll_number VARCHAR(100),
    is_generated_recipient BOOLEAN DEFAULT FALSE,

    -- Client Lead Attributes
    industry VARCHAR(100),
    lead_status VARCHAR(50) DEFAULT 'New', -- 'New', 'Researched', 'Contacted', 'Follow-up', 'Replied', 'Interested', 'Meeting', 'Proposal', 'Won', 'Lost', 'Do Not Contact'
    lead_source VARCHAR(100),
    assigned_offer VARCHAR(255),
    personal_observation TEXT,
    website_url TEXT,
    next_follow_up_date DATE,
    deal_value NUMERIC(10, 2) DEFAULT 0,

    last_contacted TIMESTAMPTZ,
    last_replied TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for high-performance filtering & deduplication
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);
CREATE INDEX IF NOT EXISTS idx_contacts_type_status ON contacts (contact_type, status);
CREATE INDEX IF NOT EXISTS idx_contacts_college_dept ON contacts (college, department, batch);
CREATE INDEX IF NOT EXISTS idx_contacts_lead_status ON contacts (lead_status);

-- 4. Contact Tags Junction
CREATE TABLE IF NOT EXISTS contact_tags (
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (contact_id, tag_id)
);

-- 5. Notes on Contacts
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notes_contact_id ON notes (contact_id);

-- 6. Segments
CREATE TABLE IF NOT EXISTS segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contact_type VARCHAR(50),
    filter_criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Email Templates
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    preview_text VARCHAR(255),
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Client Outreach',
    variables_used TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'general', -- 'student', 'client', 'general'
    subject VARCHAR(255) NOT NULL,
    preview_text VARCHAR(255),
    from_name VARCHAR(150) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    reply_to VARCHAR(255),
    template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Draft', -- 'Draft', 'Scheduled', 'Sending', 'Completed', 'Paused', 'Cancelled'
    audience_description TEXT NOT NULL DEFAULT 'All Contacts',
    target_filter JSONB DEFAULT '{}'::jsonb,
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    total_recipients INT DEFAULT 0,
    delivered_count INT DEFAULT 0,
    opened_count INT DEFAULT 0,
    clicked_count INT DEFAULT 0,
    replied_count INT DEFAULT 0,
    bounced_count INT DEFAULT 0,
    unsubscribed_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Campaign Recipients
CREATE TABLE IF NOT EXISTS campaign_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    contact_name VARCHAR(200) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_comp ON campaign_recipients (campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_contact ON campaign_recipients (contact_id);

-- 10. Email Events (Webhook / Tracker Log)
CREATE TABLE IF NOT EXISTS email_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    contact_name VARCHAR(200),
    contact_email VARCHAR(255) NOT NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    campaign_name VARCHAR(255),
    event_type VARCHAR(50) NOT NULL, -- 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'unsubscribed'
    details TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_events_contact ON email_events (contact_id);
CREATE INDEX IF NOT EXISTS idx_email_events_campaign ON email_events (campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events (event_type);

-- 11. Sequences (Automated Outreach Flows)
CREATE TABLE IF NOT EXISTS sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_audience VARCHAR(50) NOT NULL DEFAULT 'Client Lead',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    stop_conditions TEXT[] DEFAULT ARRAY['Replied', 'Unsubscribed', 'Bounced', 'Converted'],
    active_enrollments INT DEFAULT 0,
    completed_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Sequence Steps
CREATE TABLE IF NOT EXISTS sequence_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    delay_days INT NOT NULL DEFAULT 3,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    action_type VARCHAR(50) DEFAULT 'email',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Sequence Enrollments
CREATE TABLE IF NOT EXISTS sequence_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    current_step INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Completed', 'Paused', 'Stopped'
    stopped_reason VARCHAR(100),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_step_sent_at TIMESTAMPTZ
);

-- 14. Global Suppression List
CREATE TABLE IF NOT EXISTS suppression_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    reason VARCHAR(100) NOT NULL, -- 'Unsubscribed', 'Hard bounce', 'Spam complaint', 'Manually suppressed'
    source VARCHAR(100) DEFAULT 'Manual',
    date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_suppression_email ON suppression_list (email);

-- 15. Sending Domains
CREATE TABLE IF NOT EXISTS sending_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) UNIQUE NOT NULL,
    spf BOOLEAN DEFAULT FALSE,
    dkim BOOLEAN DEFAULT FALSE,
    dmarc BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    default_from VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Provider Settings
CREATE TABLE IF NOT EXISTS provider_settings (
    id INT PRIMARY KEY DEFAULT 1,
    active_provider VARCHAR(50) NOT NULL DEFAULT 'mock', -- 'mock', 'resend', 'ses', 'sendgrid'
    mock_delay_ms INT DEFAULT 400,
    simulate_events BOOLEAN DEFAULT TRUE,
    resend_api_key TEXT,
    ses_access_key_id TEXT,
    ses_secret_key TEXT,
    ses_region VARCHAR(50) DEFAULT 'us-east-1',
    sendgrid_api_key TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT single_row_check CHECK (id = 1)
);
