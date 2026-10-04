import React from 'react';
import {
  X,
  Send,
  Eye,
  MousePointerClick,
  MessageSquareReply,
  ShieldBan,
  Clock,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { Campaign, EmailEvent } from '../types';

interface CampaignDetailModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  events: EmailEvent[];
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  campaign,
  onClose,
  events,
}) => {
  if (!campaign) return null;

  const campaignEvents = events.filter((e) => e.campaignId === campaign.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {campaign.name}
              </h3>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  campaign.type === 'student'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                }`}
              >
                {campaign.type}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Audience: {campaign.audienceDescription} • Dispatched on {new Date(campaign.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Performance KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Delivered
              </span>
              <p className="text-xl font-bold font-mono text-zinc-900 dark:text-white mt-1">
                {campaign.deliveredCount} / {campaign.totalRecipients}
              </p>
              <span className="text-[10px] text-emerald-600 font-medium">100% successful</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Open Rate
              </span>
              <p className="text-xl font-bold font-mono text-zinc-900 dark:text-white mt-1">
                {campaign.deliveredCount > 0
                  ? Math.round((campaign.openedCount / campaign.deliveredCount) * 100)
                  : 0}
                %
              </p>
              <span className="text-[10px] text-zinc-500">{campaign.openedCount} opens</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Click Rate
              </span>
              <p className="text-xl font-bold font-mono text-zinc-900 dark:text-white mt-1">
                {campaign.deliveredCount > 0
                  ? Math.round((campaign.clickedCount / campaign.deliveredCount) * 100)
                  : 0}
                %
              </p>
              <span className="text-[10px] text-zinc-500">{campaign.clickedCount} clicks</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Reply Rate
              </span>
              <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                {campaign.deliveredCount > 0
                  ? Math.round((campaign.repliedCount / campaign.deliveredCount) * 100)
                  : 0}
                %
              </p>
              <span className="text-[10px] text-zinc-500">{campaign.repliedCount} responses</span>
            </div>
          </div>

          {/* Email Template Preview */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 space-y-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Campaign Content
            </span>
            <div className="space-y-1 text-xs">
              <p className="text-zinc-500">
                <strong>Sender:</strong> {campaign.fromName} &lt;{campaign.fromEmail}&gt;
              </p>
              <p className="font-bold text-zinc-900 dark:text-white">
                Subject: {campaign.subject}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 whitespace-pre-wrap font-sans leading-relaxed text-zinc-800 dark:text-zinc-200 mt-2">
              {campaign.body}
            </div>
          </div>

          {/* Event Stream */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Recent Activity Logs for this Broadcast
            </span>
            <div className="space-y-1.5">
              {campaignEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        evt.eventType === 'replied'
                          ? 'bg-amber-500'
                          : evt.eventType === 'opened'
                          ? 'bg-indigo-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {evt.contactName}
                    </span>
                    <span className="text-zinc-500 text-[11px]">{evt.details}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}

              {campaignEvents.length === 0 && (
                <p className="text-zinc-400 text-xs py-2">No event logs recorded for this campaign.</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end bg-zinc-50/50 dark:bg-zinc-800/30">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
