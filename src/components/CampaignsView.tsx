import React, { useState, useMemo, useEffect } from 'react';
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
  GraduationCap,
  Briefcase,
  Mail,
  Zap,
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
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState<Campaign | null>(null);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // STEP 1: Campaign details & audience
  const [name, setName] = useState('');
  const [type, setType] = useState<'student' | 'client' | 'general'>('student');
  const [senderName, setSenderName] = useState('Outreach Team');
  const [senderEmail, setSenderEmail] = useState('outreach@hub.io');
  const [replyTo, setReplyTo] = useState('outreach@hub.io');

  // Filters for target audience
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  // STEP 2: Content & Template
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // STEP 3: Preview & Test
  const [previewContactId, setPreviewContactId] = useState<string>('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [testEmailAddress, setTestEmailAddress] = useState('test@example.com');
  const [testSentNotice, setTestSentNotice] = useState(false);

  useEffect(() => {
    if (initialWizardOpen) {
      setIsWizardOpen(true);
      setWizardStep(1);
    }
  }, [initialWizardOpen]);

  // Unique colleges & departments
  const collegeList = useMemo(() => {
    const set = new Set<string>();
    contacts.filter((c) => c.contactType === 'Student').forEach((c) => c.college && set.add(c.college));
    return Array.from(set);
  }, [contacts]);

  const deptList = useMemo(() => {
    const set = new Set<string>();
    contacts.filter((c) => c.contactType === 'Student').forEach((c) => c.department && set.add(c.department));
    return Array.from(set);
  }, [contacts]);

  const batchList = useMemo(() => {
    const set = new Set<string>();
    contacts.filter((c) => c.contactType === 'Student').forEach((c) => c.batch && set.add(c.batch));
    return Array.from(set);
  }, [contacts]);

  const industryList = useMemo(() => {
    const set = new Set<string>();
    contacts.filter((c) => c.contactType === 'Client Lead').forEach((c) => c.industry && set.add(c.industry));
    return Array.from(set);
  }, [contacts]);

  // Filter Target Audience dynamically
  const targetRecipients = useMemo(() => {
    return contacts.filter((c) => {
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
        if (selectedIndustry !== 'all' && c.industry !== selectedIndustry) return false;
        return true;
      }

      return true;
    });
  }, [contacts, type, selectedCollege, selectedDept, selectedBatch, selectedLeadStatus, selectedIndustry, suppressedEmails]);

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

  const insertToken = (token: string) => {
    setBody((prev) => prev + ` {{${token}}}`);
  };

  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const found = templates.find((t) => t.id === tplId);
    if (found) {
      setSubject(found.subject);
      setPreheader(found.preheader || '');
      setBody(found.body);
    }
  };

  const handleLaunchCampaign = async () => {
    setIsSending(true);
    setSendingProgress(10);

    const interval = setInterval(() => {
      setSendingProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 20;
      });
    }, 250);

    try {
      const campaign = await onSendCampaign({
        name: name.trim() || `${type === 'student' ? 'Student' : 'Client'} Bulk Outreach - ${new Date().toLocaleDateString()}`,
        type,
        subject: subject.trim(),
        preheader: preheader.trim() || undefined,
        body: body.trim(),
        fromName: senderName.trim(),
        fromEmail: senderEmail.trim(),
        replyTo: replyTo.trim() || undefined,
        audienceDescription:
          type === 'student'
            ? `Students (${selectedCollege !== 'all' ? selectedCollege : 'All Campuses'})`
            : type === 'client'
            ? `Client Leads (${selectedIndustry !== 'all' ? selectedIndustry : 'All Industries'})`
            : 'All Directory Contacts',
        totalRecipients: targetRecipients.length,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        repliedCount: 0,
        bouncedCount: 0,
        unsubscribedCount: 0,
      });

      clearInterval(interval);
      setSendingProgress(100);
      setCreatedCampaign(campaign);
      setSendSuccess(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTestEmail = () => {
    setTestSentNotice(true);
    setTimeout(() => setTestSentNotice(false), 3000);
  };

  const handleOpenNewWizard = (prefillType?: 'student' | 'client') => {
    if (prefillType) setType(prefillType);
    setName('');
    setSubject('');
    setPreheader('');
    setBody('');
    setSelectedTemplateId('');
    setSendSuccess(false);
    setSendingProgress(0);
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesType = filterType === 'all' || c.type === filterType;
      const q = searchQuery.toLowerCase().trim();
      const matchesQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.audienceDescription.toLowerCase().includes(q);
      return matchesType && matchesQ;
    });
  }, [campaigns, filterType, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Bulk Email Engine
            </span>
            <span className="text-zinc-400 text-xs">
              {campaigns.length} Total Campaigns Broadcasted
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Bulk Mail & Campaign Manager
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
            Compose and broadcast high-deliverability bulk emails to students and client leads with live merge tags and telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleOpenNewWizard('student')}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Bulk Mail Students</span>
          </button>

          <button
            onClick={() => handleOpenNewWizard('client')}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Bulk Mail Clients</span>
          </button>

          <button
            onClick={() => handleOpenNewWizard()}
            className="px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns by name, subject, or audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            All ({campaigns.length})
          </button>
          <button
            onClick={() => setFilterType('student')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'student'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setFilterType('client')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'client'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Clients
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map((camp) => {
          const isStudent = camp.type === 'student';
          const openRate = camp.deliveredCount > 0 ? ((camp.openedCount / camp.deliveredCount) * 100).toFixed(0) : '0';
          const replyRate = camp.deliveredCount > 0 ? ((camp.repliedCount / camp.deliveredCount) * 100).toFixed(0) : '0';

          return (
            <div
              key={camp.id}
              onClick={() => onSelectCampaign(camp)}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isStudent
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}
                  >
                    {isStudent ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                    <span>{camp.type.toUpperCase()} OUTREACH</span>
                  </span>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {camp.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">
                  {camp.name}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                  Subject: {camp.subject}
                </p>
                <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{camp.audienceDescription}</span>
                </p>
              </div>

              {/* Stats Bar */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
                  <p className="font-bold font-mono text-zinc-900 dark:text-white">
                    {camp.deliveredCount || camp.totalRecipients}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium">Delivered</p>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
                  <p className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {openRate}%
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium">Open Rate</p>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
                  <p className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {replyRate}%
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium">Reply Rate</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="py-16 text-center text-zinc-400 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-medium">No outreach campaigns found</p>
          <button
            onClick={() => handleOpenNewWizard()}
            className="mt-3 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
          >
            Create Your First Campaign
          </button>
        </div>
      )}

      {/* 4-STEP STREAMLINED BULK MAILER MODAL */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => !isSending && setIsWizardOpen(false)}
          />
          <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    Step {wizardStep} of 4:
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {wizardStep === 1 && 'Audience & Campaign Setup'}
                    {wizardStep === 2 && 'Template & Email Content'}
                    {wizardStep === 3 && 'Live Recipient Preview & Test'}
                    {wizardStep === 4 && 'Sending & Delivery Status'}
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all ${
                        s < wizardStep
                          ? 'w-10 bg-zinc-900 dark:bg-white'
                          : s === wizardStep
                          ? 'w-16 bg-indigo-600'
                          : 'w-10 bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {!isSending && (
                <button
                  onClick={() => setIsWizardOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Step Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 text-xs space-y-4">
              {/* STEP 1: Audience & Identity */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  {/* Category Type */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                      Target Audience Category
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'student', title: 'Students Outreach', desc: 'Internships, campus updates & notices', icon: GraduationCap },
                        { id: 'client', title: 'Client Leads', desc: 'B2B pitches & tailored offers', icon: Briefcase },
                        { id: 'general', title: 'All Directory Contacts', desc: 'Broad announcements to all', icon: Users },
                      ].map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setType(t.id as any)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              type === t.id
                                ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-900 dark:ring-white'
                                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 font-bold text-zinc-900 dark:text-white">
                              <Icon className="w-4 h-4 text-indigo-500" />
                              <span>{t.title}</span>
                            </div>
                            <p className="text-[11px] text-zinc-500">{t.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter Sub-Options */}
                  {type === 'student' && (
                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                        Target Student Filters
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-zinc-500 block mb-1">Campus / College</label>
                          <select
                            value={selectedCollege}
                            onChange={(e) => setSelectedCollege(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                          >
                            <option value="all">All Campuses</option>
                            {collegeList.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-500 block mb-1">Department</label>
                          <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                          >
                            <option value="all">All Departments</option>
                            {deptList.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-500 block mb-1">Batch</label>
                          <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                          >
                            <option value="all">All Batches</option>
                            {batchList.map((b) => (
                              <option key={b} value={b}>Batch {b}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'client' && (
                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                        Target Client Filters
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-zinc-500 block mb-1">Pipeline Stage</label>
                          <select
                            value={selectedLeadStatus}
                            onChange={(e) => setSelectedLeadStatus(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                          >
                            <option value="all">All Stages</option>
                            <option value="New">New</option>
                            <option value="Researched">Researched</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Interested">Interested</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-500 block mb-1">Industry</label>
                          <select
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                          >
                            <option value="all">All Industries</option>
                            {industryList.map((i) => (
                              <option key={i} value={i}>{i}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recipient Count Pill */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-semibold text-zinc-900 dark:text-white">
                        Target Audience:
                      </span>
                    </div>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {targetRecipients.length} recipients selected
                    </span>
                  </div>

                  {/* Campaign Name & Sender Details */}
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                        Campaign Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stanford Tech Hackathon Invitation or Q4 Enterprise Offer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                          From Name
                        </label>
                        <input
                          type="text"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                          From Email Address
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
                </div>
              )}

              {/* STEP 2: Content & Templates */}
              {wizardStep === 2 && (
                <div className="space-y-3.5">
                  {/* Template Picker */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                      Choose Ready Template (Optional):
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                      {templates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => handleSelectTemplate(tpl.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            selectedTemplateId === tpl.id
                              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                              : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {tpl.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Subject Line *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Invitation: {{college}} Hackathon 2026 or Quick question regarding {{organization}}"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none font-medium"
                    />
                  </div>

                  {/* Variable Tokens Chip Bar */}
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[11px] font-semibold text-zinc-500 block mb-1.5">
                      Insert Variable Tags (click to add into body):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'firstName',
                        'lastName',
                        'college',
                        'department',
                        'batch',
                        'course',
                        'rollNumber',
                        'organization',
                        'role',
                        'city',
                        'personalObservation',
                        'assignedOffer',
                      ].map((tok) => (
                        <button
                          key={tok}
                          type="button"
                          onClick={() => insertToken(tok)}
                          className="px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 font-mono text-[10px] text-zinc-800 dark:text-zinc-200 hover:border-zinc-500 cursor-pointer"
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
                      placeholder="Hi {{firstName}},\n\nWe would love to invite you to our upcoming campus drive at {{college}}..."
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none font-sans text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Preview with Live Data & Test */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        Preview recipient:
                      </span>
                      <select
                        value={previewContact?.id || ''}
                        onChange={(e) => setPreviewContactId(e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium outline-none"
                      >
                        {targetRecipients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.firstName} {c.lastName} ({c.college || c.organization || c.email})
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

                  {/* Rendered Email Mockup */}
                  <div
                    className={`mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md overflow-hidden transition-all ${
                      previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'
                    }`}
                  >
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

                    <div className="p-5 text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed min-h-[160px]">
                      {resolvedBody || 'No email body provided.'}
                    </div>

                    <div className="p-2.5 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 text-center">
                      Mandatory unsubscribe option included automatically.
                    </div>
                  </div>

                  {/* Test Send Box */}
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">Send Test Email</span>
                      <p className="text-[11px] text-zinc-500">Send a sample test message to verify formatting</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        className="px-3 py-1 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold cursor-pointer"
                      >
                        {testSentNotice ? 'Sent!' : 'Send Test'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Sending & Telemetry */}
              {wizardStep === 4 && (
                <div className="space-y-6 text-center py-4">
                  {!sendSuccess ? (
                    <div className="space-y-4">
                      <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                        <Send className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                          Ready to Send Bulk Campaign
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          You are about to broadcast this email to <strong>{targetRecipients.length}</strong> recipients.
                        </p>
                      </div>

                      {isSending && (
                        <div className="max-w-md mx-auto space-y-2">
                          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${sendingProgress}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            Dispatching personalized messages via {providerSettings.activeProvider.toUpperCase()} provider...
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                          Outreach Campaign Sent Successfully!
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          Dispatched {targetRecipients.length} personalized messages. Real-time telemetry is now tracking opens and replies.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Controls */}
            <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              {wizardStep > 1 && !sendSuccess && !isSending ? (
                <button
                  onClick={() => setWizardStep((s) => (s - 1) as any)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                {!sendSuccess && !isSending && (
                  <button
                    onClick={() => setIsWizardOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                {wizardStep === 1 && (
                  <button
                    onClick={() => setWizardStep(2)}
                    disabled={targetRecipients.length === 0}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next: Content & Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {wizardStep === 2 && (
                  <button
                    onClick={() => setWizardStep(3)}
                    disabled={!subject.trim() || !body.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next: Preview & Test</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {wizardStep === 3 && (
                  <button
                    onClick={() => setWizardStep(4)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 cursor-pointer"
                  >
                    <span>Proceed to Send</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {wizardStep === 4 && !sendSuccess && (
                  <button
                    onClick={handleLaunchCampaign}
                    disabled={isSending}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Bulk Email Now ({targetRecipients.length})</span>
                  </button>
                )}

                {sendSuccess && (
                  <button
                    onClick={() => setIsWizardOpen(false)}
                    className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer"
                  >
                    Done & View Campaigns
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
