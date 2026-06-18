import { useState, useEffect, useRef } from 'react';
import {
  Search, X, User, FileText, Wrench, ClipboardList, LayoutGrid, HelpCircle, Plus,
} from 'lucide-react';

interface MockRecord {
  id: string;
  type: 'customer' | 'invoice' | 'estimate' | 'work-order' | 'activity';
  title: string;
  meta: string;
  icon: 'User' | 'FileText' | 'Wrench' | 'ClipboardList';
}

interface Module {
  label: string;
  page: string;
}

const MOCK_RECORDS: MockRecord[] = [
  { id: 'c1', type: 'customer', title: 'Adam Smith', meta: 'Customer · Sunny LTD', icon: 'User' },
  { id: 'c2', type: 'customer', title: 'Amanda Sanders', meta: 'Customer · Entertainment Co', icon: 'User' },
  { id: 'c3', type: 'customer', title: 'James Martinez', meta: 'Customer · Coastal Hospitality', icon: 'User' },
  { id: 'c4', type: 'customer', title: 'Emily Davis', meta: 'Customer · BuildRight Co', icon: 'User' },
  { id: 'c5', type: 'customer', title: 'Michael Chen', meta: 'Customer · Pinnacle Inc', icon: 'User' },
  { id: 'c6', type: 'customer', title: 'Serena Williams', meta: 'Customer lead · Sunny LTD', icon: 'User' },
  { id: 'c7', type: 'customer', title: 'Paul McLane', meta: 'Customer · Acme Corp', icon: 'User' },
  { id: 'i1', type: 'invoice', title: 'INV-1042 — Sunny LTD', meta: '$3,200 · Overdue', icon: 'FileText' },
  { id: 'i2', type: 'invoice', title: 'INV-1039 — BuildRight Co', meta: '$1,800 · Paid', icon: 'FileText' },
  { id: 'i3', type: 'invoice', title: 'INV-1044 — Entertainment Co', meta: '$750 · Draft', icon: 'FileText' },
  { id: 'i4', type: 'invoice', title: 'INV-1041 — Coastal Hospitality', meta: '$5,100 · Sent', icon: 'FileText' },
  { id: 'e1', type: 'estimate', title: 'EST-0084 — Sunny LTD', meta: '$5,400 · Sent', icon: 'ClipboardList' },
  { id: 'e2', type: 'estimate', title: 'EST-0081 — Coastal Hospitality', meta: '$2,100 · Active', icon: 'ClipboardList' },
  { id: 'e3', type: 'estimate', title: 'EST-0079 — BuildRight Co', meta: '$900 · Draft', icon: 'ClipboardList' },
  { id: 'w1', type: 'work-order', title: 'WO-2231 — Fix HVAC, Coastal', meta: 'Scheduled · Fri Jun 20', icon: 'Wrench' },
  { id: 'w2', type: 'work-order', title: 'WO-2228 — Electrical install', meta: 'In Progress', icon: 'Wrench' },
  { id: 'w3', type: 'work-order', title: 'WO-2225 — Plumbing repair', meta: 'Completed', icon: 'Wrench' },
  { id: 'a1', type: 'activity', title: 'Follow-up call with Sunny LTD', meta: 'Activity · Due today', icon: 'FileText' },
  { id: 'a2', type: 'activity', title: 'Send proposal to BuildRight Co', meta: 'Activity · Overdue', icon: 'FileText' },
  { id: 'a3', type: 'activity', title: 'Review estimate EST-0084', meta: 'Activity · Tomorrow', icon: 'FileText' },
];

const MODULES: Module[] = [
  { label: 'Home', page: 'home' },
  { label: 'Customers & Leads', page: 'customers' },
  { label: 'Invoices', page: 'invoices' },
  { label: 'Estimates', page: 'estimates' },
  { label: 'Work Orders', page: 'work-orders' },
  { label: 'Payments', page: 'payments' },
  { label: 'Activities', page: 'activities' },
  { label: 'Time Tracking', page: 'time-tracking' },
  { label: 'Account Settings', page: 'account-settings' },
  { label: 'Users', page: 'plan-team' },
];

const ICON_MAP = { User, FileText, Wrench, ClipboardList };

const TYPE_STYLE: Record<string, { bg: string; text: string }> = {
  customer: { bg: 'bg-blue-50', text: 'text-blue-500' },
  invoice: { bg: 'bg-slate-100', text: 'text-slate-500' },
  estimate: { bg: 'bg-indigo-50', text: 'text-indigo-500' },
  'work-order': { bg: 'bg-orange-50', text: 'text-orange-500' },
  activity: { bg: 'bg-gray-100', text: 'text-gray-400' },
};

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="font-semibold text-gray-900">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

interface GlobalSearchProps {
  onNavigate?: (page: string) => void;
}

export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const q = value.trim().toLowerCase();

  const records = q
    ? MOCK_RECORDS.filter(
        (r) => r.title.toLowerCase().includes(q) || r.meta.toLowerCase().includes(q)
      ).slice(0, 6)
    : [];

  const moduleMatches = q
    ? MODULES.filter((m) => m.label.toLowerCase().includes(q)).slice(0, 2)
    : [];

  const hasResults = records.length > 0 || moduleMatches.length > 0;
  const showEmpty = open && q.length > 0 && !hasResults;
  const showResults = open && q.length > 0 && hasResults;
  const showDropdown = showResults || showEmpty;

  // "/" shortcut to focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !focused &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && open) close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [focused, open]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function close() {
    setOpen(false);
    setFocused(false);
    setValue('');
    inputRef.current?.blur();
  }

  function handleNavigate(page: string) {
    close();
    onNavigate?.(page);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by name, date, or app"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
          className={`w-full h-8 pl-9 text-sm rounded-lg border bg-[#F6FAFB] outline-none transition-all placeholder:text-gray-400 ${
            value ? 'pr-8' : 'pr-20'
          } ${
            focused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
          }`}
        />
        {value ? (
          <button
            onMouseDown={(e) => { e.preventDefault(); setValue(''); inputRef.current?.focus(); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200 transition-colors"
          >
            <X className="h-3.5 w-3.5 text-gray-500" />
          </button>
        ) : !focused ? (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-gray-100 text-gray-500 text-xs rounded px-1.5 py-0.5 pointer-events-none select-none">
            /
          </div>
        ) : null}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 z-[9999] overflow-hidden py-2">

          {showResults && (
            <>
              {/* Module matches */}
              {moduleMatches.length > 0 && (
                <div className="px-2 mb-1">
                  {moduleMatches.map((mod) => (
                    <button
                      key={mod.page}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleNavigate(mod.page)}
                      className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <div className="h-6 w-6 rounded flex items-center justify-center shrink-0 bg-blue-900/10">
                        <LayoutGrid className="h-3.5 w-3.5 text-blue-900" />
                      </div>
                      <span className="flex-1 min-w-0 text-sm text-gray-800 truncate">
                        <Highlight text={mod.label} query={value.trim()} />
                      </span>
                      <span className="text-xs text-blue-600 shrink-0 font-medium">Go to app →</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Record results */}
              {records.length > 0 && (
                <div className="px-2">
                  {moduleMatches.length > 0 && records.length > 0 && (
                    <div className="border-t border-gray-100 my-1" />
                  )}
                  {records.map((r) => {
                    const Icon = ICON_MAP[r.icon];
                    const style = TYPE_STYLE[r.type] ?? { bg: 'bg-gray-100', text: 'text-gray-500' };
                    return (
                      <button
                        key={r.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={close}
                        className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <div className={`h-6 w-6 rounded flex items-center justify-center shrink-0 ${style.bg}`}>
                          <Icon className={`h-3.5 w-3.5 ${style.text}`} />
                        </div>
                        <span className="flex-1 min-w-0 text-sm text-gray-800 truncate">
                          <Highlight text={r.title} query={value.trim()} />
                        </span>
                        <span className="text-xs text-gray-400 shrink-0 max-w-[160px] truncate text-right">
                          {r.meta}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Help + footer */}
              <div className="px-2">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <div className="h-6 w-6 rounded flex items-center justify-center shrink-0 bg-gray-100">
                    <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">
                    Search &ldquo;{value}&rdquo; in help center
                  </span>
                </button>
              </div>

              <div className="border-t border-gray-100 mt-1 px-4 py-2.5 flex items-center justify-between">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={close}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  See all results ({records.length + moduleMatches.length})
                </button>
                <span className="text-xs text-gray-400">Press ESC to close</span>
              </div>
            </>
          )}

          {showEmpty && (
            <div className="px-4 py-4">
              <p className="text-sm font-medium text-gray-700 mb-3">No results for &ldquo;{value}&rdquo;</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add customer
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add activity
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5" /> Search help center
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
