import React, { useState } from 'react';
import {
  GitFork,
  Plus,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  Trash2,
  FileText,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import { Sequence, SequenceStep, Template } from '../types';

interface SequencesViewProps {
  sequences: Sequence[];
  templates: Template[];
  onToggleStatus: (sequenceId: string) => void;
  onAddStep: (sequenceId: string, step: SequenceStep) => void;
}

export const SequencesView: React.FC<SequencesViewProps> = ({
  sequences,
  templates,
  onToggleStatus,
  onAddStep,
}) => {
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>(
    sequences[0]?.id || ''
  );
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [newStepSubject, setNewStepSubject] = useState('');
  const [newStepDelay, setNewStepDelay] = useState<number>(3);
  const [newStepBody, setNewStepBody] = useState('');

  const currentSequence = sequences.find((s) => s.id === selectedSequenceId) || sequences[0];

  const handleCreateStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSequence || !newStepSubject.trim()) return;

    const nextStepOrder = currentSequence.steps.length + 1;
    onAddStep(currentSequence.id, {
      stepOrder: nextStepOrder,
      delayDays: newStepDelay,
      subject: newStepSubject.trim(),
      body: newStepBody.trim() || 'Hi {{first_name}},\n\nFollowing up on my previous note. Any thoughts?',
    });

    setNewStepSubject('');
    setNewStepDelay(3);
    setNewStepBody('');
    setShowAddStepModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
              Automated Sequences
            </span>
            <span className="text-zinc-400 text-xs">
              Smart follow-up cadences with automated stop conditions
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Outreach Sequences & Multi-Step Cadences
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
            Automatically trigger subsequent emails based on days elapsed. Sequences automatically disengage as soon as a recipient replies or unsubscribes.
          </p>
        </div>

        {currentSequence && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onToggleStatus(currentSequence.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                currentSequence.status === 'Active'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              {currentSequence.status === 'Active' ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Sequence Active (Click to Pause)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Paused (Click to Activate)</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowAddStepModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>
        )}
      </div>

      {/* Sequence Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
        {sequences.map((seq) => (
          <button
            key={seq.id}
            onClick={() => setSelectedSequenceId(seq.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              selectedSequenceId === seq.id
                ? 'bg-white dark:bg-zinc-800 border-zinc-900 dark:border-white text-zinc-900 dark:text-white shadow-xs'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>{seq.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded ${
                seq.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
              }`}
            >
              {seq.status}
            </span>
          </button>
        ))}
      </div>

      {currentSequence && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Step Timeline (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Cadence Flowchart ({currentSequence.steps.length} Steps)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Follow-ups execute automatically until response condition is met
                  </p>
                </div>
                <span className="text-xs font-mono font-medium text-zinc-500">
                  Target: {currentSequence.targetAudience}
                </span>
              </div>

              {/* Step Cards with Flow Connectors */}
              <div className="space-y-4 relative">
                {currentSequence.steps.map((step, idx) => (
                  <div key={step.id || idx} className="space-y-4">
                    <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/30 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold flex items-center justify-center text-[11px]">
                            {step.stepOrder}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-white">
                            {idx === 0
                              ? 'Step 1: Initial Outreach'
                              : idx === currentSequence.steps.length - 1
                              ? `Step ${step.stepOrder}: Final Break-up Email`
                              : `Step ${step.stepOrder}: Follow-up ${step.stepOrder - 1}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {step.delayDays === 0 ? 'Immediately' : `Send after ${step.delayDays} days`}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-1">
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                          Subject: {step.subject}
                        </p>
                        <p className="text-[11px] text-zinc-500 font-mono line-clamp-2">
                          {step.body}
                        </p>
                      </div>
                    </div>

                    {/* Step Connector Arrow */}
                    {idx < currentSequence.steps.length - 1 && (
                      <div className="flex items-center justify-center text-zinc-400 py-1">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rules & Safeguards Card (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Automated Stop Triggers</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  The sequence automatically cancels all remaining steps if any condition occurs:
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: 'Recipient sends a reply (email or thread)', checked: true },
                  { label: 'Recipient clicks unsubscribe link', checked: true },
                  { label: 'Email address hard or soft bounces', checked: true },
                  { label: 'Lead marked as "Meeting Booked"', checked: true },
                  { label: 'Manual sequence disengagement by user', checked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-500 leading-relaxed">
                Sequences will only contact recipients during business hours (9:00 AM - 5:00 PM local time).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Step Modal */}
      {showAddStepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowAddStepModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Add Sequence Follow-up Step
              </h3>
              <button
                onClick={() => setShowAddStepModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStep} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Delay (Days after previous step) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={newStepDelay}
                  onChange={(e) => setNewStepDelay(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Subject Line *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Re: Quick question regarding your website speed"
                  value={newStepSubject}
                  onChange={(e) => setNewStepSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Follow-up Email Body *
                </label>
                <textarea
                  rows={6}
                  value={newStepBody}
                  onChange={(e) => setNewStepBody(e.target.value)}
                  placeholder="Hi {{first_name}},\n\nWanted to quickly bump this to the top of your inbox..."
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStepModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold"
                >
                  Add Step to Sequence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
