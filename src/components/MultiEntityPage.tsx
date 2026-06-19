import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, Building2, Users, Search, Settings, LogIn, Plus,
  ChevronDown, ChevronUp, Check, MoreVertical, ArrowUpDown, LayoutList,
  X, Mail, Pencil,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type Tab = 'entities' | 'users';

interface Entity {
  id: string;
  name: string;
  tags: string[];
  userCount: number;
  status: 'Synced' | 'Unsynced';
  isMain?: boolean;
}

interface MEUser {
  id: string;
  initials: string;
  color: string;
  name: string;
  email: string;
  role: string;
  entityNames: string[];
  status: 'Active' | 'Invited';
}

interface EntityUser {
  id: string;
  initials: string;
  color: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited';
  accessApps: string[];
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const INITIAL_ENTITIES: Entity[] = [
  { id: 'main', name: 'Horizons Inc', tags: ['Headquarters', 'USA'], userCount: 4, status: 'Synced', isMain: true },
  { id: 'nyc', name: 'Horizons NYC', tags: ['USA'], userCount: 3, status: 'Synced' },
  { id: 'bay', name: 'Horizons Bay Area', tags: ['USA'], userCount: 3, status: 'Synced' },
  { id: 'texas', name: 'Horizons Texas', tags: ['USA'], userCount: 2, status: 'Synced' },
  { id: 'la', name: 'Horizons LA', tags: ['USA'], userCount: 2, status: 'Synced' },
  { id: 'chicago', name: 'Horizons Chicago', tags: ['USA'], userCount: 1, status: 'Synced' },
  { id: 'miami', name: 'Horizons Miami', tags: ['USA'], userCount: 2, status: 'Synced' },
];

const ALL_APPS = [
  'Accounts', 'Activities', 'Bills', 'Cases', 'Classes',
  'Customers & Leads', 'Donations', 'Estimates', 'Invoices', 'Items',
  'Opportunities', 'Payments', 'Sales Receipts', 'Terms', 'Vendors',
  'Send Email', 'Web to Lead',
];

const INITIAL_ME_USERS: MEUser[] = [
  {
    id: 'paul',
    initials: 'PM',
    color: 'bg-blue-600',
    name: 'Paul McLane',
    email: 'paul@horizonsinc.com',
    role: 'Super Admin',
    entityNames: INITIAL_ENTITIES.map(e => e.name),
    status: 'Active',
  },
  {
    id: 'sw',
    initials: 'SW',
    color: 'bg-purple-500',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@horizonsinc.com',
    role: 'Super Admin',
    entityNames: ['Horizons Inc', 'Horizons NYC', 'Horizons Bay Area', 'Horizons Texas'],
    status: 'Invited',
  },
  {
    id: 'mc',
    initials: 'MC',
    color: 'bg-teal-500',
    name: 'Michael Chen',
    email: 'm.chen@horizonsbayarea.com',
    role: 'Regular',
    entityNames: ['Horizons Bay Area'],
    status: 'Active',
  },
  {
    id: 'ed',
    initials: 'ED',
    color: 'bg-green-500',
    name: 'Emma Davis',
    email: 'emma.d@horizonstexas.com',
    role: 'Regular',
    entityNames: ['Horizons Texas', 'Horizons Miami'],
    status: 'Active',
  },
  {
    id: 'jm',
    initials: 'JM',
    color: 'bg-amber-500',
    name: 'James Miller',
    email: 'j.miller@horizonsla.com',
    role: 'Regular',
    entityNames: ['Horizons LA'],
    status: 'Invited',
  },
];

const ENTITY_USERS_MAP: Record<string, EntityUser[]> = {
  main: [
    { id: 'paul', initials: 'PM', color: 'bg-blue-600', name: 'Paul McLane', email: 'paul@horizonsinc.com', role: 'Super Admin', status: 'Active', accessApps: ALL_APPS },
    { id: 'sw', initials: 'SW', color: 'bg-purple-500', name: 'Sarah Wilson', email: 'sarah.wilson@horizonsinc.com', role: 'Super Admin', status: 'Invited', accessApps: ALL_APPS },
  ],
  nyc: [
    { id: 'paul', initials: 'PM', color: 'bg-blue-600', name: 'Paul McLane', email: 'paul@horizonsinc.com', role: 'Super Admin', status: 'Active', accessApps: ALL_APPS },
    { id: 'sw', initials: 'SW', color: 'bg-purple-500', name: 'Sarah Wilson', email: 'sarah.wilson@horizonsinc.com', role: 'Super Admin', status: 'Invited', accessApps: ALL_APPS.slice(0, 10) },
    { id: 'mc', initials: 'MC', color: 'bg-teal-500', name: 'Michael Chen', email: 'm.chen@horizonsbayarea.com', role: 'Regular', status: 'Active', accessApps: ALL_APPS.slice(0, 8) },
  ],
  bay: [
    { id: 'paul', initials: 'PM', color: 'bg-blue-600', name: 'Paul McLane', email: 'paul@horizonsinc.com', role: 'Super Admin', status: 'Active', accessApps: ALL_APPS },
    { id: 'sw', initials: 'SW', color: 'bg-purple-500', name: 'Sarah Wilson', email: 'sarah.wilson@horizonsinc.com', role: 'Super Admin', status: 'Invited', accessApps: ALL_APPS.slice(0, 9) },
    { id: 'mc', initials: 'MC', color: 'bg-teal-500', name: 'Michael Chen', email: 'm.chen@horizonsbayarea.com', role: 'Regular', status: 'Active', accessApps: ALL_APPS.slice(0, 8) },
  ],
  texas: [
    { id: 'paul', initials: 'PM', color: 'bg-blue-600', name: 'Paul McLane', email: 'paul@horizonsinc.com', role: 'Super Admin', status: 'Active', accessApps: ALL_APPS },
    { id: 'ed', initials: 'ED', color: 'bg-green-500', name: 'Emma Davis', email: 'emma.d@horizonstexas.com', role: 'Regular', status: 'Active', accessApps: ALL_APPS.slice(0, 7) },
  ],
  la: [
    { id: 'paul', initials: 'PM', color: 'bg-blue-600', name: 'Paul McLane', email: 'paul@horizonsinc.com', role: 'Super Admin', status: 'Active', accessApps: ALL_APPS },
    { id: 'jm', initials: 'JM', color: 'bg-amber-500', name: 'James Miller', email: 'j.miller@horizonsla.com', role: 'Regular', status: 'Invited', accessApps: ALL_APPS.slice(0, 6) },
  ],
  chicago: [
    { id: 'paul', initials: 'PM', color: 'bg-blue-600', name: 'Paul McLane', email: 'paul@horizonsinc.com', role: 'Super Admin', status: 'Active', accessApps: ALL_APPS },
  ],
  miami: [
    { id: 'paul', initials: 'PM', color: 'bg-blue-600', name: 'Paul McLane', email: 'paul@horizonsinc.com', role: 'Super Admin', status: 'Active', accessApps: ALL_APPS },
    { id: 'ed', initials: 'ED', color: 'bg-green-500', name: 'Emma Davis', email: 'emma.d@horizonstexas.com', role: 'Regular', status: 'Active', accessApps: ALL_APPS.slice(0, 5) },
  ],
};

const USER_ENTITY_ACCESS: Record<string, { entityId: string; entityName: string; isMain?: boolean; apps: string[] }[]> = {
  paul: INITIAL_ENTITIES.map(e => ({ entityId: e.id, entityName: e.name, isMain: e.isMain, apps: ALL_APPS })),
  sw: [
    { entityId: 'main', entityName: 'Horizons Inc', isMain: true, apps: ALL_APPS },
    { entityId: 'nyc', entityName: 'Horizons NYC', apps: ALL_APPS.slice(0, 10) },
    { entityId: 'bay', entityName: 'Horizons Bay Area', apps: ALL_APPS.slice(0, 9) },
    { entityId: 'texas', entityName: 'Horizons Texas', apps: ALL_APPS.slice(0, 11) },
  ],
  mc: [{ entityId: 'bay', entityName: 'Horizons Bay Area', apps: ALL_APPS.slice(0, 8) }],
  ed: [
    { entityId: 'texas', entityName: 'Horizons Texas', apps: ALL_APPS.slice(0, 7) },
    { entityId: 'miami', entityName: 'Horizons Miami', apps: ALL_APPS.slice(0, 5) },
  ],
  jm: [{ entityId: 'la', entityName: 'Horizons LA', apps: ALL_APPS.slice(0, 6) }],
};

// ── Shared UI ──────────────────────────────────────────────────────────────────

function EntityIcon({ isMain, lg }: { isMain?: boolean; lg?: boolean }) {
  const box = lg ? 'w-10 h-10 rounded-xl' : 'w-8 h-8 rounded-lg';
  const icon = lg ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className={`${box} flex items-center justify-center flex-shrink-0 ${isMain ? 'bg-blue-600' : 'bg-indigo-100'}`}>
      <Building2 className={`${icon} ${isMain ? 'text-white' : 'text-indigo-500'}`} />
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
      <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      {role}
    </span>
  );
}

function StatusDot({ status }: { status: 'Active' | 'Invited' }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /> Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
      <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" /> Invited
    </span>
  );
}

function SyncedBadge({ status }: { status: 'Synced' | 'Unsynced' }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${
      status === 'Synced' ? 'border-gray-300 text-gray-600 bg-white' : 'border-amber-300 text-amber-700 bg-amber-50'
    }`}>
      {status === 'Synced' && <Check className="w-3 h-3 text-green-600" />}
      {status}
    </span>
  );
}

function AppBadges({ apps, maxShow = 3 }: { apps: string[]; maxShow?: number }) {
  const shown = apps.slice(0, maxShow);
  const rest = apps.length - maxShow;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {shown.map(app => (
        <span key={app} className="px-2 py-0.5 text-xs text-gray-600 border border-gray-200 rounded bg-gray-50 whitespace-nowrap">{app}</span>
      ))}
      {rest > 0 && <span className="px-2 py-0.5 text-xs text-gray-500 border border-gray-200 rounded bg-gray-50">+{rest}</span>}
    </div>
  );
}

function PaginationFooter({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100">
      <span className="text-sm text-gray-500">Per Page</span>
      <button className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 border border-gray-200 rounded px-2 py-0.5">
        10 <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <span className="text-sm text-gray-500">{count} results</span>
    </div>
  );
}

function SearchSortBar({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
        <ArrowUpDown className="w-4 h-4" />
      </button>
      <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
        <LayoutList className="w-4 h-4" />
      </button>
    </div>
  );
}

function HelpArticles() {
  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-gray-900 mb-2">Help articles</h3>
      <ul className="space-y-1">
        <li><button className="text-sm text-blue-600 hover:underline">What is Multi-entity?</button></li>
        <li><button className="text-sm text-blue-600 hover:underline">Multi-entity pricing</button></li>
      </ul>
    </div>
  );
}

// ── Invite Modal ───────────────────────────────────────────────────────────────

interface InviteRow { email: string; role: string; username: string; showUsername: boolean }
const ME_ROLES_LIST = ['Super Admin', 'Admin', 'Customizer', 'Regular'] as const;

function MEInviteModal({
  onClose,
  onInvite,
  entities,
  currentUsers,
  defaultRole = 'Super Admin',
}: {
  onClose: () => void;
  onInvite: (emails: string[], role: string) => void;
  entities: Entity[];
  currentUsers: MEUser[];
  defaultRole?: string;
}) {
  const [rows, setRows] = useState<InviteRow[]>([{ email: '', role: defaultRole, username: '', showUsername: false }]);
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>(entities.map(e => e.id));
  const [copyFromUserId, setCopyFromUserId] = useState('');
  const [copyDropdownOpen, setCopyDropdownOpen] = useState(false);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (copyRef.current && !copyRef.current.contains(e.target as Node)) setCopyDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const updateRow = (i: number, patch: Partial<InviteRow>) =>
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const addRow = () => setRows(prev => [...prev, { email: '', role: defaultRole, username: '', showUsername: false }]);
  const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));
  const toggleEntity = (id: string) =>
    setSelectedEntityIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const canSend = rows.some(r => r.email.trim()) && selectedEntityIds.length > 0;
  const copyUser = currentUsers.find(u => u.id === copyFromUserId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Invite to your team</h2>
            <p className="text-xs text-gray-500 mt-0.5">Invited users will receive an email with login instructions.</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-2 items-start">
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Email</label>
                    <input type="email" placeholder="user@company.com" value={row.email}
                      onChange={e => updateRow(i, { email: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Role</label>
                    <div className="relative">
                      <select value={row.role} onChange={e => updateRow(i, { role: e.target.value })}
                        className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {ME_ROLES_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  {rows.length > 1 && (
                    <button onClick={() => removeRow(i)} className="mt-5 p-1.5 text-gray-300 hover:text-red-500 rounded transition-colors flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button type="button" onClick={() => updateRow(i, { showUsername: !row.showUsername })}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  {row.showUsername ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {row.showUsername ? 'Hide' : 'Set'} username
                </button>
                {row.showUsername && (
                  <input type="text" placeholder="e.g. sarah.wilson" value={row.username}
                    onChange={e => updateRow(i, { username: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                )}
              </div>
            ))}
            <button type="button" onClick={addRow} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add another
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Entity access</label>
            <div className="grid grid-cols-2 gap-1.5">
              {entities.map(entity => (
                <label key={entity.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={selectedEntityIds.includes(entity.id)} onChange={() => toggleEntity(entity.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-800 truncate">{entity.name}</span>
                  {entity.isMain && <span className="ml-auto text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Main</span>}
                </label>
              ))}
            </div>
            {selectedEntityIds.length === 0 && <p className="text-xs text-red-500 mt-1">Select at least one entity.</p>}
          </div>

          <div ref={copyRef}>
            <button type="button" onClick={() => setCopyDropdownOpen(o => !o)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
              <ChevronDown className={`w-3 h-3 transition-transform ${copyDropdownOpen ? 'rotate-180' : ''}`} />
              Or copy role and permissions from an existing user
            </button>
            {copyDropdownOpen && (
              <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                {currentUsers.map(u => (
                  <button key={u.id} type="button" onClick={() => { setCopyFromUserId(u.id); setCopyDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-left ${copyFromUserId === u.id ? 'bg-blue-50' : ''}`}>
                    <div className={`w-8 h-8 rounded-full ${u.color} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>{u.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-500 truncate">{u.role}</p>
                    </div>
                    {copyFromUserId === u.id && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
            {copyUser && !copyDropdownOpen && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
                <div className={`w-6 h-6 rounded-full ${copyUser.color} flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0`}>{copyUser.initials}</div>
                <span className="text-xs text-blue-800 font-medium flex-1 min-w-0 truncate">Copying role from {copyUser.name}</span>
                <button type="button" onClick={() => setCopyFromUserId('')} className="text-blue-400 hover:text-blue-600 flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 flex items-start gap-1.5">
            <Mail className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Users will get access to all apps enabled on the entities you've selected.
          </p>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
          <button disabled={!canSend}
            onClick={() => { onInvite(rows.filter(r => r.email.trim()).map(r => r.email), rows[0]?.role ?? defaultRole); onClose(); }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Send invites
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Entities Tab ───────────────────────────────────────────────────────────────

function EntitiesTab({ entities, onSelectEntity }: { entities: Entity[]; onSelectEntity: (e: Entity) => void }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = entities.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()));
  const allChecked = filtered.length > 0 && filtered.every(e => selected.includes(e.id));
  const toggleAll = () => setSelected(allChecked ? [] : filtered.map(e => e.id));
  const toggleOne = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">All Entities</h3>
          <SearchSortBar search={search} setSearch={setSearch} />
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[40px_2fr_2fr_1fr_1fr_180px] items-center px-4 py-2.5 bg-gray-50 border-b border-gray-100 gap-3">
          <input type="checkbox" checked={allChecked} onChange={toggleAll} className="rounded border-gray-300" />
          <span className="text-xs font-semibold text-gray-500">Name</span>
          <span className="text-xs font-semibold text-gray-500">Tags</span>
          <span className="text-xs font-semibold text-gray-500">Users</span>
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            Status <ChevronDown className="w-3 h-3" />
          </span>
          <span className="text-xs font-semibold text-gray-500">Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {filtered.map(entity => (
            <div key={entity.id} className="grid grid-cols-[40px_2fr_2fr_1fr_1fr_180px] items-center px-4 py-3.5 hover:bg-gray-50 gap-3">
              <input type="checkbox" checked={selected.includes(entity.id)} onChange={() => toggleOne(entity.id)} className="rounded border-gray-300" />
              <button className="flex items-center gap-2.5 min-w-0 text-left" onClick={() => onSelectEntity(entity)}>
                <EntityIcon isMain={entity.isMain} />
                <span className="text-sm font-semibold text-gray-900 hover:text-blue-600 truncate">{entity.name}</span>
              </button>
              <div className="flex items-center gap-1.5 flex-wrap">
                {entity.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 text-xs border border-gray-300 rounded-full text-gray-600">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                {entity.userCount} users
              </div>
              <div><SyncedBadge status={entity.status} /></div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium">
                  <LogIn className="w-3.5 h-3.5" /> Log in
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <PaginationFooter count={filtered.length} />
      </div>

      <HelpArticles />
    </>
  );
}

// ── Users Tab ──────────────────────────────────────────────────────────────────

function UsersTab({ users, entities, onSelectUser }: { users: MEUser[]; entities: Entity[]; onSelectUser: (u: MEUser) => void }) {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Invited'>('all');

  const filtered = users.filter(u => {
    const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const filterLabel = statusFilter === 'all' ? 'All Users' : `${statusFilter} Users`;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="relative">
            <button onClick={() => setFilterOpen(o => !o)}
              className="inline-flex items-center gap-1.5 text-base font-semibold text-gray-900 hover:text-blue-600">
              {filterLabel}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40">
                {(['all', 'Active', 'Invited'] as const).map(f => (
                  <button key={f} onClick={() => { setStatusFilter(f); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${statusFilter === f ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                    {f === 'all' ? 'All Users' : `${f} Users`}
                  </button>
                ))}
              </div>
            )}
          </div>
          <SearchSortBar search={search} setSearch={setSearch} />
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] items-center px-4 py-2.5 bg-gray-50 border-b border-gray-100 gap-3">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">Name <ChevronUp className="w-3 h-3" /></span>
          <span className="text-xs font-semibold text-gray-500">Role</span>
          <span className="text-xs font-semibold text-gray-500">Entities</span>
          <span className="text-xs font-semibold text-gray-500">Status</span>
          <span className="text-xs font-semibold text-gray-500">Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {filtered.map(user => {
            const shown = user.entityNames.slice(0, 2);
            const extra = user.entityNames.length - 2;
            return (
              <div key={user.id} className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] items-center px-4 py-3.5 hover:bg-gray-50 gap-3">
                <button className="flex items-center gap-3 min-w-0 text-left" onClick={() => onSelectUser(user)}>
                  <div className={`w-9 h-9 rounded-full ${user.color} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 hover:text-blue-600 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </button>
                <div><RoleBadge role={user.role} /></div>
                <div className="flex items-center gap-1 flex-wrap">
                  {shown.map(e => (
                    <span key={e} className="px-2 py-0.5 text-xs border border-gray-200 rounded text-gray-600 bg-gray-50 whitespace-nowrap">{e}</span>
                  ))}
                  {extra > 0 && <span className="px-2 py-0.5 text-xs border border-gray-200 rounded text-gray-500 bg-gray-50">+{extra}</span>}
                </div>
                <div><StatusDot status={user.status} /></div>
                <div>
                  {user.status === 'Invited' ? (
                    <button className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Resend Invite
                    </button>
                  ) : (
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <PaginationFooter count={filtered.length} />
      </div>

      <HelpArticles />
    </>
  );
}

// ── Entity Detail View ─────────────────────────────────────────────────────────

function EntityDetailView({ entity, onBack, onBackToRoot }: { entity: Entity; onBack: () => void; onBackToRoot: () => void }) {
  const [search, setSearch] = useState('');
  const entityUsers = ENTITY_USERS_MAP[entity.id] ?? [];
  const filtered = entityUsers.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm mb-5">
          <button onClick={onBackToRoot} className="text-blue-600 hover:underline font-medium">Account Settings</button>
          <span className="text-gray-400">/</span>
          <button onClick={onBack} className="text-blue-600 hover:underline font-medium">Multi-entity management</button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{entity.name}</span>
        </nav>

        {/* Title row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <EntityIcon isMain={entity.isMain} lg />
            <h1 className="text-2xl font-semibold text-gray-900">{entity.name}</h1>
            <button className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <button className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline flex-shrink-0">
            <LogIn className="w-4 h-4" /> Log in to entity
          </button>
        </div>

        {/* Status + tags */}
        <div className="flex items-center gap-2 mb-5">
          <SyncedBadge status={entity.status} />
          {entity.tags.map(tag => (
            <span key={tag} className="px-3 py-0.5 text-xs border border-gray-300 rounded-full text-gray-600">{tag}</span>
          ))}
        </div>

        <hr className="border-gray-200 mb-5" />

        {/* Add users */}
        <div className="flex justify-end mb-4">
          <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Add users to entity
          </button>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">All Users in Entity</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[2fr_1fr_1fr_3fr_48px] items-center px-4 py-2.5 bg-gray-50 border-b border-gray-100 gap-3">
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">Name <ChevronUp className="w-3 h-3" /></span>
            <span className="text-xs font-semibold text-gray-500">Role</span>
            <span className="text-xs font-semibold text-gray-500">Status</span>
            <span className="text-xs font-semibold text-gray-500">Access</span>
            <span className="text-xs font-semibold text-gray-500">Actions</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.map(user => (
              <div key={user.id} className="grid grid-cols-[2fr_1fr_1fr_3fr_48px] items-center px-4 py-3.5 hover:bg-gray-50 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-blue-600 truncate">{user.email}</p>
                  </div>
                </div>
                <div><RoleBadge role={user.role} /></div>
                <div><StatusDot status={user.status} /></div>
                <div><AppBadges apps={user.accessApps} maxShow={3} /></div>
                <div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <PaginationFooter count={filtered.length} />
        </div>

        <HelpArticles />
      </div>
    </div>
  );
}

// ── User Detail View ───────────────────────────────────────────────────────────

function UserDetailView({ user, onBack }: { user: MEUser; onBack: () => void }) {
  const [search, setSearch] = useState('');
  const entityAccess = USER_ENTITY_ACCESS[user.id] ?? [];
  const filtered = entityAccess.filter(a => !search || a.entityName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="px-6 py-8">
        {/* Back */}
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* Invite pending banner */}
        {user.status === 'Invited' && (
          <div className="px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 mb-4 text-sm text-amber-900">
            <span className="font-semibold">Invite pending:</span> This user has not yet accepted their invite to join your account.{' '}
            <button className="text-blue-600 hover:underline font-medium">Resend invite.</button>
          </div>
        )}

        {/* User profile */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${user.color} flex items-center justify-center text-white text-lg font-semibold flex-shrink-0`}>
            {user.initials}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{user.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {user.email}
              </span>
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-5" />

        {/* Entity access table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">User's Entity Access</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[2fr_5fr_48px] items-center px-4 py-2.5 bg-gray-50 border-b border-gray-100 gap-3">
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">Entity <ChevronUp className="w-3 h-3" /></span>
            <span className="text-xs font-semibold text-gray-500">App permissions</span>
            <span className="text-xs font-semibold text-gray-500">Actions</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.map(access => (
              <div key={access.entityId} className="grid grid-cols-[2fr_5fr_48px] items-center px-4 py-3.5 hover:bg-gray-50 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <EntityIcon isMain={access.isMain} />
                  <span className="text-sm font-medium text-gray-900 truncate">{access.entityName}</span>
                </div>
                <div><AppBadges apps={access.apps} maxShow={6} /></div>
                <div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <PaginationFooter count={filtered.length} />
        </div>

        <HelpArticles />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface MultiEntityPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function MultiEntityPage({ onBack }: MultiEntityPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('entities');
  const [entities] = useState<Entity[]>(INITIAL_ENTITIES);
  const [users, setUsers] = useState<MEUser[]>(INITIAL_ME_USERS);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedUser, setSelectedUser] = useState<MEUser | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const handleInvite = (emails: string[], role: string) => {
    const newUsers: MEUser[] = emails.map((email, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      initials: email.slice(0, 2).toUpperCase(),
      color: 'bg-gray-500',
      name: email.split('@')[0],
      email,
      role,
      entityNames: [],
      status: 'Invited' as const,
    }));
    setUsers(prev => [...prev, ...newUsers]);
  };

  if (selectedEntity) {
    return (
      <EntityDetailView
        entity={selectedEntity}
        onBack={() => setSelectedEntity(null)}
        onBackToRoot={onBack}
      />
    );
  }

  if (selectedUser) {
    return <UserDetailView user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm mb-5">
          <button onClick={onBack} className="text-blue-600 hover:underline font-medium">Account Settings</button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Multi-entity management</span>
        </nav>

        {/* Page title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Multi-entity management</h1>
        </div>

        {/* Tab bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="inline-flex items-center border border-gray-200 rounded-lg bg-gray-100 p-0.5">
            {(['entities', 'users'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'entities' && (
              <>
                <button className="text-sm font-medium text-blue-600 hover:underline">
                  Bulk edit entities
                </button>
                <button className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" /> Add new entity
                </button>
              </>
            )}
            {activeTab === 'users' && (
              <button
                onClick={() => setInviteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Invite Super Admins
              </button>
            )}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'entities' && (
          <EntitiesTab entities={entities} onSelectEntity={setSelectedEntity} />
        )}
        {activeTab === 'users' && (
          <UsersTab users={users} entities={entities} onSelectUser={setSelectedUser} />
        )}
      </div>

      {inviteModalOpen && (
        <MEInviteModal
          onClose={() => setInviteModalOpen(false)}
          onInvite={handleInvite}
          entities={entities}
          currentUsers={users}
          defaultRole="Super Admin"
        />
      )}
    </div>
  );
}
