import { useState, useRef, useMemo } from 'react';
import {
  Search, X, Check, Download, Users, CreditCard,
  ChevronRight, SlidersHorizontal, LayoutDashboard, Kanban, RotateCcw, ShieldCheck, ArrowRight,
} from 'lucide-react';
import { appTiles } from '@/components/AppsGrid';

interface ApplicationsAccessPageProps {
  user: string;
  scrollToApp?: string;
  isAdmin?: boolean;
  onBack?: () => void;
  onChangeRole?: () => void;
  onNavigate?: (page: string) => void;
}

type Permission = 'view' | 'edit' | 'customize';

interface AppDef {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CUSTOM_APPS: AppDef[] = [
  {
    name: 'Customer Intake Form',
    description: 'Custom web form for capturing new customer details and routing them into CRM.',
    icon: LayoutDashboard,
  },
  {
    name: 'Project Tracker',
    description: 'Internal project management board built for the ops team.',
    icon: Kanban,
  },
];

const PERM_LABELS: Record<Permission, string> = { view: 'View only', edit: 'Edit', customize: 'Edit & customize' };

// ── Fixed-position hover tooltip ───────────────────────────────────────────────

function InfoTooltip({ content }: { content: React.ReactNode }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  function show() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top - 6 });
    }
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={show}
        onMouseLeave={() => setPos(null)}
        className="flex-shrink-0 w-[14px] h-[14px] rounded-full border border-gray-300 text-gray-400 text-[9px] font-bold flex items-center justify-center hover:border-gray-500 hover:text-gray-600 transition-colors select-none leading-none"
      >
        ?
      </button>
      {pos && (
        <div
          style={{
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
          }}
          className="w-60 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl pointer-events-none"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-900" />
        </div>
      )}
    </>
  );
}

const PERMISSION_TOOLTIP = (
  <div className="space-y-1.5">
    <div><span className="font-semibold text-white">View only</span><span className="text-gray-300"> — Can see records and data. Cannot make changes.</span></div>
    <div><span className="font-semibold text-white">Edit</span><span className="text-gray-300"> — Can create, modify, and delete records.</span></div>
    <div><span className="font-semibold text-white">Edit & customize</span><span className="text-gray-300"> — Full access including app layout, fields, and settings.</span></div>
  </div>
);

// ── Shared toggle ──────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform mt-[3px] ${
          checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}

// ── Permission segmented control ───────────────────────────────────────────────

function PermissionControl({
  value,
  onChange,
  disabled,
}: {
  value: Permission;
  onChange: (p: Permission) => void;
  disabled?: boolean;
}) {
  const perms: Permission[] = ['view', 'edit', 'customize'];
  return (
    <div
      className={`flex items-center rounded-md border border-gray-200 overflow-hidden text-xs font-medium select-none ${
        disabled ? 'opacity-30 pointer-events-none' : ''
      }`}
    >
      {perms.map((p, i) => (
        <button
          key={p}
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(p); }}
          className={`px-2.5 py-1 transition-colors ${
            value === p
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          } ${i > 0 ? 'border-l border-gray-200' : ''}`}
        >
          {PERM_LABELS[p]}
        </button>
      ))}
    </div>
  );
}

// ── App row ────────────────────────────────────────────────────────────────────

function AppRow({
  app,
  access,
  permission,
  disabled = false,
  multiSelectMode,
  isSelected,
  highlighted,
  onToggleAccess,
  onPermissionChange,
  onToggleSelect,
}: {
  app: AppDef;
  access: boolean;
  permission: Permission;
  disabled?: boolean;
  multiSelectMode: boolean;
  isSelected: boolean;
  highlighted: boolean;
  onToggleAccess: () => void;
  onPermissionChange: (p: Permission) => void;
  onToggleSelect: () => void;
}) {
  const Icon = app.icon;
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-0 transition-colors ${
        highlighted ? 'bg-blue-50' : isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50/60'
      }`}
    >
      {multiSelectMode && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
          className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-blue-400 bg-white'
          }`}
        >
          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
        </button>
      )}
      <Icon
        className={`w-4 h-4 flex-shrink-0 transition-colors ${
          access ? 'text-blue-500' : 'text-gray-300'
        }`}
      />
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span
          className={`text-sm font-medium truncate transition-colors ${
            access ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {app.name}
        </span>
        {app.description && (
          <InfoTooltip content={<span className="text-gray-300 leading-relaxed">{app.description}</span>} />
        )}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <PermissionControl
          value={permission}
          onChange={onPermissionChange}
          disabled={disabled || !access}
        />
        <Toggle checked={access} onChange={onToggleAccess} disabled={disabled} />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export function ApplicationsAccessPage({
  user,
  scrollToApp,
  isAdmin = false,
  onBack,
  onChangeRole,
  onNavigate,
}: ApplicationsAccessPageProps) {
  const stockApps: AppDef[] = appTiles.map((a) => ({
    name: a.name,
    description: a.description ?? '',
    icon: a.icon,
  }));
  const allApps = [...stockApps, ...CUSTOM_APPS];

  // Initial state refs (populated once via lazy useState initializers)
  const initAccess = useRef<Record<string, boolean>>({});
  const initPerm = useRef<Record<string, Permission>>({});
  const initBilling = useRef(false);
  const initUserMgmt = useRef(false);
  const initExport = useRef(false);

  // Per-app state
  const [appAccess, setAppAccess] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    allApps.forEach((a) => { m[a.name] = true; });
    initAccess.current = { ...m };
    return m;
  });
  const [appPermission, setAppPermission] = useState<Record<string, Permission>>(() => {
    const m: Record<string, Permission> = {};
    allApps.forEach((a) => { m[a.name] = 'customize'; });
    initPerm.current = { ...m };
    return m;
  });

  // Multi-select
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Search + highlight
  const [query, setQuery] = useState('');
  const [highlighted] = useState<string | null>(scrollToApp ?? null);

  // Extra permissions
  const [billingAccess, setBillingAccess] = useState(false);
  const [userMgmtAccess, setUserMgmtAccess] = useState(false);
  const [exportAccess, setExportAccess] = useState(false);

  // Save feedback
  const [savedAll, setSavedAll] = useState(false);

  // Dirty detection
  const hasChanges = useMemo(() => {
    for (const key in initAccess.current) {
      if (appAccess[key] !== initAccess.current[key]) return true;
      if (appPermission[key] !== initPerm.current[key]) return true;
    }
    return (
      billingAccess !== initBilling.current ||
      userMgmtAccess !== initUserMgmt.current ||
      exportAccess !== initExport.current
    );
  }, [appAccess, appPermission, billingAccess, userMgmtAccess, exportAccess]);

  // ── Actions ──

  function saveAll() {
    initAccess.current = { ...appAccess };
    initPerm.current = { ...appPermission };
    initBilling.current = billingAccess;
    initUserMgmt.current = userMgmtAccess;
    initExport.current = exportAccess;
    setSavedAll(true);
    setTimeout(() => setSavedAll(false), 2000);
  }

  function undoChanges() {
    setAppAccess({ ...initAccess.current });
    setAppPermission({ ...initPerm.current });
    setBillingAccess(initBilling.current);
    setUserMgmtAccess(initUserMgmt.current);
    setExportAccess(initExport.current);
    setSavedAll(false);
  }

  function setAllPermission(p: Permission) {
    const nextPerm: Record<string, Permission> = {};
    const nextAccess: Record<string, boolean> = {};
    allApps.forEach((a) => { nextPerm[a.name] = p; nextAccess[a.name] = true; });
    setAppPermission(nextPerm);
    setAppAccess(nextAccess);
  }

  function toggleAccess(name: string) {
    setAppAccess((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function setPermission(name: string, p: Permission) {
    setAppPermission((prev) => ({ ...prev, [name]: p }));
  }

  function toggleSelect(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  function bulkSetPermission(p: Permission) {
    const nextPerm = { ...appPermission };
    const nextAccess = { ...appAccess };
    selected.forEach((name) => { nextPerm[name] = p; nextAccess[name] = true; });
    setAppPermission(nextPerm);
    setAppAccess(nextAccess);
  }

  function bulkSetAccess(v: boolean) {
    const next = { ...appAccess };
    selected.forEach((name) => { next[name] = v; });
    setAppAccess(next);
  }

  function filterApps(apps: AppDef[]) {
    const q = query.trim().toLowerCase();
    return q ? apps.filter((a) => a.name.toLowerCase().includes(q)) : apps;
  }

  const filteredStock = filterApps(stockApps);
  const filteredCustom = filterApps(CUSTOM_APPS);
  const noResults = filteredStock.length === 0 && filteredCustom.length === 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-5">

          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <button
              onClick={() => onNavigate?.('account-settings')}
              className="text-blue-600 hover:underline"
            >
              Account Settings
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <button onClick={onBack} className="text-blue-600 hover:underline">Users</button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-blue-600">{user}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">App Access</span>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">App access</h1>
            <p className="mt-1 text-sm text-gray-500">
              Control which apps {user} can use and what they can do in each one.
            </p>
          </div>

          {/* ── Admin locked banner ── */}
          {isAdmin && (
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
              <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900">Admins have full access to everything</p>
                <p className="text-sm text-blue-700 mt-0.5">
                  All app permissions are automatically granted to admins and cannot be restricted individually. To limit access, change this user's role first.
                </p>
              </div>
              <button
                onClick={onChangeRole}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap transition-colors flex-shrink-0 mt-0.5"
              >
                Change role <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ── Quick overrides (hidden for admins) ── */}
          {!isAdmin && <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-0.5">Quick overrides</h2>
            <p className="text-xs text-gray-500 mb-4">
              Apply a permission level to all apps at once. Individual settings can be adjusted after.
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { label: 'View only — all apps', p: 'view' as Permission },
                  { label: 'Edit — all apps', p: 'edit' as Permission },
                  { label: 'Full access — all apps', p: 'customize' as Permission },
                ] as const
              ).map(({ label, p }) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAllPermission(p)}
                  className="px-3.5 py-2 rounded-lg border border-blue-300 text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors font-medium"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>}

          {/* ── Apps ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700">Apps</h2>
              <div className="flex items-center gap-2">
                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() => { setMultiSelectMode((m) => !m); setSelected(new Set()); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      multiSelectMode
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-500 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Multi-select
                  </button>
                )}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search apps"
                    className="rounded-lg border border-gray-200 pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
                  />
                </div>
              </div>
            </div>

            {/* Bulk action bar */}
            {multiSelectMode && selected.size > 0 && (
              <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 bg-blue-50 border-b border-blue-100">
                <span className="text-xs font-semibold text-blue-700">{selected.size} selected</span>
                <span className="text-blue-300 text-xs">|</span>
                <span className="text-xs text-blue-600">Set to:</span>
                {(['view', 'edit', 'customize'] as Permission[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => bulkSetPermission(p)}
                    className="px-2.5 py-1 rounded text-xs font-medium bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors capitalize"
                  >
                    {p}
                  </button>
                ))}
                <span className="text-blue-300 text-xs">|</span>
                <button
                  type="button"
                  onClick={() => bulkSetAccess(true)}
                  className="px-2.5 py-1 rounded text-xs font-medium bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  Enable all
                </button>
                <button
                  type="button"
                  onClick={() => bulkSetAccess(false)}
                  className="px-2.5 py-1 rounded text-xs font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Disable all
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="ml-auto p-1 text-blue-400 hover:text-blue-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Column labels */}
            {!noResults && (
              <div className="flex items-center gap-3 px-5 py-2 bg-gray-50/80 border-b border-gray-100">
                {multiSelectMode && <div className="w-4 flex-shrink-0" />}
                <div className="w-4 flex-shrink-0" />
                <span className="flex-1 text-xs font-medium text-gray-400 uppercase tracking-wide">App</span>
                <div className="flex items-center gap-1.5 mr-[36px]">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Permission</span>
                  <InfoTooltip content={PERMISSION_TOOLTIP} />
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide w-14">Access</span>
              </div>
            )}

            {/* Method Apps group */}
            {filteredStock.length > 0 && (
              <>
                <div className="px-5 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Method Apps
                  </span>
                </div>
                {filteredStock.map((app) => (
                  <AppRow
                    key={app.name}
                    app={app}
                    access={isAdmin ? true : (appAccess[app.name] ?? true)}
                    permission={isAdmin ? 'customize' : (appPermission[app.name] ?? 'customize')}
                    disabled={isAdmin}
                    multiSelectMode={isAdmin ? false : multiSelectMode}
                    isSelected={isAdmin ? false : selected.has(app.name)}
                    highlighted={highlighted === app.name}
                    onToggleAccess={() => toggleAccess(app.name)}
                    onPermissionChange={(p) => setPermission(app.name, p)}
                    onToggleSelect={() => toggleSelect(app.name)}
                  />
                ))}
              </>
            )}

            {/* Custom Apps group */}
            {filteredCustom.length > 0 && (
              <>
                <div className="px-5 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Custom Apps
                  </span>
                </div>
                {filteredCustom.map((app) => (
                  <AppRow
                    key={app.name}
                    app={app}
                    access={isAdmin ? true : (appAccess[app.name] ?? true)}
                    permission={isAdmin ? 'customize' : (appPermission[app.name] ?? 'customize')}
                    disabled={isAdmin}
                    multiSelectMode={isAdmin ? false : multiSelectMode}
                    isSelected={isAdmin ? false : selected.has(app.name)}
                    highlighted={false}
                    onToggleAccess={() => toggleAccess(app.name)}
                    onPermissionChange={(p) => setPermission(app.name, p)}
                    onToggleSelect={() => toggleSelect(app.name)}
                  />
                ))}
              </>
            )}

            {noResults && (
              <p className="text-sm text-gray-400 py-10 text-center">No apps match "{query}".</p>
            )}
          </div>

          {/* ── Extra permissions ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700">Extra permissions</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Grant access to admin areas outside of regular apps.
              </p>
            </div>
            {(
              [
                {
                  label: 'Billing',
                  desc: 'View and manage billing, invoices, and plan changes',
                  Icon: CreditCard,
                  value: billingAccess,
                  onChange: setBillingAccess,
                },
                {
                  label: 'User management',
                  desc: 'Invite, edit, and remove team members',
                  Icon: Users,
                  value: userMgmtAccess,
                  onChange: setUserMgmtAccess,
                },
                {
                  label: 'Data export',
                  desc: 'Export records and data to CSV or Excel',
                  Icon: Download,
                  value: exportAccess,
                  onChange: setExportAccess,
                },
              ] as const
            ).map(({ label, desc, Icon, value, onChange }, i) => (
              <div
                key={label}
                className={`flex items-center gap-4 px-5 py-3.5 ${i > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <Toggle checked={isAdmin ? true : value} onChange={onChange} disabled={isAdmin} />
              </div>
            ))}
          </div>

          {/* Bottom spacer so content clears the floating bar */}
          <div className="h-20" />

        </div>
      </div>

      {/* Floating save bar (never for admins — their settings are read-only) */}
      {!isAdmin && (hasChanges || savedAll) && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white rounded-xl shadow-2xl border border-gray-200 px-4 py-2.5">
          <span className="text-xs text-gray-400 mr-1">Unsaved changes</span>
          <button
            onClick={undoChanges}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Undo
          </button>
          <button
            onClick={saveAll}
            className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all ${
              savedAll
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {savedAll
              ? <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Saved</span>
              : 'Save all changes'}
          </button>
        </div>
      )}
    </>
  );
}
