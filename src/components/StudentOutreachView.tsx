import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Sparkles,
  Send,
  Plus,
  Search,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  UploadCloud,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { Contact, Template } from '../types';

interface StudentOutreachViewProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onLaunchCampaign: (filter: { college?: string; department?: string; batch?: string }) => void;
  onOpenImportModal: () => void;
}

export const StudentOutreachView: React.FC<StudentOutreachViewProps> = ({
  contacts,
  onSelectContact,
  onLaunchCampaign,
  onOpenImportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  // Institutional Pattern Generator State
  const [showPatternTool, setShowPatternTool] = useState(false);
  const [patternFormat, setPatternFormat] = useState('{first_name}.{last_name}@stanfordtech.edu');
  const [patternRosterInput, setPatternRosterInput] = useState(
    `Ananya, Iyer, CS24B012, Computer Science\nRohan, Verma, EC24B088, Electronics\nTanvi, Sharma, DS24B019, Data Science`
  );
  const [generatedPreview, setGeneratedPreview] = useState<Array<{ name: string; email: string; valid: boolean }>>([]);

  // Students list
  const students = useMemo(() => {
    return contacts.filter((c) => c.contactType === 'Student');
  }, [contacts]);

  // College groups
  const colleges = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach((s) => {
      const col = s.college || 'Unassigned Campus';
      map.set(col, (map.get(col) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [students]);

  // Departments
  const departments = useMemo(() => {
    const depts = new Set<string>();
    students.forEach((s) => s.department && depts.add(s.department));
    return Array.from(depts);
  }, [students]);

  // Batches
  const batches = useMemo(() => {
    const b = new Set<string>();
    students.forEach((s) => s.batch && b.add(s.batch));
    return Array.from(b);
  }, [students]);

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(q)) ||
        (s.college && s.college.toLowerCase().includes(q));

      const matchesCollege = selectedCollege === 'all' || s.college === selectedCollege;
      const matchesDept = selectedDept === 'all' || s.department === selectedDept;
      const matchesBatch = selectedBatch === 'all' || s.batch === selectedBatch;

      return matchesSearch && matchesCollege && matchesDept && matchesBatch;
    });
  }, [students, searchQuery, selectedCollege, selectedDept, selectedBatch]);

  // Generate Pattern Preview
  const handleGeneratePatternPreview = () => {
    const lines = patternRosterInput.split('\n').filter((l) => l.trim().length > 0);
    const results = lines.map((line) => {
      const parts = line.split(',').map((p) => p.trim());
      const first = parts[0] || 'Student';
      const last = parts[1] || '';
      const roll = parts[2] || 'ROLL123';

      let resolvedEmail = patternFormat
        .replace('{first_name}', first.toLowerCase().replace(/\s+/g, ''))
        .replace('{last_name}', last.toLowerCase().replace(/\s+/g, ''))
        .replace('{first_initial}', first.charAt(0).toLowerCase())
        .replace('{roll_number}', roll.toLowerCase().replace(/\s+/g, ''));

      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resolvedEmail);
      return {
        name: `${first} ${last}`,
        email: resolvedEmail,
        valid,
      };
    });
    setGeneratedPreview(results);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
              Campus Intelligence
            </span>
            <span className="text-zinc-400 text-xs">
              {students.length} Verified Students Across {colleges.length} Campuses
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Student Outreach Engine
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
            Broadcast legitimate hackathons, open-source workshops, campus ambassador invitations, and career resources to targeted student rosters.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowPatternTool(!showPatternTool)}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>{showPatternTool ? 'Hide Generator' : 'Institutional Pattern Tool'}</span>
          </button>

          <button
            onClick={onOpenImportModal}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4 text-zinc-400" />
            <span>Import Roster CSV</span>
          </button>

          <button
            onClick={() =>
              onLaunchCampaign({
                college: selectedCollege !== 'all' ? selectedCollege : undefined,
                department: selectedDept !== 'all' ? selectedDept : undefined,
                batch: selectedBatch !== 'all' ? selectedBatch : undefined,
              })
            }
            className="px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast to Students ({filteredStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Institutional Pattern Generator (Drawer / Expandable Panel) */}
      {showPatternTool && (
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Safe Institutional Email Pattern Generator</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Generate and preview legitimate .edu student email handles from known rosters. Never sends blind emails without manual review.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded">
              Preview-Only Sandbox
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Pattern Input & Presets */}
            <div className="space-y-3">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                Pattern Syntax Formula
              </label>
              <input
                type="text"
                value={patternFormat}
                onChange={(e) => setPatternFormat(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
              />

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-zinc-400 mr-1 self-center">Presets:</span>
                {[
                  '{first_name}.{last_name}@stanfordtech.edu',
                  '{roll_number}@mitengineering.edu',
                  '{first_initial}{last_name}@berkeleytech.edu',
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setPatternFormat(preset)}
                    className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div>
                <label className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
                  Roster CSV Snippet (FirstName, LastName, RollNo, Dept)
                </label>
                <textarea
                  rows={4}
                  value={patternRosterInput}
                  onChange={(e) => setPatternRosterInput(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
                />
              </div>

              <button
                onClick={handleGeneratePatternPreview}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 text-xs"
              >
                Simulate & Test Pattern Match
              </button>
            </div>

            {/* Resolved Preview */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Resolved Candidate Previews ({generatedPreview.length})
                </span>
                <span className="text-[11px] text-zinc-400">Safe Sandbox Check</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {generatedPreview.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{item.name}</p>
                      <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                        {item.email}
                      </p>
                    </div>
                    {item.valid ? (
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Valid Format
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Invalid Syntax
                      </span>
                    )}
                  </div>
                ))}

                {generatedPreview.length === 0 && (
                  <div className="py-8 text-center text-zinc-400">
                    Click "Simulate & Test Pattern Match" to preview generated emails safely.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* College Roster Directory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {colleges.map((col) => {
          const isSelected = selectedCollege === col.name;
          return (
            <div
              key={col.name}
              onClick={() => setSelectedCollege(isSelected ? 'all' : col.name)}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20'
                  : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Building2 className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-zinc-400'}`} />
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {col.count} students
                </span>
              </div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                {col.name}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1">
                {isSelected ? 'Currently filtering list' : 'Click to filter student directory'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter Bar & Student Directory */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students by name, email, roll number, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium outline-none"
            >
              <option value="all">All Colleges ({students.length})</option>
              {colleges.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium outline-none"
            >
              <option value="all">All Batches</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  Batch {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto custom-scrollbar rounded-xl border border-zinc-100 dark:border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Roll / ID</th>
                <th className="px-4 py-3">Campus</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {filteredStudents.map((st) => (
                <tr
                  key={st.id}
                  onClick={() => onSelectContact(st)}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {st.firstName} {st.lastName}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-mono">{st.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    {st.rollNumber || '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                    {st.college || '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {st.department || 'General'}
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-500">
                    {st.batch || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        st.status === 'Interested' || st.status === 'Replied'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : st.status === 'Contacted'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {st.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-zinc-400">
                    No students match the chosen college/department/batch criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
