import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Download,
  ClipboardList,
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
  { key: 'course', label: 'Course / Degree' },
  { key: 'section', label: 'Section' },
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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
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

  useEffect(() => {
    if (isOpen) {
      setContactType(defaultContactType);
      setStep(1);
      setFile(null);
      setPastedText('');
      setRawHeaders([]);
      setRawRows([]);
      setMappings({});
      setValidContacts([]);
    }
  }, [isOpen, defaultContactType]);

  if (!isOpen) return null;

  // Sample CSV generator for user convenience
  const handleDownloadSample = () => {
    const csvContent =
      contactType === 'Student'
        ? `First Name,Last Name,Email,College,Department,Batch,Roll Number,Course\nAarav,Patel,aarav.p@stanfordtech.edu,Stanford Tech Institute,Computer Science,2023-2027,CS23B102,B.Tech CSE\nMeera,Rao,meera.r@mitengineering.edu,MIT College of Engineering,Information Technology,2022-2026,IT22A044,B.Tech IT\n`
        : `First Name,Last Name,Email,Company,Role,Website,City,Observation,Offer\nDavid,Miller,david@precisiondentaltx.com,Precision Dental,Managing Partner,precisiondentaltx.com,Austin,mobile site takes 6.2s to load,Free Mobile Booking Funnel\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample_${contactType.toLowerCase().replace(/\s+/g, '_')}_outreach.csv`;
    link.click();
  };

  const parseTextData = (text: string) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 1) return;

    // Detect separator (tab vs comma)
    const firstLine = lines[0];
    const isTab = firstLine.includes('\t');
    const separator = isTab ? '\t' : ',';

    const headers = firstLine.split(separator).map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const rows = lines.slice(1).map((line) => {
      if (isTab) {
        return line.split('\t').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      }
      // Regex for CSV with quoted commas
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
      if (lower.includes('firstname') || lower === 'first' || lower === 'fname' || lower === 'name') {
        autoMap[h] = 'firstName';
      } else if (lower.includes('lastname') || lower === 'last' || lower === 'lname' || lower === 'surname') {
        autoMap[h] = 'lastName';
      } else if (lower.includes('email') || lower === 'mail') {
        autoMap[h] = 'email';
      } else if (lower.includes('company') || lower.includes('organization') || lower.includes('org')) {
        autoMap[h] = 'organization';
      } else if (lower.includes('college') || lower.includes('university') || lower.includes('campus') || lower.includes('institute')) {
        autoMap[h] = 'college';
      } else if (lower.includes('dept') || lower.includes('department') || lower.includes('branch')) {
        autoMap[h] = 'department';
      } else if (lower.includes('batch') || lower.includes('year') || lower.includes('cohort') || lower.includes('gradyear')) {
        autoMap[h] = 'batch';
      } else if (lower.includes('roll') || lower.includes('studentid') || lower.includes('regno') || lower.includes('usn')) {
        autoMap[h] = 'rollNumber';
      } else if (lower.includes('course') || lower.includes('degree') || lower.includes('program')) {
        autoMap[h] = 'course';
      } else if (lower.includes('section') || lower.includes('sec')) {
        autoMap[h] = 'section';
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
      parseTextData(text);
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
        parseTextData(text);
      };
      reader.readAsText(f);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    parseTextData(pastedText.trim());
  };

  // Validation Engine
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
        source: inputMode === 'upload' ? `CSV (${file?.name || 'File Upload'})` : 'Pasted Roster Data',
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

      // Check valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        invEmailCount++;
        return;
      }

      // Check duplicates
      if (seenInFile.has(email) || existingEmails.has(email)) {
        dupCount++;
        return;
      }

      // Check suppression / unsubscribe
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
    setStep(3);
  };

  const handleFinalImport = () => {
    onImportComplete(validContacts);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
              <span>Import {contactType === 'Student' ? 'Students Roster' : 'Client Leads'}</span>
            </h2>
            <p className="text-xs text-zinc-500">
              Step {step} of 4 —{' '}
              {step === 1 && 'Provide File or Paste Table'}
              {step === 2 && 'Map Columns & Preview'}
              {step === 3 && 'Validation & Inspection'}
              {step === 4 && 'Import Finished'}
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
          {/* STEP 1: Upload or Paste */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Type Selector */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
                <div>
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Contact Category
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Choose whether you are importing students or business clients
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
                      {type === 'Student' ? 'Students' : 'Clients'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Toggle: File vs Paste */}
              <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-4 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`pb-2 flex items-center gap-1.5 border-b-2 transition-all ${
                    inputMode === 'upload'
                      ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-semibold'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload File (.csv, .tsv)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`pb-2 flex items-center gap-1.5 border-b-2 transition-all ${
                    inputMode === 'paste'
                      ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-semibold'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Paste Columns (Excel / Sheets)</span>
                </button>
              </div>

              {inputMode === 'upload' ? (
                /* Drag Drop Area */
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
                    Accepts comma-separated or tab-separated student / client files.
                  </p>
                  <label className="cursor-pointer px-4 py-2 text-xs font-medium rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                    <span>Browse Files</span>
                    <input
                      type="file"
                      accept=".csv,.tsv,text/csv,text/tab-separated-values,text/plain"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              ) : (
                /* Paste Text Area */
                <div className="space-y-3">
                  <p className="text-xs text-zinc-500">
                    Copy columns from your Excel spreadsheet or Google Sheet and paste them below:
                  </p>
                  <textarea
                    rows={6}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder={
                      contactType === 'Student'
                        ? `First Name\tLast Name\tEmail\tCollege\tDepartment\tBatch\tRoll Number\nAarav\tPatel\taarav.p@stanfordtech.edu\tStanford Tech\tCSE\t2023-2027\tCS23B102`
                        : `First Name\tLast Name\tEmail\tCompany\tRole\tCity\nDavid\tMiller\tdavid@company.com\tApex Media\tPartner\tAustin`
                    }
                    className="w-full p-3 font-mono text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                  <button
                    type="button"
                    onClick={handlePasteSubmit}
                    disabled={!pastedText.trim()}
                    className="w-full py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all disabled:opacity-40"
                  >
                    Parse Pasted Columns
                  </button>
                </div>
              )}

              {/* Sample Download CTA */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-500">Need a sample file to fill in?</span>
                <button
                  onClick={handleDownloadSample}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample {contactType} CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Map Columns & Preview */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">
                  Detected <strong>{rawHeaders.length}</strong> columns and{' '}
                  <strong>{rawRows.length}</strong> rows
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium">
                  Auto-Mapped Fields
                </span>
              </div>

              {/* Column Mapping Grid */}
              <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5">
                {rawHeaders.map((header) => (
                  <div
                    key={header}
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 text-xs"
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
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white outline-none"
                      >
                        <option value="">-- Ignore --</option>
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

              {/* Quick Preview Table */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-x-auto custom-scrollbar max-h-40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold sticky top-0">
                    <tr>
                      {rawHeaders.map((h, i) => (
                        <th key={i} className="px-3 py-1.5 border-b border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {rawRows.slice(0, 3).map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap max-w-xs truncate">
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

          {/* STEP 3: Validation Report */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                  Verification Summary
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
                    <p className="text-[11px] text-zinc-500 font-medium">Duplicate Emails</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xl font-bold text-rose-600 dark:text-rose-400">
                      {invalidEmailsCount + missingRequiredCount}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium">Invalid / Missing</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {suppressedCount}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium">Suppressed</p>
                  </div>
                </div>
              </div>

              {validContacts.length === 0 ? (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>No valid rows found. Please check that First Name and Email columns are properly mapped.</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{validContacts.length} valid {contactType.toLowerCase()} contacts are ready to be added to your directory.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Final Success */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Import Complete!
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Successfully imported {validContacts.length} {contactType} contacts into your database.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
          {step > 1 && step < 4 ? (
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
            {step < 4 && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 font-medium"
              >
                Cancel
              </button>
            )}

            {step === 2 && (
              <button
                onClick={runValidation}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer"
              >
                <span>Validate & Inspect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleFinalImport}
                disabled={validContacts.length === 0}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Import ({validContacts.length})</span>
              </button>
            )}

            {step === 4 && (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer"
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
