import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { appTiles } from '@/components/AppsGrid';

interface ApplicationsAccessPageProps {
  /** The user whose application access is being managed. */
  user: string;
  /** App name to scroll to + highlight on open (the app the user came from). */
  scrollToApp?: string;
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

const FILTERS = ['All', 'Subscribed', 'CRM', 'Sales', 'Field Services', 'Non-Profit', 'Custom'];

export function ApplicationsAccessPage({
  user,
  scrollToApp,
  onBack,
  onNavigate,
}: ApplicationsAccessPageProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<string | null>(scrollToApp ?? null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Installed apps shown as access rows — same set + order as the home App tab.
  const apps = useMemo(
    () => appTiles.filter((a) => a.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query]
  );

  // On open, scroll to the originating app and pulse a highlight so it's easy to spot.
  useEffect(() => {
    if (!scrollToApp) return;
    const row = rowRefs.current[scrollToApp];
    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const t = setTimeout(() => setHighlighted(null), 2200);
    return () => clearTimeout(t);
  }, [scrollToApp]);

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-1.5 text-sm mb-4">
          <button
            onClick={() => onNavigate?.('account-settings')}
            className="text-blue-600 hover:underline"
          >
            Account Settings
          </button>
          <span className="text-gray-300">/</span>
          <button onClick={onBack} className="text-blue-600 hover:underline">
            Users
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600">{user}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">Applications Access</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Applications access</h1>
        <p className="text-gray-500 max-w-3xl mb-6">
          Manage which applications or features {user} can access within the system, ensuring they
          have access to the data they need to do their job effectively.
        </p>

        {/* Filters + search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-500 mr-1">Apps</span>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  activeFilter === f
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full rounded-md border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* App rows */}
        <div className="space-y-2">
          {apps.map((app) => {
            const Icon = app.icon;
            const isHighlighted = highlighted === app.name;
            const isOpen = expanded === app.name;
            return (
              <div
                key={app.name}
                ref={(el) => (rowRefs.current[app.name] = el)}
                className={`rounded-md border bg-white transition-colors ${
                  isHighlighted
                    ? 'border-blue-400 ring-2 ring-blue-200'
                    : 'border-gray-200'
                }`}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : app.name)}
                  className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="font-medium text-gray-800 truncate">{app.name}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Subscribed
                    </span>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                    <span className="hidden sm:inline text-xs font-medium text-blue-600">
                      1 App enabled
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
                    Configure who can view, create, edit, and delete records in {app.name} for{' '}
                    {user}.
                  </div>
                )}
              </div>
            );
          })}
          {apps.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">No apps match "{query}".</p>
          )}
        </div>

        {/* Save */}
        <div className="flex mt-8">
          <button className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            Save all changes
          </button>
        </div>
      </div>
    </div>
  );
}
