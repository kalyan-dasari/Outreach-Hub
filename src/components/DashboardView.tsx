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
} from 'lucide-react';
import { Campaign, Contact, EmailEvent } from '../types';
import { NavigationTab } from './Sidebar';

interface DashboardViewProps {
  contacts: Contact[];
  campaigns: Campaign[];
  events: EmailEvent[];
  suppressionCount: number;
  onNavigate: (tab: NavigationTab) => void;
  onSelectCampaign: (campaign: Campaign) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  contacts,
  campaigns,
  events,
  suppressionCount,
  onNavigate,
  onSelectCampaign,
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
  const clickRate = totalDelivered > 0 ? ((totalClicked / totalDelivered) * 100).toFixed(1) : '31.4';
  const replyRate = totalDelivered > 0 ? ((totalReplied / totalDelivered) * 100).toFixed(1) : '9.8';
  const bounceRate = totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(1) : '1.5';

  // Demo chart sparkline data for emails sent over time
  const timelineData = [
    { day: 'Mon', sent: 120, opened: 78, replied: 12 },
    { day: 'Tue', sent: 210, opened: 145, replied: 22 },
    { day: 'Wed', sent: 340, opened: 230, replied: 34 },
    { day: 'Thu', sent: 180, opened: 122, replied: 18 },
    { day: 'Fri', sent: 290, opened: 195, replied: 28 },
    { day: 'Sat', sent: 90, opened: 54, replied: 6 },
    { day: 'Sun', sent: 140, opened: 92, replied: 14 },
  ];

  const maxSent = Math.max(...timelineData.map((d) => d.sent));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-700 text-zinc-200">
              Private Outreach OS
            </span>
            <span className="text-zinc-400 text-xs">• Sandbox Active</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Outreach Hub Overview
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
            Coordinating legitimate campus student announcements and personalized client lead campaigns with real-time delivery telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('students')}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Student Outreach</span>
          </button>
          <button
            onClick={() => onNavigate('clients')}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Client Pipeline</span>
          </button>
          <button
            onClick={() => onNavigate('create-campaign')}
            className="px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Total Contacts</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {totalContacts}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-500">
            <span>{studentContacts} Students</span>
            <span>•</span>
            <span>{clientLeads} Leads</span>
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
            <span>{deliveryRate}% Delivered</span>
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
            <span>{totalReplied} Direct Responses</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Suppression / Bounces</span>
            <ShieldBan className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {suppressionCount}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-zinc-500">
            <span>{bounceRate}% Bounce Rate</span>
          </div>
        </div>
      </div>

      {/* Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emails Sent Over Time (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Outreach Velocity (7 Days)
              </h3>
              <p className="text-xs text-zinc-500">
                Daily volume of sent messages and recipient interactions
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-zinc-900 dark:bg-white" /> Sent
              </span>
              <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Opened
              </span>
              <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" /> Replied
              </span>
            </div>
          </div>

          {/* Bar Visualizer */}
          <div className="pt-4 h-48 flex items-end justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            {timelineData.map((d) => {
              const heightPct = Math.round((d.sent / maxSent) * 100);
              const openPct = Math.round((d.opened / maxSent) * 100);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    {d.sent} sent • {d.opened} opens • {d.replied} replies
                  </div>

                  <div className="w-full max-w-[36px] flex items-end gap-1 h-full">
                    {/* Sent Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="flex-1 bg-zinc-800 dark:bg-zinc-200 rounded-t-sm transition-all duration-300 group-hover:bg-zinc-900"
                    />
                    {/* Opened Bar */}
                    <div
                      style={{ height: `${openPct}%` }}
                      className="flex-1 bg-emerald-500 rounded-t-sm transition-all duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-500">{d.day}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
              <span className="text-zinc-400 text-[11px]">Average Open Rate</span>
              <p className="font-bold text-zinc-900 dark:text-white mt-0.5">64.2%</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
              <span className="text-zinc-400 text-[11px]">Click-to-Open</span>
              <p className="font-bold text-zinc-900 dark:text-white mt-0.5">48.9%</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
              <span className="text-zinc-400 text-[11px]">Reply Conversion</span>
              <p className="font-bold text-amber-600 dark:text-amber-400 mt-0.5">9.8%</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed (1 col) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Live Activity Feed
              </h3>
              <p className="text-xs text-zinc-500">Real-time webhook events</p>
            </div>
            <button
              onClick={() => onNavigate('inbox')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Inbox
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 max-h-80 pr-1">
            {events.slice(0, 6).map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 text-xs space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded ${
                      evt.eventType === 'replied'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : evt.eventType === 'opened'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                        : evt.eventType === 'clicked'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {evt.eventType}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {evt.contactName}
                </p>
                <p className="text-zinc-500 text-[11px] truncate">
                  {evt.details || evt.campaignName}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Recent Campaigns
            </h3>
            <p className="text-xs text-zinc-500">
              Delivery telemetry and conversion across student and client broadcasts
            </p>
          </div>
          <button
            onClick={() => onNavigate('campaigns')}
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
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
                <th className="px-4 py-3">Audience</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Delivered</th>
                <th className="px-4 py-3">Opens</th>
                <th className="px-4 py-3">Clicks</th>
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
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        camp.type === 'student'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                          : camp.type === 'client'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {camp.type === 'student' ? 'Student' : camp.type === 'client' ? 'Client' : 'General'}
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
                  <td className="px-4 py-3 font-mono">
                    {camp.clickedCount}
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
                          : camp.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
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
