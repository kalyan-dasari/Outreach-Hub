import React, { useState, useMemo } from 'react';
import {
  Inbox,
  MessageSquareReply,
  Eye,
  MousePointerClick,
  Filter,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Search,
  Check,
} from 'lucide-react';
import { EmailEvent, Contact } from '../types';

interface InboxViewProps {
  events: EmailEvent[];
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onUpdateStatus: (contactId: string, status: Contact['status']) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  events,
  contacts,
  onSelectContact,
  onUpdateStatus,
}) => {
  const [filterType, setFilterType] = useState<string>('replied');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesType = filterType === 'all' || e.eventType === filterType;
      const q = searchQuery.toLowerCase().trim();
      const matchesQ =
        !q ||
        e.contactName.toLowerCase().includes(q) ||
        e.contactEmail.toLowerCase().includes(q) ||
        (e.campaignName && e.campaignName.toLowerCase().includes(q)) ||
        (e.details && e.details.toLowerCase().includes(q));
      return matchesType && matchesQ;
    });
  }, [events, filterType, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              Response Center
            </span>
            <span className="text-zinc-400 text-xs">
              {events.filter((e) => e.eventType === 'replied').length} Direct Inbound Replies
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Replies & Activity Inbox
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
            Triage recipient replies immediately. Advance student leads to campus ambassadors and client leads to scheduled discovery meetings.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs w-full sm:w-auto">
          {[
            { id: 'replied', label: 'Replies Only' },
            { id: 'opened', label: 'Opens' },
            { id: 'clicked', label: 'Clicks' },
            { id: 'all', label: 'All Event Logs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                filterType === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search replies or activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* Inbox List Cards */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => {
          const associatedContact = contacts.find(
            (c) => c.id === evt.contactId || c.email.toLowerCase() === evt.contactEmail.toLowerCase()
          );

          return (
            <div
              key={evt.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    evt.eventType === 'replied'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : evt.eventType === 'opened'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {evt.eventType === 'replied' ? (
                    <MessageSquareReply className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {evt.contactName}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      &lt;{evt.contactEmail}&gt;
                    </span>
                    {associatedContact && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                        {associatedContact.contactType}
                      </span>
                    )}
                  </div>

                  <p className="text-zinc-700 dark:text-zinc-300 text-xs">
                    {evt.details}
                  </p>

                  <p className="text-[11px] text-zinc-400">
                    Campaign: <strong>{evt.campaignName || 'Sequence Cadence'}</strong> •{' '}
                    {new Date(evt.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {associatedContact && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(associatedContact.id, 'Interested')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 font-medium"
                    >
                      Mark Interested
                    </button>

                    <button
                      onClick={() => onSelectContact(associatedContact)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 flex items-center gap-1"
                    >
                      <span>Open Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="p-12 text-center text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No events match the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
};
