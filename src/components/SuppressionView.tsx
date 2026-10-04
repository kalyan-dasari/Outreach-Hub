import React, { useState, useMemo } from 'react';
import {
  ShieldBan,
  Search,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { SuppressionEntry } from '../types';

interface SuppressionViewProps {
  suppressionList: SuppressionEntry[];
  onAddSuppression: (entry: Omit<SuppressionEntry, 'id' | 'createdAt'>) => void;
  onRemoveSuppression: (id: string) => void;
}

export const SuppressionView: React.FC<SuppressionViewProps> = ({
  suppressionList,
  onAddSuppression,
  onRemoveSuppression,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReason, setSelectedReason] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Entry Form State
  const [newEmail, setNewEmail] = useState('');
  const [newReason, setNewReason] = useState<SuppressionEntry['reason']>('Manual suppression');
  const [newNotes, setNewNotes] = useState('');

  const filteredEntries = useMemo(() => {
    return suppressionList.filter((entry) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQ =
        !q ||
        entry.email.toLowerCase().includes(q) ||
        (entry.sourceCampaign && entry.sourceCampaign.toLowerCase().includes(q)) ||
        (entry.notes && entry.notes.toLowerCase().includes(q));

      const matchesReason = selectedReason === 'all' || entry.reason === selectedReason;
      return matchesQ && matchesReason;
    });
  }, [suppressionList, searchQuery, selectedReason]);

  const handleExportCsv = () => {
    if (filteredEntries.length === 0) return;
    const csvLines = [
      'Email,Reason,Date Added,Source Campaign,Notes',
      ...filteredEntries.map(
        (e) =>
          `"${e.email}","${e.reason}","${new Date(e.createdAt).toISOString()}","${e.sourceCampaign || ''}","${e.notes || ''}"`
      ),
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suppression_list_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    onAddSuppression({
      email: newEmail.trim().toLowerCase(),
      reason: newReason,
      notes: newNotes.trim() || undefined,
    });

    setNewEmail('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60">
              Deliverability Armor
            </span>
            <span className="text-zinc-400 text-xs">
              {suppressionList.length} Suppressed Addresses
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Global Suppression & Unsubscribe Registry
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
            Outreach Hub strictly enforces suppression before every broadcast. Any email added here is globally blocked from receiving campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 border border-zinc-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Suppression</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppressed emails, campaign source, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium outline-none"
          >
            <option value="all">All Reasons ({suppressionList.length})</option>
            <option value="Unsubscribed">Unsubscribed</option>
            <option value="Hard bounce">Hard Bounce</option>
            <option value="Soft bounce">Soft Bounce</option>
            <option value="Spam complaint">Spam Complaint</option>
            <option value="Manual suppression">Manual Suppression</option>
          </select>
        </div>
      </div>

      {/* Suppression Table */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Suppressed Email</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Source Campaign</th>
                <th className="px-4 py-3">Date Added</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3.5 font-mono font-medium text-zinc-900 dark:text-white">
                    {entry.email}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        entry.reason === 'Spam complaint'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : entry.reason === 'Hard bounce'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {entry.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 max-w-xs truncate">
                    {entry.sourceCampaign || 'Manual / Direct'}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-zinc-400 text-[11px]">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 max-w-xs truncate">
                    {entry.notes || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${entry.email} from suppression list?`)) {
                          onRemoveSuppression(entry.id);
                        }
                      }}
                      className="p-1 text-zinc-400 hover:text-rose-600 rounded"
                      title="Remove suppression"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-zinc-400">
                    No suppressed addresses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Suppression Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Add to Suppression List
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Suppression Reason
                </label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                >
                  <option value="Manual suppression">Manual Suppression</option>
                  <option value="Unsubscribed">Unsubscribed</option>
                  <option value="Hard bounce">Hard bounce</option>
                  <option value="Soft bounce">Soft bounce</option>
                  <option value="Spam complaint">Spam complaint</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Requested removal via direct telephone call"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold"
                >
                  Confirm Suppression
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
