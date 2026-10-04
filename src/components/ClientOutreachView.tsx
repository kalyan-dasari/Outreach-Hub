import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Kanban,
  Table as TableIcon,
  Search,
  Plus,
  ExternalLink,
  Calendar,
  DollarSign,
  MapPin,
  Send,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Contact, LeadStatus } from '../types';

interface ClientOutreachViewProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onUpdateLeadStatus: (contactId: string, status: LeadStatus) => void;
  onLaunchCampaign: () => void;
}

const KANBAN_STAGES: Array<{ id: LeadStatus; label: string; color: string }> = [
  { id: 'New', label: 'New Leads', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
  { id: 'Researched', label: 'Researched', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' },
  { id: 'Follow-up', label: 'Follow-up', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
  { id: 'Replied', label: 'Replied', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { id: 'Interested', label: 'Interested', color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300' },
  { id: 'Meeting', label: 'Meeting / Call', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' },
  { id: 'Proposal', label: 'Proposal Sent', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300' },
  { id: 'Won', label: 'Deals Won', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  { id: 'Lost', label: 'Lost / Closed', color: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400' },
];

export const ClientOutreachView: React.FC<ClientOutreachViewProps> = ({
  contacts,
  onSelectContact,
  onUpdateLeadStatus,
  onLaunchCampaign,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  // Filter client leads only
  const clientLeads = useMemo(() => {
    return contacts.filter((c) => c.contactType === 'Client Lead');
  }, [contacts]);

  // Aggregate pipeline value
  const totalPipelineValue = useMemo(() => {
    return clientLeads.reduce((acc, c) => acc + (c.dealValue || 0), 0);
  }, [clientLeads]);

  // Unique industries
  const industries = useMemo(() => {
    const set = new Set<string>();
    clientLeads.forEach((c) => c.industry && set.add(c.industry));
    return Array.from(set);
  }, [clientLeads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return clientLeads.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.organization && c.organization.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.personalObservation && c.personalObservation.toLowerCase().includes(q));

      const matchesIndustry = selectedIndustry === 'all' || c.industry === selectedIndustry;
      return matchesSearch && matchesIndustry;
    });
  }, [clientLeads, searchQuery, selectedIndustry]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              B2B Client Pipeline
            </span>
            <span className="text-zinc-400 text-xs">
              ${totalPipelineValue.toLocaleString()} Potential Deal Volume
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Client Outreach & Deal Flow
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
            Track bespoke personalized observations, target offers, website audits, and follow-up stages for high-value business development.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Toggle */}
          <div className="flex bg-zinc-800 p-1 rounded-xl border border-zinc-700 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>

          <button
            onClick={onLaunchCampaign}
            className="px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch Client Campaign</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by company, contact, city, or icebreaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium outline-none"
          >
            <option value="all">All Industries ({clientLeads.length})</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: KANBAN PIPELINE */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto custom-scrollbar pb-4">
          <div className="flex gap-4 min-w-[1200px]">
            {KANBAN_STAGES.slice(0, 8).map((stage) => {
              const stageLeads = filteredLeads.filter(
                (l) => (l.leadStatus || 'New') === stage.id
              );
              const stageVal = stageLeads.reduce((a, b) => a + (b.dealValue || 0), 0);

              return (
                <div
                  key={stage.id}
                  className="w-72 shrink-0 flex flex-col rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 p-3"
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stage.color}`}>
                        {stage.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-zinc-400">
                        {stageLeads.length}
                      </span>
                    </div>
                    {stageVal > 0 && (
                      <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        ${stageVal.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stage Lead Cards */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto custom-scrollbar max-h-[620px] pr-1">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => onSelectContact(lead)}
                        className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer transition-all space-y-2.5"
                      >
                        {/* Company & Role */}
                        <div>
                          <p className="font-bold text-xs text-zinc-900 dark:text-white">
                            {lead.organization || 'Direct Lead'}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {lead.firstName} {lead.lastName} • {lead.role || 'Partner'}
                          </p>
                        </div>

                        {/* Icebreaker / Personal Observation Snippet */}
                        {lead.personalObservation && (
                          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 italic">
                            "{lead.personalObservation}"
                          </div>
                        )}

                        {/* Assigned Offer */}
                        {lead.assignedOffer && (
                          <div className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span className="truncate">{lead.assignedOffer}</span>
                          </div>
                        )}

                        {/* Card Footer: Deal Value, City, Next Stage */}
                        <div className="pt-1.5 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${lead.dealValue ? lead.dealValue.toLocaleString() : '1,500'}
                          </span>

                          {/* Quick Advance Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currIdx = KANBAN_STAGES.findIndex((s) => s.id === stage.id);
                              if (currIdx < KANBAN_STAGES.length - 1) {
                                onUpdateLeadStatus(lead.id, KANBAN_STAGES[currIdx + 1].id);
                              }
                            }}
                            title="Advance to next stage"
                            className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-200"
                          >
                            <span>Advance</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div className="py-8 text-center text-[11px] text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                        No leads in {stage.label}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Company & Contact</th>
                  <th className="px-4 py-3">Website</th>
                  <th className="px-4 py-3">Observation / Angle</th>
                  <th className="px-4 py-3">Assigned Offer</th>
                  <th className="px-4 py-3">Deal Value</th>
                  <th className="px-4 py-3">Pipeline Stage</th>
                  <th className="px-4 py-3">Next Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectContact(lead)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-zinc-900 dark:text-white">
                        {lead.organization || 'Direct Lead'}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {lead.firstName} {lead.lastName} • {lead.role}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      {lead.website ? (
                        <a
                          href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate max-w-[140px]"
                        >
                          <span>{lead.website}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs text-zinc-600 dark:text-zinc-400 truncate">
                      {lead.personalObservation || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-700 dark:text-zinc-300 font-medium">
                      {lead.assignedOffer || 'Custom Proposal'}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${lead.dealValue ? lead.dealValue.toLocaleString() : '1,500'}
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.leadStatus || 'New'}
                        onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                        className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs font-semibold outline-none"
                      >
                        {KANBAN_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">
                      {lead.nextFollowUpDate
                        ? new Date(lead.nextFollowUpDate).toLocaleDateString()
                        : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
