import React, { useState, useEffect } from 'react';
import { Search, X, Users, Send, FileText, ArrowRight, GraduationCap, Briefcase } from 'lucide-react';
import { Contact, Campaign, Template } from '../types';
import { NavigationTab } from './Sidebar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  campaigns: Campaign[];
  templates: Template[];
  onSelectContact: (contact: Contact) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  contacts,
  campaigns,
  templates,
  onSelectContact,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent, or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredContacts = q
    ? contacts.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.organization?.toLowerCase().includes(q) ||
          c.college?.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      ).slice(0, 5)
    : contacts.slice(0, 4);

  const filteredCampaigns = q
    ? campaigns.filter((c) => c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q)).slice(0, 3)
    : campaigns.slice(0, 2);

  const filteredTemplates = q
    ? templates.filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)).slice(0, 3)
    : templates.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            id="command-palette-input"
            type="text"
            placeholder="Search contacts, colleges, campaigns, templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-3 space-y-4 text-xs">
          {/* Quick Navigation jumps */}
          {!q && (
            <div>
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Quick Shortcuts
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onNavigate('students');
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">Student Outreach</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('clients');
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left"
                >
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">Client Pipeline</span>
                </button>
              </div>
            </div>
          )}

          {/* Contacts Section */}
          {filteredContacts.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center justify-between">
                <span>Contacts ({filteredContacts.length})</span>
                <span className="font-normal lowercase">Press to open profile</span>
              </p>
              <div className="space-y-1">
                {filteredContacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectContact(c);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                        {c.firstName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">
                          {c.organization || c.college} • {c.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium shrink-0">
                      {c.contactType}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Campaigns */}
          {filteredCampaigns.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Campaigns
              </p>
              <div className="space-y-1">
                {filteredCampaigns.map((camp) => (
                  <button
                    key={camp.id}
                    onClick={() => {
                      onNavigate('campaigns');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Send className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">{camp.name}</p>
                        <p className="text-[11px] text-zinc-500 truncate max-w-sm">{camp.subject}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
                      {camp.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Templates */}
          {filteredTemplates.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Templates
              </p>
              <div className="space-y-1">
                {filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onNavigate('templates');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">{t.name}</p>
                        <p className="text-[11px] text-zinc-500">{t.category}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
