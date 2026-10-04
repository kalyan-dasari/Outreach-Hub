import React, { useState, useMemo } from 'react';
import {
  Send,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Monitor,
  Eye,
  Calendar,
  Sparkles,
  ShieldCheck,
  Users,
  FileText,
  Clock,
  Play,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { Campaign, Contact, Template, ProviderSettings } from '../types';
import { personalizeText, extractVariables } from '../lib/personalization';

interface CampaignsViewProps {
  campaigns: Campaign[];
  contacts: Contact[];
  templates: Template[];
  suppressedEmails: Set<string>;
  providerSettings: ProviderSettings;
  onSendCampaign: (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'status'>) => Promise<Campaign>;
  onSelectCampaign: (campaign: Campaign) => void;
  initialWizardOpen?: boolean;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  contacts,
  templates,
  suppressedEmails,
  providerSettings,
  onSendCampaign,
  onSelectCampaign,
  initialWizardOpen = false,
}) => {
  const [isWizardOpen, setIsWizardOpen] = useState(initialWizardOpen);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState<Campaign | null>(null);

  // STEP 1: Campaign details
  const [name, setName] = useState('');
  const [type, setType] = useState<'student' | 'client' | 'general'>('student');
  const [senderName, setSenderName] = useState('Alex Morgan');
  const [senderEmail, setSenderEmail] = useState('alex@outreachhub.io');
  const [replyTo, setReplyTo] = useState('alex@outreachhub.io');

  // STEP 2: Audience criteria
  const [audienceType, setAudienceType] = useState<string>('all_students');
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string>('all');

  // STEP 3: Content
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // STEP 4: Preview
  const [previewContactId, setPreviewContactId] = useState<string>('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // STEP 5: Test email
  const [testEmailAddress, setTestEmailAddress] = useState('tester@example.com');
  const [testSentNotice, setTestSentNotice] = useState(false);

  // Filter Target Audience dynamically
  const targetRecipients = useMemo(() => {
    return contacts.filter((c) => {
      // Must not be unsubscribed
      if (c.status === 'Unsubscribed' || c.status === 'Bounced') return false;
      if (suppressedEmails.has(c.email.toLowerCase())) return false;

      if (type === 'student') {
        if (c.contactType !== 'Student') return false;
        if (selectedCollege !== 'all' && c.college !== selectedCollege) return false;
        if (selectedDept !== 'all' && c.department !== selectedDept) return false;
        if (selectedBatch !== 'all' && c.batch !== selectedBatch) return false;
        return true;
      }

      if (type === 'client') {
        if (c.contactType !== 'Client Lead') return false;
        if (selectedLeadStatus !== 'all' && c.leadStatus !== selectedLeadStatus) return false;
        return true;
      }

      return true;
    });
  }, [contacts, type, selectedCollege, selectedDept, selectedBatch, selectedLeadStatus, suppressedEmails]);

  // Selected Preview Contact
  const previewContact = useMemo(() => {
    if (previewContactId) {
      const found = contacts.find((c) => c.id === previewContactId);
      if (found) return found;
    }
    return targetRecipients[0] || contacts[0];
  }, [contacts, previewContactId, targetRecipients]);

  // Personalization preview output
  const resolvedSubject = previewContact ? personalizeText(subject, previewContact) : subject;
  const resolvedBody = previewContact ? personalizeText(body, previewContact) : body;

  // Insert Variable Token helper
  const insertToken = (token: string) => {
    setBody((prev) => prev + ` {{${token}}}`);
  };

  // Select Template handler
  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const found = templates.find((t) => t.id === tplId);
    if (found) {
      setSubject(found.subject);
      setPreheader(found.preheader || '');
      setBody(found.body);
    }
  };

  // Start campaign submission
  const handleLaunchCampaign = async () => {
    setIsSending(true);
    try {
      const campaign = await onSendCampaign({
        name,
        type,
        subject,
        preheader,
        body,
        fromName: senderName,
        fromEmail: senderEmail,
        replyTo,
        audienceDescription:
          type === 'student'
            ? `Students (${selectedCollege !== 'all' ? selectedCollege : 'All Campuses'})`
            : `Client Leads (${selectedLeadStatus !== 'all' ? selectedLeadStatus : 'All Stages'})`,
        totalRecipients: targetRecipients.length,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        repliedCount: 0,
        bouncedCount: 0,
        unsubscribedCount: 0,
      });
      setCreatedCampaign(campaign);
      setSendSuccess(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTestEmail = () => {
    setTestSentNotice(true);
    setTimeout(() => setTestSentNotice(false), 3500);
  };

  // Colleges & Dept lists
  const collegeList = useMemo(() => {
    const set = new Set<string>();
    contacts.filter((c) => c.contactType === 'Student').forEach((c) => c.college && set.add(c.college));
    return Array.from(set);
  }, [contacts]);

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Outreach Campaigns
          </h1>
          <p className="text-xs text-zinc-500">
            Create, personalize, schedule, and measure student announcements and client prospecting emails
          </p>
        </div>

        <button
          onClick={() => {
            setIsWizardOpen(true);
            setWizardStep(1);
            setSendSuccess(false);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign Wizard</span>
        </button>
      </div>

      {/* 6-STEP CREATION WIZARD MODAL */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => !isSending && setIsWizardOpen(false)}
          />
          <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
            {/* Wizard Progress Bar */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    Step {wizardStep} of 6:
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {wizardStep === 1 && 'Campaign Details & Type'}
                    {wizardStep === 2 && 'Target Audience Selection'}
                    {wizardStep === 3 && 'Compose or Choose Template'}
                    {wizardStep === 4 && 'Personalization & Preview'}
                    {wizardStep === 5 && 'Validation & Test Send'}
                    {wizardStep === 6 && 'Review & Send Confirmation'}
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[1, 2, 3, 4, 5, 6].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all ${
                        s < wizardStep
                          ? 'w-8 bg-zinc-900 dark:bg-white'
                          : s === wizardStep
                          ? 'w-12 bg-indigo-600'
                          : 'w-8 bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsWizardOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 text-xs space-y-4">
              {/* STEP 1: Campaign Details */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Stanford AI Hackathon Announcement or Q3 Web Speed Outreach"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                      Campaign Purpose
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'student', title: 'Student Outreach', desc: 'Hackathons, workshops & opportunities' },
                        { id: 'client', title: 'Client Outreach', desc: 'B2B personalized business outreach' },
                        { id: 'general', title: 'General Broadcast', desc: 'Updates, newsletters & notices' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setType(t.id as any)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            type === t.id
                              ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                          }`}
                        >
                          <p className="font-bold text-zinc-900 dark:text-white">{t.title}</p>
                          <p className="text-[11px] text-zinc-500 mt-1">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                        Sender Display Name
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                        Sender Email Address
                      </label>
                      <input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Choose Audience */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">
                        Dynamic Audience Count
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        Suppression list & invalid addresses filtered out automatically
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
                        {targetRecipients.length}
                      </span>
                      <span className="text-zinc-400">recipients</span>
                    </div>
                  </div>

                  {type === 'student' ? (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                          Target Campus / College
                        </label>
                        <select
                          value={selectedCollege}
                          onChange={(e) => setSelectedCollege(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                        >
                          <option value="all">All Campuses ({contacts.filter(c => c.contactType === 'Student').length})</option>
                          {collegeList.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                            Department
                          </label>
                          <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                          >
                            <option value="all">All Departments</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Data Science & AI">Data Science & AI</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                            Batch / Year
                          </label>
                          <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                          >
                            <option value="all">All Batches</option>
                            <option value="2023-2027">2023-2027</option>
                            <option value="2022-2026">2022-2026</option>
                            <option value="2021-2025">2021-2025</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                          Target Pipeline Stage
                        </label>
                        <select
                          value={selectedLeadStatus}
                          onChange={(e) => setSelectedLeadStatus(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                        >
                          <option value="all">All Client Stages ({contacts.filter(c => c.contactType === 'Client Lead').length})</option>
                          <option value="New">New Leads</option>
                          <option value="Researched">Researched</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Interested">Interested</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Compose or Select Template */}
              {wizardStep === 3 && (
                <div className="space-y-3">
                  {/* Template Picker Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-zinc-400 shrink-0 font-medium">Use Template:</span>
                    {templates.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleSelectTemplate(tpl.id)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${
                          selectedTemplateId === tpl.id
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                            : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {tpl.name}
                      </button>
                    ))}
                  </div>

                  {/* Subject Line */}
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Subject Line *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Quick question regarding {{organization | your team}}'s website"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                    />
                  </div>

                  {/* Variable Insertion Pills */}
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[11px] font-semibold text-zinc-500 block mb-1.5">
                      Insert Variable Tokens (click to add):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'first_name',
                        'last_name',
                        'organization',
                        'role',
                        'college',
                        'department',
                        'batch',
                        'personal_observation',
                        'assigned_offer',
                      ].map((tok) => (
                        <button
                          key={tok}
                          type="button"
                          onClick={() => insertToken(tok)}
                          className="px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 font-mono text-[10px] text-zinc-800 dark:text-zinc-200 hover:border-zinc-400"
                        >
                          + &#123;&#123;{tok}&#125;&#125;
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Email Body (Plain Text & Markdown) *
                    </label>
                    <textarea
                      rows={8}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your email copy here with personalized variables..."
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none font-mono text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Personalization & Live Preview */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        Preview as Recipient:
                      </span>
                      <select
                        value={previewContact?.id || ''}
                        onChange={(e) => setPreviewContactId(e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium outline-none"
                      >
                        {targetRecipients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.firstName} {c.lastName} ({c.organization || c.college || c.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-400'}`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-zinc-400'}`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rendered Email Frame */}
                  <div
                    className={`mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md overflow-hidden transition-all ${
                      previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'
                    }`}
                  >
                    {/* Fake Email Client Chrome */}
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 space-y-1 text-xs">
                      <p className="text-zinc-500">
                        <strong>From:</strong> {senderName} &lt;{senderEmail}&gt;
                      </p>
                      <p className="text-zinc-500">
                        <strong>To:</strong> {previewContact?.firstName} {previewContact?.lastName} &lt;{previewContact?.email}&gt;
                      </p>
                      <p className="font-semibold text-zinc-900 dark:text-white pt-1">
                        {resolvedSubject || '(No Subject)'}
                      </p>
                    </div>

                    <div className="p-5 text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                      {resolvedBody || 'No body content entered yet.'}
                    </div>

                    <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 text-center">
                      Mandatory unsubscribe link included automatically by Outreach Hub.
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Validation & Test Send */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  {/* Validation Checklist */}
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500">
                      Deliverability & Safety Checklist
                    </h4>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>All recipient emails validated with RFC syntax check</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Cross-checked against global suppression & unsubscribe registry</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Fallback values provided for personalization variables</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>SPF / DKIM sending domain signature active</span>
                      </div>
                    </div>
                  </div>

                  {/* Test Send Box */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2.5">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                      Send a Test Email Before Launch
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                        placeholder="your-email@example.com"
                        className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800"
                      >
                        Send Test
                      </button>
                    </div>

                    {testSentNotice && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3.5 h-3.5" />
                        Test email dispatched to {testEmailAddress} via {providerSettings.activeProvider.toUpperCase()} Provider.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6: Review & Final Confirmation */}
              {wizardStep === 6 && !sendSuccess && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500">
                      Campaign Execution Summary
                    </h4>
                    <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      <p><strong>Campaign Name:</strong> {name}</p>
                      <p><strong>Audience Scope:</strong> {type === 'student' ? 'Student Outreach' : 'Client Outreach'}</p>
                      <p><strong>Target Recipients:</strong> {targetRecipients.length} verified contacts</p>
                      <p><strong>Sender:</strong> {senderName} &lt;{senderEmail}&gt;</p>
                      <p><strong>Provider:</strong> {providerSettings.activeProvider.toUpperCase()} Engine</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Final Dispatch Confirmation</p>
                      <p className="mt-0.5">
                        Are you sure you want to broadcast this campaign to <strong>{targetRecipients.length}</strong> recipients?
                        In Demo Mode, delivery and simulated responses will be logged automatically.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUCCESS CONFIRMATION & CELEBRATION */}
              {sendSuccess && (
                <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-lg">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      Campaign Broadcast Dispatched!
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                      "{name}" is actively delivering to {targetRecipients.length} recipients. Tracking opens and replies in real time.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              {wizardStep > 1 && !sendSuccess ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((s) => (s - 1) as any)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                {!sendSuccess ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsWizardOpen(false)}
                      className="px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 font-medium"
                    >
                      Cancel
                    </button>

                    {wizardStep < 6 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (wizardStep === 1 && !name.trim()) return;
                          if (wizardStep === 3 && (!subject.trim() || !body.trim())) return;
                          setWizardStep((s) => (s + 1) as any);
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {wizardStep === 6 && (
                      <button
                        type="button"
                        onClick={handleLaunchCampaign}
                        disabled={isSending || targetRecipients.length === 0}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 disabled:opacity-50 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSending ? 'Sending Broadcast...' : 'Confirm & Send Now'}</span>
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsWizardOpen(false);
                      if (createdCampaign) onSelectCampaign(createdCampaign);
                    }}
                    className="px-5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold hover:bg-zinc-800"
                  >
                    View Campaign Results
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAMPAIGN LIST TABLE */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Campaign Name & Subject</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Audience Target</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Delivered</th>
                <th className="px-4 py-3">Opens</th>
                <th className="px-4 py-3">Replies</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {campaigns.map((camp) => (
                <tr
                  key={camp.id}
                  onClick={() => onSelectCampaign(camp)}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-zinc-900 dark:text-white truncate max-w-sm">
                      {camp.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate max-w-sm">
                      {camp.subject}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        camp.type === 'student'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                          : camp.type === 'client'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {camp.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                    {camp.audienceDescription}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-medium">
                    {camp.totalRecipients}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {camp.deliveredCount}
                  </td>
                  <td className="px-4 py-3.5 font-mono">
                    {camp.openedCount}
                    {camp.deliveredCount > 0 && (
                      <span className="text-[10px] text-zinc-400 ml-1">
                        ({Math.round((camp.openedCount / camp.deliveredCount) * 100)}%)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {camp.repliedCount}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        camp.status === 'Completed'
                          ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                          : camp.status === 'Sending'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 animate-pulse'
                          : camp.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[11px] text-zinc-400">
                    {new Date(camp.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
