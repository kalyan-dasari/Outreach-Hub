import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  UploadCloud,
  Trash2,
  Tag,
  ChevronDown,
  Mail,
  ExternalLink,
  GraduationCap,
  Briefcase,
  CheckSquare,
  Square,
  X,
} from 'lucide-react';
import { Contact, ContactStatus, ContactType } from '../types';

interface ContactsViewProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onOpenImportModal: () => void;
  onAddContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  onDeleteContact: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkTag: (ids: string[], tag: string) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onSelectContact,
  onOpenImportModal,
  onAddContact,
  onDeleteContact,
  onBulkDelete,
  onBulkTag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [bulkTagInput, setBulkTagInput] = useState('');
  const [showBulkTagPrompt, setShowBulkTagPrompt] = useState(false);

  // New Contact Form State
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newType, setNewType] = useState<ContactType>('Student');
  const [newCollege, setNewCollege] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newBatch, setNewBatch] = useState('');
  const [newTags, setNewTags] = useState('');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    contacts.forEach((c) => c.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [contacts]);

  // Filtering Logic
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.organization && c.organization.toLowerCase().includes(q)) ||
        (c.college && c.college.toLowerCase().includes(q)) ||
        c.tags.some((t) => t.toLowerCase().includes(q));

      const matchesType = selectedType === 'all' || c.contactType === selectedType;
      const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
      const matchesTag = selectedTag === 'all' || c.tags.includes(selectedTag);

      return matchesSearch && matchesType && matchesStatus && matchesTag;
    });
  }, [contacts, searchQuery, selectedType, selectedStatus, selectedTag]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredContacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleExportCsv = () => {
    const rows = filteredContacts.map((c) => ({
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone || '',
      organization: c.organization || c.college || '',
      role: c.role || '',
      contactType: c.contactType,
      status: c.status,
      college: c.college || '',
      department: c.department || '',
      batch: c.batch || '',
      tags: c.tags.join('; '),
    }));

    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csvLines = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => `"${(r as any)[h]}"`).join(',')),
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outreach_contacts_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newEmail.trim()) return;

    onAddContact({
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || undefined,
      organization: newOrg.trim() || undefined,
      role: newRole.trim() || undefined,
      city: newCity.trim() || undefined,
      contactType: newType,
      college: newCollege.trim() || undefined,
      department: newDept.trim() || undefined,
      batch: newBatch.trim() || undefined,
      tags: newTags
        ? newTags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Manual Entry'],
      status: 'New',
      source: 'Direct Web UI',
      notes: [],
    });

    // Reset Form
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPhone('');
    setNewOrg('');
    setNewRole('');
    setNewCity('');
    setNewCollege('');
    setNewDept('');
    setNewBatch('');
    setNewTags('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Contact Directory
          </h1>
          <p className="text-xs text-zinc-500">
            {contacts.length} total contacts across student campuses and enterprise lead pipelines
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-zinc-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, college, organization, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
            />
          </div>

          {/* Quick Filter Selects */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium outline-none"
            >
              <option value="all">All Audiences</option>
              <option value="Student">Students Only</option>
              <option value="Client Lead">Client Leads Only</option>
              <option value="Partner">Partners</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Active">Active</option>
              <option value="Contacted">Contacted</option>
              <option value="Replied">Replied</option>
              <option value="Interested">Interested</option>
              <option value="Converted">Converted</option>
              <option value="Unsubscribed">Unsubscribed</option>
            </select>

            {allTags.length > 0 && (
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium outline-none"
              >
                <option value="all">All Tags</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    Tag: {t}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Bulk Action Bar if items selected */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs animate-in fade-in duration-150">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {selectedIds.size} contacts selected
            </span>

            <div className="flex items-center gap-2">
              {showBulkTagPrompt ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Tag name..."
                    value={bulkTagInput}
                    onChange={(e) => setBulkTagInput(e.target.value)}
                    className="px-2 py-1 text-xs rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                  />
                  <button
                    onClick={() => {
                      if (bulkTagInput.trim()) {
                        onBulkTag(Array.from(selectedIds), bulkTagInput.trim());
                        setBulkTagInput('');
                        setShowBulkTagPrompt(false);
                      }
                    }}
                    className="px-2.5 py-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded font-semibold text-xs"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowBulkTagPrompt(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowBulkTagPrompt(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50"
                >
                  <Tag className="w-3 h-3" />
                  <span>Bulk Tag</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (confirm(`Delete ${selectedIds.size} selected contacts?`)) {
                    onBulkDelete(Array.from(selectedIds));
                    setSelectedIds(new Set());
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-medium hover:bg-rose-100"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contacts Table Card */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 w-10">
                  <button onClick={handleSelectAll} className="p-0.5 text-zinc-400 hover:text-zinc-600">
                    {selectedIds.size > 0 && selectedIds.size === filteredContacts.length ? (
                      <CheckSquare className="w-4 h-4 text-zinc-900 dark:text-white" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Organization / Campus</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Contacted</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {filteredContacts.map((contact) => {
                const isChecked = selectedIds.has(contact.id);
                return (
                  <tr
                    key={contact.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
                    onClick={() => onSelectContact(contact)}
                  >
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleSelect(contact.id)}
                        className="p-0.5 text-zinc-400 hover:text-zinc-600"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-zinc-900 dark:text-white" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 text-[11px] shrink-0">
                          {contact.firstName.charAt(0)}
                          {contact.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-[11px] text-zinc-400">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          contact.contactType === 'Student'
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                            : contact.contactType === 'Client Lead'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {contact.contactType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400">
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">
                        {contact.college || contact.organization || '—'}
                      </p>
                      {contact.department && (
                        <p className="text-[11px] text-zinc-400">
                          {contact.department} ({contact.batch || 'Undergrad'})
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {contact.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          >
                            {t}
                          </span>
                        ))}
                        {contact.tags.length > 2 && (
                          <span className="text-[10px] text-zinc-400">+{contact.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          contact.status === 'Interested' || contact.status === 'Replied'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : contact.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                            : contact.status === 'Unsubscribed' || contact.status === 'Bounced'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">
                      {contact.lastContacted
                        ? new Date(contact.lastContacted).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectContact(contact)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-400">
                    No contacts found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Add New Contact
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="p-6 space-y-3.5 text-xs">
              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Contact Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Client Lead">Client Lead</option>
                    <option value="Partner">Partner</option>
                    <option value="Faculty">Faculty</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {newType === 'Student' ? (
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                      College
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Stanford"
                      value={newCollege}
                      onChange={(e) => setNewCollege(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSE"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Batch
                    </label>
                    <input
                      type="text"
                      placeholder="2023-2027"
                      value={newBatch}
                      onChange={(e) => setNewBatch(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Company / Org
                    </label>
                    <input
                      type="text"
                      value={newOrg}
                      onChange={(e) => setNewOrg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                      City
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP, Hackathon, High Ticket"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100"
                >
                  Create Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
