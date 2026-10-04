import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Copy,
  Eye,
  Trash2,
  Sparkles,
  Search,
  Check,
  Tag,
  GraduationCap,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { Template, Contact } from '../types';
import { personalizeText } from '../lib/personalization';

interface TemplatesViewProps {
  templates: Template[];
  contacts: Contact[];
  onSaveTemplate: (template: Omit<Template, 'id' | 'createdAt'>) => void;
  onSelectForCampaign: (template: Template) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  contacts,
  onSaveTemplate,
  onSelectForCampaign,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewContact, setPreviewContact] = useState<Contact | null>(contacts[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Template Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'student' | 'client' | 'general'>('student');
  const [newSubject, setNewSubject] = useState('');
  const [newPreheader, setNewPreheader] = useState('');
  const [newBody, setNewBody] = useState('');

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQ =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [templates, selectedCategory, searchQuery]);

  const handleCopyBody = (t: Template) => {
    navigator.clipboard.writeText(t.body);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSubject.trim() || !newBody.trim()) return;

    onSaveTemplate({
      name: newName.trim(),
      category: newCategory,
      subject: newSubject.trim(),
      preheader: newPreheader.trim() || undefined,
      body: newBody.trim(),
      variables: ['first_name', 'organization'],
    });

    setNewName('');
    setNewSubject('');
    setNewPreheader('');
    setNewBody('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Copywriting & Frameworks
            </span>
            <span className="text-zinc-400 text-xs">
              {templates.length} Production Outreach Templates
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Email Template Library
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
            Pre-tested copy for campus announcements and high-converting B2B client prospecting with dynamic fallback variables.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Template</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Templates' },
            { id: 'student', label: 'Student Outreach', icon: GraduationCap },
            { id: 'client', label: 'Client Outreach', icon: Briefcase },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    tpl.category === 'student'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  }`}
                >
                  {tpl.category === 'student' ? 'Student' : 'Client Prospecting'}
                </span>
                <button
                  onClick={() => handleCopyBody(tpl)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded"
                  title="Copy email body"
                >
                  {copiedId === tpl.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                {tpl.name}
              </h3>

              <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-2 font-medium line-clamp-1">
                Subject: {tpl.subject}
              </p>

              <div className="mt-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-4 font-mono leading-relaxed">
                {tpl.body}
              </div>
            </div>

            {/* Card Actions */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setPreviewTemplate(tpl);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>

              <button
                onClick={() => onSelectForCampaign(tpl)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Use in Campaign
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setPreviewTemplate(null)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Template Preview: {previewTemplate.name}
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Resolved using sample contact data
                </p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1 text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>

            {/* Select Contact for resolution */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-medium">Test Against:</span>
              <select
                value={previewContact?.id || ''}
                onChange={(e) => {
                  const found = contacts.find((c) => c.id === e.target.value);
                  if (found) setPreviewContact(found);
                }}
                className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none text-xs"
              >
                {contacts.slice(0, 10).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.contactType})
                  </option>
                ))}
              </select>
            </div>

            {/* Rendered Email */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-3">
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                  Resolved Subject:
                </span>
                <p className="font-bold text-zinc-900 dark:text-white text-xs mt-0.5">
                  {previewContact
                    ? personalizeText(previewTemplate.subject, previewContact)
                    : previewTemplate.subject}
                </p>
              </div>

              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                  Resolved Body:
                </span>
                <div className="mt-1 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans max-h-60 overflow-y-auto custom-scrollbar">
                  {previewContact
                    ? personalizeText(previewTemplate.body, previewContact)
                    : previewTemplate.body}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  onSelectForCampaign(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold"
              >
                Use this Template in Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Create Email Template
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Hackathon Ambassador Call"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                >
                  <option value="student">Student Outreach</option>
                  <option value="client">Client Prospecting</option>
                  <option value="general">General Outreach</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. {{first_name}}, invitation to represent {{college}}"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Email Body *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write your email body with tokens like {{first_name}}, {{organization}}, {{college}}..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
