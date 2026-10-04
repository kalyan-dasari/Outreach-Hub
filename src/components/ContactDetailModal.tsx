import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Tag,
  Calendar,
  Clock,
  Send,
  MessageSquare,
  FileText,
  UserCheck,
  CheckCircle,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Contact, EmailEvent } from '../types';

interface ContactDetailModalProps {
  contact: Contact | null;
  onClose: () => void;
  onUpdateStatus: (status: Contact['status']) => void;
  onUpdateLeadStatus?: (leadStatus: Contact['leadStatus']) => void;
  onAddNote: (note: string) => void;
  onAddTag: (tag: string) => void;
  events: EmailEvent[];
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  contact,
  onClose,
  onUpdateStatus,
  onUpdateLeadStatus,
  onAddNote,
  onAddTag,
  events,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  if (!contact) return null;

  const contactEvents = events.filter(
    (e) => e.contactId === contact.id || e.contactEmail.toLowerCase() === contact.email.toLowerCase()
  );

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote.trim());
    setNewNote('');
  };

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    onAddTag(newTagInput.trim());
    setNewTagInput('');
    setIsAddingTag(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Slide-in Drawer */}
      <div className="relative w-full max-w-xl h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center text-base font-bold shrink-0">
              {contact.firstName.charAt(0)}
              {contact.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  {contact.firstName} {contact.lastName}
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {contact.contactType}
                </span>
              </div>
              <p className="text-xs text-zinc-500 truncate mt-0.5">
                {contact.role ? `${contact.role} at ` : ''}
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {contact.organization || contact.college || 'Direct Contact'}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Status Bar */}
        <div className="px-5 py-2.5 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Status:</span>
            <select
              value={contact.status}
              onChange={(e) => onUpdateStatus(e.target.value as any)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none"
            >
              {[
                'New',
                'Active',
                'Contacted',
                'Replied',
                'Interested',
                'Not Interested',
                'Converted',
                'Unsubscribed',
                'Bounced',
              ].map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {contact.contactType === 'Client Lead' && onUpdateLeadStatus && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-medium">Pipeline:</span>
              <select
                value={contact.leadStatus || 'New'}
                onChange={(e) => onUpdateLeadStatus(e.target.value as any)}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 outline-none"
              >
                {[
                  'New',
                  'Researched',
                  'Contacted',
                  'Follow-up',
                  'Replied',
                  'Interested',
                  'Meeting',
                  'Proposal',
                  'Won',
                  'Lost',
                  'Do Not Contact',
                ].map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tabs Bar */}
        <div className="px-5 flex border-b border-zinc-100 dark:border-zinc-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <span>Timeline & Events</span>
            {contactEvents.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px]">
                {contactEvents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <span>Notes</span>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px]">
              {contact.notes.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Contact Info Card */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <a href={`mailto:${contact.email}`} className="hover:underline truncate">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-zinc-400" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      <span>{contact.city}</span>
                    </div>
                  )}
                  {(contact.website || contact.websiteUrl) && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-zinc-400" />
                      <a
                        href={
                          (contact.website || contact.websiteUrl)?.startsWith('http')
                            ? contact.website || contact.websiteUrl
                            : `https://${contact.website || contact.websiteUrl}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1 text-indigo-600 dark:text-indigo-400 truncate"
                      >
                        <span>{contact.website || contact.websiteUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Specific Details */}
              {contact.contactType === 'Student' && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Academic Attributes
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-zinc-400">Institution:</span>
                      <p className="font-semibold text-zinc-900 dark:text-white mt-0.5">
                        {contact.college || contact.organization || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-400">Department:</span>
                      <p className="font-semibold text-zinc-900 dark:text-white mt-0.5">
                        {contact.department || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-400">Batch / Cohort:</span>
                      <p className="font-semibold text-zinc-900 dark:text-white mt-0.5">
                        {contact.batch || '—'} ({contact.year || 'Undergrad'})
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-400">Student Roll / ID:</span>
                      <p className="font-mono font-semibold text-zinc-900 dark:text-white mt-0.5">
                        {contact.rollNumber || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Client Lead Specific Details */}
              {contact.contactType === 'Client Lead' && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Outreach Intelligence & Offer
                  </h4>
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-zinc-400">Personalized Site Observation:</span>
                      <p className="mt-1 p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 italic">
                        "{contact.personalObservation || 'No custom observation logged yet.'}"
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-400">Assigned Offer:</span>
                      <p className="font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {contact.assignedOffer || 'Standard Website Speed & Lead Capture Redesign'}
                      </p>
                    </div>
                    {contact.dealValue !== undefined && contact.dealValue > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400">Target Deal Value:</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ${contact.dealValue.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags Section */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Tags & Segments
                  </h4>
                  <button
                    onClick={() => setIsAddingTag(!isAddingTag)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Tag</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {isAddingTag && (
                  <form onSubmit={handleAddTagSubmit} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="e.g. VIP, Hackathon, High Ticket"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg font-medium"
                    >
                      Save
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE & EVENTS */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <p className="text-zinc-500 text-[11px]">
                Full event timeline and delivery tracking for {contact.firstName}.
              </p>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                {/* Initial Creation Event */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                    <UserCheck className="w-2.5 h-2.5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">Contact Added</p>
                    <p className="text-zinc-500 text-[11px]">
                      Source: {contact.source || 'Direct Entry'} •{' '}
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Email Events */}
                {contactEvents.map((evt) => (
                  <div key={evt.id} className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        evt.eventType === 'replied'
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                          : evt.eventType === 'opened'
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                          : evt.eventType === 'clicked'
                          ? 'bg-amber-100 border-amber-500 text-amber-700'
                          : 'bg-zinc-100 border-zinc-400 text-zinc-600'
                      }`}
                    >
                      {evt.eventType === 'replied' ? (
                        <CheckCircle className="w-2.5 h-2.5" />
                      ) : (
                        <Send className="w-2.5 h-2.5" />
                      )}
                    </div>
                    <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-600 dark:text-zinc-400">
                          {evt.eventType}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {new Date(evt.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {evt.campaignName && (
                        <p className="font-medium text-zinc-900 dark:text-white">
                          Campaign: {evt.campaignName}
                        </p>
                      )}
                      {evt.details && (
                        <p className="text-zinc-600 dark:text-zinc-300 mt-1">{evt.details}</p>
                      )}
                    </div>
                  </div>
                ))}

                {contactEvents.length === 0 && (
                  <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-zinc-400">
                    No outreach email events recorded yet. Ready for first campaign.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a private note about this contact, outreach observation, or call summary..."
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white text-xs outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-3 py-1.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-800 disabled:opacity-40"
                >
                  Save Note
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-3 pt-2">
                {contact.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {note.author}
                      </span>
                      <span className="text-zinc-400 font-mono">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}

                {contact.notes.length === 0 && (
                  <div className="text-center py-6 text-zinc-400">
                    No notes recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
