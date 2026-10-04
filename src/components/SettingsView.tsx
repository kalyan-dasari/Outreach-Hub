import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Server,
  Globe,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Key,
  ExternalLink,
  Sparkles,
  Sun,
  Moon,
  Palette,
  Sliders,
} from 'lucide-react';
import { ProviderSettings, SendingDomain } from '../types';

interface SettingsViewProps {
  settings: ProviderSettings;
  onUpdateSettings: (settings: Partial<ProviderSettings>) => void;
  onResetDemoData: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetDemoData,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'provider' | 'domains' | 'appearance'>('provider');
  const [activeProvider, setActiveProvider] = useState(settings.activeProvider || 'mock');
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [domains, setDomains] = useState<SendingDomain[]>(settings.sendingDomains || []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(key);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleSaveProvider = (providerId: ProviderSettings['activeProvider']) => {
    setActiveProvider(providerId);
    onUpdateSettings({ activeProvider: providerId });
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;
    const cleanDomain = newDomainInput.trim().toLowerCase().replace(/^https?:\/\//, '');

    const newDom: SendingDomain = {
      id: `dom_${Date.now()}`,
      domain: cleanDomain,
      spfStatus: 'Verified',
      dkimStatus: 'Pending',
      dmarcStatus: 'Verified',
      verified: false,
    };

    const updated = [...domains, newDom];
    setDomains(updated);
    onUpdateSettings({ sendingDomains: updated });
    setNewDomainInput('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Infrastructure & Deliverability
            </span>
            <span className="text-zinc-400 text-xs">
              Active: {activeProvider.toUpperCase()} Provider
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Settings & Provider Abstraction
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
            Configure pluggable email dispatch engines, authenticate SPF/DKIM sending domains, and manage sandbox simulation environments.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset Outreach Hub sandbox to default demo seed data?')) {
              onResetDemoData();
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-200 text-xs font-semibold transition-colors self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Sandbox</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs w-fit">
        <button
          onClick={() => setActiveTab('provider')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'provider'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Email Providers</span>
        </button>

        <button
          onClick={() => setActiveTab('domains')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'domains'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Sending Domains & DNS</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'appearance'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme & Interface</span>
        </button>
      </div>

      {/* TAB 1: PROVIDER ABSTRACTION */}
      {activeTab === 'provider' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-xs">
            <span className="font-bold text-zinc-900 dark:text-white block mb-1">
              Pluggable Email Architecture
            </span>
            <p className="text-zinc-500 leading-relaxed">
              Outreach Hub uses a unified provider adapter interface. When transitioning from demo testing to production, simply switch to Resend, Amazon SES, or SendGrid by setting your environment variables in <code>.env</code> on the server side.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mock Provider (Default) */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                activeProvider === 'mock'
                  ? 'border-indigo-600 dark:border-indigo-400 bg-white dark:bg-zinc-900 shadow-md ring-1 ring-indigo-500'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Mock Development Provider
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  DEMO SAFE
                </span>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                Simulates real-world delivery latency, open webhooks, click tracking, and reply generation locally. Ideal for risk-free student and client flow testing without sending unsolicited live messages.
              </p>

              <button
                onClick={() => handleSaveProvider('mock')}
                disabled={activeProvider === 'mock'}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 disabled:opacity-50"
              >
                {activeProvider === 'mock' ? 'Currently Active Provider' : 'Switch to Mock Engine'}
              </button>
            </div>

            {/* Resend Provider */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                activeProvider === 'resend'
                  ? 'border-indigo-600 dark:border-indigo-400 bg-white dark:bg-zinc-900 shadow-md ring-1 ring-indigo-500'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Resend API
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  Production Ready
                </span>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                Modern developer-first email platform with first-class deliverability, dedicated IPs, and webhook event streaming.
              </p>

              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 mb-3">
                RESEND_API_KEY=re_123456789
              </div>

              <button
                onClick={() => handleSaveProvider('resend')}
                className="w-full py-2 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              >
                {activeProvider === 'resend' ? 'Currently Active' : 'Select Resend'}
              </button>
            </div>

            {/* Amazon SES */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                activeProvider === 'ses'
                  ? 'border-indigo-600 dark:border-indigo-400 bg-white dark:bg-zinc-900 shadow-md ring-1 ring-indigo-500'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Amazon SES
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  High Volume
                </span>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                Enterprise cloud email infrastructure designed for large university alumni rosters and scalable broadcasts at low cost.
              </p>

              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 mb-3">
                AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY
              </div>

              <button
                onClick={() => handleSaveProvider('ses')}
                className="w-full py-2 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              >
                {activeProvider === 'ses' ? 'Currently Active' : 'Select Amazon SES'}
              </button>
            </div>

            {/* SendGrid */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                activeProvider === 'sendgrid'
                  ? 'border-indigo-600 dark:border-indigo-400 bg-white dark:bg-zinc-900 shadow-md ring-1 ring-indigo-500'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Twilio SendGrid
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  Standard
                </span>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                Widely adopted transactional & marketing email engine with comprehensive suppression and event webhook management.
              </p>

              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 mb-3">
                SENDGRID_API_KEY=SG.123456789
              </div>

              <button
                onClick={() => handleSaveProvider('sendgrid')}
                className="w-full py-2 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              >
                {activeProvider === 'sendgrid' ? 'Currently Active' : 'Select SendGrid'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SENDING DOMAINS & DNS */}
      {activeTab === 'domains' && (
        <div className="space-y-6">
          {/* Add Domain Bar */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Connect Sending Domain
            </h3>
            <p className="text-xs text-zinc-500">
              Authenticate your outreach domain with SPF, DKIM, and DMARC to guarantee high inbox placement and avoid spam classification.
            </p>

            <form onSubmit={handleAddDomain} className="flex gap-2 max-w-md pt-1">
              <input
                type="text"
                placeholder="e.g. outreachhub.io or campusmail.edu"
                value={newDomainInput}
                onChange={(e) => setNewDomainInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-xl text-xs font-bold hover:bg-zinc-800"
              >
                Add Domain
              </button>
            </form>
          </div>

          {/* Domain DNS Cards */}
          <div className="space-y-4">
            {domains.map((dom) => (
              <div
                key={dom.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">
                      {dom.domain}
                    </span>
                    {dom.verified ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Fully Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-semibold text-[10px] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Setup In Progress
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = domains.map((d) =>
                          d.id === dom.id
                            ? { ...d, spfStatus: 'Verified' as const, dkimStatus: 'Verified' as const, verified: true }
                            : d
                        );
                        setDomains(updated);
                        onUpdateSettings({ sendingDomains: updated });
                      }}
                      className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                    >
                      Re-check DNS Records
                    </button>
                  </div>
                </div>

                {/* DNS Records Table */}
                <div className="space-y-2">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                    Required DNS Entries for {dom.domain}:
                  </span>

                  {/* SPF Record */}
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-white">SPF (TXT)</span>
                        <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> {dom.spfStatus}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-zinc-500 mt-1">
                        Host: @ • Value: v=spf1 include:mailgun.org ~all
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy('v=spf1 include:mailgun.org ~all', `spf_${dom.id}`)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
                    >
                      {copiedRecord === `spf_${dom.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* DKIM Record */}
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-white">DKIM (CNAME)</span>
                        <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${dom.dkimStatus === 'Verified' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {dom.dkimStatus === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />} {dom.dkimStatus}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-zinc-500 mt-1">
                        Host: k1._domainkey • Value: dkim.outreachhub.io
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy('dkim.outreachhub.io', `dkim_${dom.id}`)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
                    >
                      {copiedRecord === `dkim_${dom.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* DMARC Record */}
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-white">DMARC (TXT)</span>
                        <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> {dom.dmarcStatus}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-zinc-500 mt-1">
                        Host: _dmarc • Value: v=DMARC1; p=none; rua=mailto:dmarc@{dom.domain}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(`v=DMARC1; p=none; rua=mailto:dmarc@${dom.domain}`, `dmarc_${dom.id}`)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
                    >
                      {copiedRecord === `dmarc_${dom.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* TAB 3: THEME & INTERFACE */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-xs">
            <span className="font-bold text-zinc-900 dark:text-white block mb-1">
              Visual Theme & Accessibility
            </span>
            <p className="text-zinc-500 leading-relaxed">
              Switch between High-Contrast Dark Mode and Crisp Studio Light Mode. Preferences are saved automatically to your browser session and persist across visits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light Mode Option Card */}
            <div
              onClick={() => {
                if (darkMode && onToggleDarkMode) onToggleDarkMode();
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                !darkMode
                  ? 'bg-white border-zinc-900 shadow-md ring-2 ring-zinc-900/10'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                      Studio Light Mode
                    </h3>
                    <p className="text-xs text-zinc-500">Crisp high-contrast daylight</p>
                  </div>
                </div>
                {!darkMode && (
                  <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-white text-[10px] font-bold">
                    Active
                  </span>
                )}
              </div>

              {/* Mini Mock UI Preview */}
              <div className="p-3 rounded-xl bg-zinc-100 border border-zinc-200 space-y-2 pointer-events-none">
                <div className="flex items-center justify-between">
                  <div className="h-2 w-16 bg-zinc-300 rounded" />
                  <div className="h-2 w-6 bg-zinc-400 rounded" />
                </div>
                <div className="h-8 bg-white rounded-lg border border-zinc-200 flex items-center px-2">
                  <div className="h-2 w-24 bg-zinc-200 rounded" />
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (darkMode && onToggleDarkMode) onToggleDarkMode();
                }}
                className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  !darkMode
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {!darkMode ? 'Current Theme (Active)' : 'Switch to Light Mode'}
              </button>
            </div>

            {/* Dark Mode Option Card */}
            <div
              onClick={() => {
                if (!darkMode && onToggleDarkMode) onToggleDarkMode();
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                darkMode
                  ? 'bg-zinc-900 border-zinc-100 shadow-md ring-2 ring-zinc-100/10'
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-500">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                      Deep Dark Mode
                    </h3>
                    <p className="text-xs text-zinc-500">Low-glare twilight palette</p>
                  </div>
                </div>
                {darkMode && (
                  <span className="px-2 py-0.5 rounded-full bg-white text-zinc-900 text-[10px] font-bold">
                    Active
                  </span>
                )}
              </div>

              {/* Mini Mock UI Preview */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 pointer-events-none">
                <div className="flex items-center justify-between">
                  <div className="h-2 w-16 bg-zinc-700 rounded" />
                  <div className="h-2 w-6 bg-zinc-600 rounded" />
                </div>
                <div className="h-8 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center px-2">
                  <div className="h-2 w-24 bg-zinc-700 rounded" />
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!darkMode && onToggleDarkMode) onToggleDarkMode();
                }}
                className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  darkMode
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {darkMode ? 'Current Theme (Active)' : 'Switch to Dark Mode'}
              </button>
            </div>
          </div>

          {/* Premium Scrollbar Showcase & Tester */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-500" />
                  <span>Sleek Premium Scrollbars</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Ultra-slim 6px rounded capsule scrollbars with smooth hover elevation and native hardware acceleration.
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                Active Worldwide
              </span>
            </div>

            {/* Interactive Scrollbar Playground */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-medium text-zinc-500 block mb-2">
                Live Scrollbar Test Box (Scroll vertically or horizontally):
              </span>
              <div className="max-h-28 overflow-y-auto overflow-x-auto custom-scrollbar p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
                <p>✓ Ultra-thin 6px profile eliminates chunky grey browser default bars.</p>
                <p>✓ Automatically harmonizes with both light and dark mode surfaces.</p>
                <p>✓ Translucent hover state (0.35 → 0.60 opacity) provides instant tactile feedback.</p>
                <p>✓ Compatible across Chrome, Safari, Edge, Firefox, and mobile WebKit web views.</p>
                <p>✓ Extended overflow content to test smooth gliding kinetic scrolling.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
