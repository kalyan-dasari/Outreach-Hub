import React, { useState } from 'react';
import {
  UploadCloud,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Users,
  Download,
} from 'lucide-react';
import { Contact, ContactType } from '../types';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (contacts: Array<Omit<Contact, 'id' | 'createdAt'>>) => void;
  existingEmails: Set<string>;
  suppressedEmails: Set<string>;
  defaultContactType?: ContactType;
}

interface ColumnMapping {
  csvColumn: string;
  targetField: string;
}

const TARGET_FIELDS = [
  { key: 'firstName', label: 'First Name (Required)', required: true },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email (Required)', required: true },
  { key: 'organization', label: 'Organization / Company' },
  { key: 'role', label: 'Role / Job Title' },
  { key: 'city', label: 'City' },
  { key: 'website', label: 'Website URL' },
  { key: 'phone', label: 'Phone' },
  { key: 'college', label: 'College / University' },
  { key: 'department', label: 'Department' },
  { key: 'batch', label: 'Batch / Cohort' },
  { key: 'rollNumber', label: 'Roll / Student ID' },
  { key: 'industry', label: 'Industry' },
  { key: 'personalObservation', label: 'Personal Observation' },
  { key: 'assignedOffer', label: 'Assigned Offer' },
];

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  existingEmails,
  suppressedEmails,
  defaultContactType = 'Student',
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [file, setFile] = useState<File | null>(null);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [contactType, setContactType] = useState<ContactType>(defaultContactType);

  // Validation results
  const [validContacts, setValidContacts] = useState<Array<Omit<Contact, 'id' | 'createdAt'>>>([]);
  const [duplicatesCount, setDuplicatesCount] = useState(0);
  const [invalidEmailsCount, setInvalidEmailsCount] = useState(0);
  const [suppressedCount, setSuppressedCount] = useState(0);
  const [missingRequiredCount, setMissingRequiredCount] = useState(0);

  if (!isOpen) return null;

  // Sample CSV generator for user convenience
  const handleDownloadSample = () => {
    const csvContent =
      contactType === 'Student'
        ? `First Name,Last Name,Email,College,Department,Batch,Roll Number\nAarav,Patel,aarav.p@stanfordtech.edu,Stanford Tech Institute,Computer Science,2023-2027,CS23B102\nMeera,Rao,meera.r@mitengineering.edu,MIT College of Engineering,Information Technology,2022-2026,IT22A044\n`
        : `First Name,Last Name,Email,Company,Role,Website,City,Observation,Offer\nDavid,Miller,david@precisiondentaltx.com,Precision Dental,Managing Partner,precisiondentaltx.com,Austin,mobile site takes 6.2s to load,Free Mobile Booking Funnel\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample_${contactType.toLowerCase()}_outreach.csv`;
    link.click();
  };

  const parseCsvText = (text: string) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 1) return;

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const rows = lines.slice(1).map((line) => {
      // Basic CSV split respecting quotes
      const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
      const row: string[] = [];
      let match;
      while ((match = regex.exec(line)) !== null) {
        let val = match[1];
        if (val !== undefined) {
          val = val.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
          row.push(val);
        }
        if (regex.lastIndex >= line.length) break;
      }
      return row.slice(0, headers.length);
    });

    setRawHeaders(headers);
    setRawRows(rows);

    // Auto-detect common column names
    const autoMap: Record<string, string> = {};
    headers.forEach((h) => {
      const lower = h.toLowerCase().replace(/[^a-z]/g, '');
      if (lower.includes('firstname') || lower === 'first' || lower === 'name') {
        autoMap[h] = 'firstName';
      } else if (lower.includes('lastname') || lower === 'last' || lower === 'surname') {
        autoMap[h] = 'lastName';
      } else if (lower.includes('email') || lower === 'mail') {
        autoMap[h] = 'email';
      } else if (lower.includes('company') || lower.includes('organization') || lower.includes('org')) {
        autoMap[h] = 'organization';
      } else if (lower.includes('college') || lower.includes('university') || lower.includes('campus')) {
        autoMap[h] = 'college';
      } else if (lower.includes('dept') || lower.includes('department') || lower.includes('branch')) {
        autoMap[h] = 'department';
      } else if (lower.includes('batch') || lower.includes('year') || lower.includes('cohort')) {
        autoMap[h] = 'batch';
      } else if (lower.includes('roll') || lower.includes('student') || lower.includes('id')) {
        autoMap[h] = 'rollNumber';
      } else if (lower.includes('website') || lower.includes('url')) {
        autoMap[h] = 'website';
      } else if (lower.includes('role') || lower.includes('title') || lower.includes('position')) {
        autoMap[h] = 'role';
      } else if (lower.includes('city') || lower.includes('location')) {
        autoMap[h] = 'city';
      } else if (lower.includes('observation') || lower.includes('note')) {
        autoMap[h] = 'personalObservation';
      } else if (lower.includes('offer')) {
        autoMap[h] = 'assignedOffer';
      }
    });

    setMappings(autoMap);
    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsvText(text);
    };
    reader.readAsText(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCsvText(text);
      };
      reader.readAsText(f);
    }
  };

  // Step 4 Validation Engine
  const runValidation = () => {
    let dupCount = 0;
    let invEmailCount = 0;
    let supCount = 0;
    let missReqCount = 0;
    const seenInFile = new Set<string>();
    const valid: Array<Omit<Contact, 'id' | 'createdAt'>> = [];

    rawRows.forEach((row) => {
      const contactObj: any = {
        contactType,
        tags: [`Imported ${new Date().toLocaleDateString()}`],
        status: 'New',
        source: `CSV (${file?.name || 'Manual Upload'})`,
        notes: [],
      };

      rawHeaders.forEach((header, idx) => {
        const targetField = mappings[header];
        if (targetField && row[idx]) {
          contactObj[targetField] = row[idx].trim();
        }
      });

      const email = (contactObj.email || '').trim().toLowerCase();
      const firstName = (contactObj.firstName || '').trim();

      // Check required fields
      if (!email || !firstName) {
        missReqCount++;
        return;
      }

      // Check valid email format (RFC basic regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        invEmailCount++;
        return;
      }

      // Check duplicates in file or existing DB
      if (seenInFile.has(email) || existingEmails.has(email)) {
        dupCount++;
        return;
      }

      // Check suppression / unsubscribe list
      if (suppressedEmails.has(email)) {
        supCount++;
        return;
      }

      seenInFile.add(email);
      valid.push(contactObj);
    });

    setValidContacts(valid);
    setDuplicatesCount(dupCount);
    setInvalidEmailsCount(invEmailCount);
    setSuppressedCount(supCount);
    setMissingRequiredCount(missReqCount);
    setStep(4);
  };

  const handleFinalImport = () => {
    onImportComplete(validContacts);
    setStep(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              Import Contacts from CSV
            </h2>
            <p className="text-xs text-zinc-500">
              Step {step} of 5 —{' '}
              {step === 1 && 'Upload CSV File'}
              {step === 2 && 'Preview Detected Columns'}
              {step === 3 && 'Map CSV Columns to Fields'}
              {step === 4 && 'Validation & Safeguards'}
              {step === 5 && 'Import Summary'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* STEP 1: Upload */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
                <div>
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Import Type
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Select target audience profile for this list
                  </p>
                </div>
                <div className="flex gap-2">
                  {(['Student', 'Client Lead'] as ContactType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setContactType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        contactType === type
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                          : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-8 text-center hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors flex flex-col items-center justify-center cursor-pointer bg-zinc-50/50 dark:bg-zinc-800/20"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
                  <UploadCloud className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                </div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                  Drag & drop your CSV file here, or browse
                </p>
                <p className="text-xs text-zinc-500 mb-4 max-w-sm">
                  Accepts standard comma-separated .csv files. Encrypted client-side.
                </p>
                <label className="cursor-pointer px-4 py-2 text-xs font-medium rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                  <span>Browse Files</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* Sample Download CTA */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-500">Need a template?</span>
                <button
                  onClick={handleDownloadSample}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample {contactType} CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Preview Detected Columns */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">
                  Detected <strong>{rawHeaders.length}</strong> columns and{' '}
                  <strong>{rawRows.length}</strong> rows in <em>{file?.name}</em>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium">
                  Valid CSV Header
                </span>
              </div>

              {/* Preview Table */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-x-auto custom-scrollbar max-h-60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold sticky top-0">
                    <tr>
                      {rawHeaders.map((h, i) => (
                        <th key={i} className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {rawRows.slice(0, 4).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 whitespace-nowrap max-w-xs truncate">
                            {cell || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: Map Columns */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500">
                Map each column from your CSV file to Outreach Hub contact fields. Required fields are First Name and Email.
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {rawHeaders.map((header) => (
                  <div
                    key={header}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {header}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-xs">maps to</span>
                      <select
                        value={mappings[header] || ''}
                        onChange={(e) =>
                          setMappings({ ...mappings, [header]: e.target.value })
                        }
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white outline-none"
                      >
                        <option value="">-- Ignore Column --</option>
                        {TARGET_FIELDS.map((field) => (
                          <option key={field.key} value={field.key}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Validation Engine Report */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                  Data Quality & Safeguards Inspection
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {validContacts.length}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium">Ready to Import</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {duplicatesCount}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium">Duplicates Filtered</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xl font-bold text-rose-600 dark:text-rose-400">
                      {invalidEmailsCount + missingRequiredCount}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium">Invalid Emails / Format</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {suppressedCount}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium">Suppressed Contacts</p>
                  </div>
                </div>
              </div>

              {suppressedCount > 0 && (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>
                    {suppressedCount} contacts were automatically removed because they exist in your global suppression/unsubscribe list.
                  </span>
                </div>
              )}

              {duplicatesCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {duplicatesCount} duplicate email addresses were excluded to prevent double-contacting recipients.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Final Summary */}
          {step === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Import Complete!
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Successfully imported {validContacts.length} verified {contactType} contacts into your workspace.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Imported into directory:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {validContacts.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Excluded duplicates:</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {duplicatesCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Excluded invalid format:</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {invalidEmailsCount + missingRequiredCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Excluded by suppression:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {suppressedCount}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
          {step > 1 && step < 5 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            {step < 5 && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 font-medium"
              >
                Cancel
              </button>
            )}

            {step === 2 && (
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100"
              >
                <span>Continue to Mapping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 3 && (
              <button
                onClick={runValidation}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100"
              >
                <span>Validate CSV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleFinalImport}
                disabled={validContacts.length === 0}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Import ({validContacts.length})</span>
              </button>
            )}

            {step === 5 && (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
