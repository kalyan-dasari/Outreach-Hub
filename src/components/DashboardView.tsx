import React from 'react';
import {
  Users,
  GraduationCap,
  Briefcase,
  Send,
  MailCheck,
  Eye,
  MousePointerClick,
  MessageSquareReply,
  ShieldBan,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  Plus,
  CheckCircle2,
  UploadCloud,
  FileText,
} from 'lucide-react';
import { Campaign, Contact, EmailEvent } from '../types';
import { NavigationTab } from '../types';

interface DashboardViewProps {
  contacts: Contact[];
  campaigns: Campaign[];
  events: EmailEvent[];
  suppressionCount: number;
  onNavigate: (tab: NavigationTab) => void;
  onSelectCampaign: (campaign: Campaign) => void;
  onOpenImportModal?: (defaultType?: 'Student' | 'Client Lead') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  contacts,
  campaigns,
  events,
  suppressionCount,
  onNavigate,
  onSelectCampaign,
  onOpenImportModal,
}) => {
  // Aggregate Metrics
  const totalContacts = contacts.length;
  const studentContacts = contacts.filter((c) => c.contactType === 'Student').length;
  const clientLeads = contacts.filter((c) => c.contactType === 'Client Lead').length;

  const totalSent = campaigns.reduce((acc, c) => acc + (c.deliveredCount || 0) + (c.bouncedCount || 0), 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + (c.deliveredCount || 0), 0);
  const totalOpened = campaigns.reduce((acc, c) => acc + (c.openedCount || 0), 0);
  const totalClicked = campaigns.reduce((acc, c) => acc + (c.clickedCount || 0), 0);
  const totalReplied = campaigns.reduce((acc, c) => acc + (c.repliedCount || 0), 0);
  const totalBounced = campaigns.reduce((acc, c) => acc + (c.bouncedCount || 0), 0);

  const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : '98.5';
  const openRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : '64.2';
  const replyRate = totalDelivered > 0 ? ((totalReplied / totalDelivered) * 100).toFixed(1) : '9.8';
  const bounceRate = totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(1) : '1.5';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-700 text-zinc-200">
              Bulk Outreach OS
            </span>
            <span className="text-zinc-400 text-xs">• Active & Ready</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Outreach Hub Overview
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
            Streamlined platform for sending bulk emails to students and client prospects with dynamic templates and live telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('students')}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Students ({studentContacts})</span>
          </button>
          <button
            onClick={() => onNavigate('clients')}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Clients ({clientLeads})</span>
          </button>
          <button
            onClick={() => onNavigate('create-campaign')}
            className="px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Bulk Send Email</span>
          </button>
        </div>
      </div>

      {/* QUICK ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Student Outreach */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
              {studentContacts} Students
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
              Student Outreach
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Send hackathons, internships & campus opportunities to student batches.
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <button
              onClick={() => onNavigate('students')}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              View Students
            </button>
            {onOpenImportModal && (
              <button
                onClick={() => onOpenImportModal('Student')}
                className="py-1.5 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                title="Import Students CSV"
              >
                <UploadCloud className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Client Outreach */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
              {clientLeads} Leads
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
              Client Outreach
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Pitch bespoke services, audits and offers to decision-makers.
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <button
              onClick={() => onNavigate('clients')}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              View Pipeline
            </button>
            {onOpenImportModal && (
              <button
                onClick={() => onOpenImportModal('Client Lead')}
                className="py-1.5 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                title="Import Clients CSV"
              >
                <UploadCloud className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Bulk Email Composer */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {campaigns.length} Sent
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
              Bulk Email Sender
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Target filtered recipients with real merge tags and live preview.
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => onNavigate('create-campaign')}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Launch Bulk Mailer
            </button>
          </div>
        </div>

        {/* Card 4: Templates Library */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
              Ready Copy
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
              Email Templates
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Personalized merge tags like firstName, college, company, and role.
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => onNavigate('templates')}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Explore Templates
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Total Audience</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {totalContacts}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-500">
            <span>{studentContacts} Students</span>
            <span>•</span>
            <span>{clientLeads} Clients</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Emails Sent</span>
            <Send className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {totalSent.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <MailCheck className="w-3 h-3" />
            <span>{deliveryRate}% Delivery Rate</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Open Rate</span>
            <Eye className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {openRate}%
          </p>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-zinc-500">
            <span>{totalOpened} Unique Opens</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Reply Rate</span>
            <MessageSquareReply className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {replyRate}%
          </p>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            <span>{totalReplied} Responses</span>
          </div>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Recent Outreach Campaigns
            </h3>
            <p className="text-xs text-zinc-500">
              Delivery telemetry and conversion across student and client broadcasts
            </p>
          </div>
          <button
            onClick={() => onNavigate('campaigns')}
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <span>View All Campaigns</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-semibold border-y border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Target Audience</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Delivered</th>
                <th className="px-4 py-3">Opens</th>
                <th className="px-4 py-3">Replies</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {campaigns.slice(0, 5).map((camp) => (
                <tr
                  key={camp.id}
                  onClick={() => onSelectCampaign(camp)}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-zinc-900 dark:text-white truncate max-w-xs">
                      {camp.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate max-w-xs">
                      {camp.subject}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                        camp.type === 'student'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                          : camp.type === 'client'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {camp.type === 'student' ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                      <span>{camp.type === 'student' ? 'Student' : camp.type === 'client' ? 'Client' : 'General'}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 max-w-[180px] truncate">
                    {camp.audienceDescription}
                  </td>
                  <td className="px-4 py-3 font-mono font-medium">
                    {camp.totalRecipients}
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {camp.deliveredCount}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {camp.openedCount}{' '}
                    {camp.deliveredCount > 0 && (
                      <span className="text-[10px] text-zinc-400">
                        ({Math.round((camp.openedCount / camp.deliveredCount) * 100)}%)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-amber-600 dark:text-amber-400">
                    {camp.repliedCount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        camp.status === 'Completed'
                          ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                          : camp.status === 'Sending'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 animate-pulse'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {camp.status}
                    </span>
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
