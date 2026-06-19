import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, ChevronDown, Building2, Users, DollarSign, TrendingUp,
  Plus, Search, Settings, LogIn, AlertTriangle, X, UserPlus, Tag,
  ExternalLink, SlidersHorizontal, Package, Palette, FileText, List,
  Shield, Check, ChevronUp, Mail,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// ── Types ──────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'sub-entities' | 'users' | 'preferences';
type EntityStatus = 'Synced' | 'Unsynced';

interface Entity {
  id: string;
  name: string;
  tags: string[];
  userCount: number;
  status: EntityStatus;
  revenue: string;
  revenueNum: number;
  isMain?: boolean;
  lifetimeValue: string;
  activeOpps: number;
  wonRate: string;
  lastActivity: string;
}

interface MEUser {
  id: string;
  initials: string;
  color: string;
  name: string;
  email: string;
  role: string;
  companies: string[];
  status: 'Active' | 'Invite pending';
}

interface EntityUser {
  initials: string;
  color: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface WizardUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const INITIAL_ENTITIES: Entity[] = [
  { id: 'main', name: 'Horizons Inc', tags: ['Main'], userCount: 150, status: 'Synced', revenue: '$2,500', revenueNum: 2500, isMain: true, lifetimeValue: '$874,000', activeOpps: 42, wonRate: '68%', lastActivity: 'Jun 17' },
  { id: 'nyc', name: 'Horizons NYC', tags: ['New York', 'pop-up'], userCount: 35, status: 'Unsynced', revenue: '$650', revenueNum: 650, lifetimeValue: '$125,000', activeOpps: 8, wonRate: '75%', lastActivity: 'Jan 14' },
  { id: 'bay', name: 'Horizons Bay Area', tags: ['San Francisco'], userCount: 28, status: 'Synced', revenue: '$550', revenueNum: 550, lifetimeValue: '$98,000', activeOpps: 12, wonRate: '61%', lastActivity: 'Jun 15' },
  { id: 'texas', name: 'Horizons Texas', tags: ['Austin', 'franchise'], userCount: 22, status: 'Synced', revenue: '$450', revenueNum: 450, lifetimeValue: '$76,000', activeOpps: 9, wonRate: '58%', lastActivity: 'Jun 16' },
  { id: 'la', name: 'Horizons LA', tags: ['Los Angeles'], userCount: 25, status: 'Synced', revenue: '$450', revenueNum: 450, lifetimeValue: '$81,000', activeOpps: 11, wonRate: '72%', lastActivity: 'Jun 14' },
  { id: 'chicago', name: 'Horizons Chicago', tags: ['Chicago', 'seasonal'], userCount: 15, status: 'Synced', revenue: '$250', revenueNum: 250, lifetimeValue: '$43,000', activeOpps: 5, wonRate: '55%', lastActivity: 'Jun 10' },
  { id: 'miami', name: 'Horizons Miami', tags: ['Miami'], userCount: 12, status: 'Synced', revenue: '$250', revenueNum: 250, lifetimeValue: '$45,000', activeOpps: 6, wonRate: '60%', lastActivity: 'Jun 12' },
];

const ME_USERS: MEUser[] = [
  { id: 'sw', initials: 'SW', color: 'bg-purple-500', name: 'Sarah Wilson', email: 'sarah.wilson@horizonsnyc.com', role: 'Super Admin', companies: ['Horizons NYC', 'Horizons Bay Area', 'Horizons Inc'], status: 'Invite pending' },
  { id: 'mc', initials: 'MC', color: 'bg-blue-500', name: 'Michael Chen', email: 'm.chen@horizonsbayarea.com', role: 'Admin', companies: ['Horizons Bay Area'], status: 'Active' },
  { id: 'ed', initials: 'ED', color: 'bg-green-500', name: 'Emma Davis', email: 'emma.d@horizonstexas.com', role: 'Customizer', companies: ['Horizons Texas', 'Horizons Miami'], status: 'Active' },
  { id: 'jm', initials: 'JM', color: 'bg-amber-500', name: 'James Miller', email: 'j.miller@horizonsla.com', role: 'Regular', companies: ['Horizons LA'], status: 'Active' },
];

const ENTITY_USERS: Record<string, EntityUser[]> = {
  main: [
    { initials: 'TC', color: 'bg-blue-600', name: 'Tyler Copeland', email: 'tyler@horizonsinc.com', role: 'Admin', permissions: ['Customers - Full access', 'Activities - Full access', 'Invoices - Full access'] },
    { initials: 'PM', color: 'bg-indigo-500', name: 'Paul McLane', email: 'paul@horizonsinc.com', role: 'Admin', permissions: ['Customers - Full access', 'Activities - Full access', 'Invoices - Full access'] },
  ],
  nyc: [
    { initials: 'SW', color: 'bg-purple-500', name: 'Sarah Wilson', email: 'sarah.wilson@horizonsnyc.com', role: 'Admin', permissions: ['Customers - Full access', 'Activities - Full access', 'Invoices - Full access'] },
    { initials: 'MC', color: 'bg-blue-500', name: 'Michael Chen', email: 'm.chen@horizonsnyc.com', role: 'Supervisor', permissions: ['Customers - Full access', 'Activities - Full access', 'Invoices - Read & write'] },
    { initials: 'ED', color: 'bg-green-500', name: 'Emma Davis', email: 'emma.d@horizonsnyc.com', role: 'Regular', permissions: ['Customers - Read only', 'Activities - Read only', 'Invoices - Read only'] },
  ],
  bay: [
    { initials: 'MC', color: 'bg-blue-500', name: 'Michael Chen', email: 'm.chen@horizonsbayarea.com', role: 'Admin', permissions: ['Customers - Full access', 'Activities - Full access', 'Invoices - Full access'] },
    { initials: 'SW', color: 'bg-purple-500', name: 'Sarah Wilson', email: 'sarah.wilson@horizonsbayarea.com', role: 'Supervisor', permissions: ['Customers - Full access', 'Invoices - Read & write'] },
  ],
  texas: [{ initials: 'ED', color: 'bg-green-500', name: 'Emma Davis', email: 'emma.d@horizonstexas.com', role: 'Admin', permissions: ['Customers - Full access', 'Activities - Full access'] }],
  la: [{ initials: 'JM', color: 'bg-amber-500', name: 'James Miller', email: 'j.miller@horizonsla.com', role: 'Regular', permissions: ['Customers - Read only', 'Activities - Read only'] }],
  chicago: [{ initials: 'TC', color: 'bg-blue-600', name: 'Tyler Copeland', email: 'tyler@horizonschicago.com', role: 'Admin', permissions: ['Customers - Full access', 'Activities - Full access'] }],
  miami: [{ initials: 'ED', color: 'bg-green-500', name: 'Emma Davis', email: 'emma.d@horizonsmiami.com', role: 'Customizer', permissions: ['Customers - Full access', 'Activities - Full access'] }],
};

// ── Small helpers ─────────────────────────────────────────────────────────────

function SyncBadge({ status }: { status: EntityStatus }) {
  if (status === 'Synced') {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Synced</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      <AlertTriangle className="w-3 h-3" /> Unsynced
    </span>
  );
}

function EntityTag({ label }: { label: string }) {
  const isMain = label === 'Main';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isMain ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    'Super Admin': 'bg-purple-100 text-purple-700',
    'Admin': 'bg-blue-100 text-blue-700',
    'Customizer': 'bg-teal-100 text-teal-700',
    'Regular': 'bg-gray-100 text-gray-600',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role] ?? 'bg-gray-100 text-gray-600'}`}>{role}</span>;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function BarChart({ data, title }: { data: { name: string; value: number }[]; title: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="flex items-end gap-1.5" style={{ height: 100 }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1" style={{ height: 100 }}>
            <div className="w-full flex items-end" style={{ height: 80 }}>
              <div
                className="w-full bg-blue-500 rounded-t transition-all"
                style={{ height: Math.max(3, (d.value / max) * 80) }}
              />
            </div>
            <span className="text-[9px] text-gray-400 truncate w-full text-center leading-none">
              {d.name.split(' ').pop()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({ entities }: { entities: Entity[] }) {
  const unsynced = entities.filter(e => e.status === 'Unsynced');
  const totalRevenue = entities.reduce((s, e) => s + e.revenueNum, 0);
  const totalUsers = entities.reduce((s, e) => s + e.userCount, 0);
  const totalOpps = entities.reduce((s, e) => s + e.activeOpps, 0);

  return (
    <div className="space-y-5">
      {unsynced.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="flex-1 min-w-0 text-sm">
            <span className="font-medium text-amber-800">{unsynced.length} {unsynced.length === 1 ? 'entity requires' : 'entities require'} attention: </span>
            <span className="text-amber-700">{unsynced.map(e => e.name).join(', ')} need QuickBooks sync.</span>
          </div>
          <button className="text-xs font-medium text-amber-700 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors whitespace-nowrap flex-shrink-0">
            Complete sync setup
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total sub-entities" value={entities.length} icon={Building2} color="bg-blue-600" />
        <StatCard label="Total users" value={totalUsers.toLocaleString()} icon={Users} color="bg-indigo-500" />
        <StatCard label="Monthly revenue" value={`$${(totalRevenue / 1000).toFixed(1)}k`} icon={DollarSign} color="bg-green-500" />
        <StatCard label="Open opportunities" value={totalOpps} icon={TrendingUp} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChart title="Revenue by entity ($/mo)" data={entities.map(e => ({ name: e.name, value: e.revenueNum }))} />
        <BarChart title="Users per entity" data={entities.map(e => ({ name: e.name, value: e.userCount }))} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Entity health summary</h3>
        <div className="divide-y divide-gray-100">
          {entities.map(e => (
            <div key={e.id} className="flex items-center gap-4 py-3">
              <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-800 flex-1">{e.name}</span>
              <span className="text-sm text-gray-500">{e.activeOpps} open opps</span>
              <span className="text-sm text-gray-500 w-16 text-right">{e.wonRate} won</span>
              <SyncBadge status={e.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Entity Detail ─────────────────────────────────────────────────────────────

function EntityDetailView({ entity, onBack }: { entity: Entity; onBack: () => void }) {
  const users = ENTITY_USERS[entity.id] ?? [];
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
        <ChevronLeft className="w-4 h-4" /> Back to Sub-entities
      </button>

      {entity.status === 'Unsynced' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">QuickBooks Sync Required</p>
              <p className="text-xs text-amber-700 mt-0.5">This sub-entity needs to be synced with QuickBooks to activate full functionality.</p>
            </div>
          </div>
          <button className="text-xs font-medium text-amber-700 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors whitespace-nowrap flex-shrink-0">
            Complete sync setup →
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">{entity.name}</h2>
            <button className="text-sm text-blue-600 hover:underline">Edit</button>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {entity.status === 'Unsynced' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                <AlertTriangle className="w-3 h-3" /> unsynced
              </span>
            )}
            {entity.tags.map(t => <EntityTag key={t} label={t} />)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Lifetime Value', value: entity.lifetimeValue },
          { label: 'Active Opportunities', value: entity.activeOpps },
          { label: 'Won Opportunities', value: entity.wonRate },
          { label: 'Last Activity', value: entity.lastActivity },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-lg font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            <UserPlus className="w-4 h-4" /> Add Users
          </button>
        </div>

        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Users ({filtered.length})</h3>
          <div className="flex items-center gap-4">
            <button className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Edit Access
            </button>
            <button className="text-xs font-medium text-red-500 hover:underline flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Remove Access
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <Users className="w-7 h-7 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No users found</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-[40px_2fr_1fr_3fr_100px] bg-gray-50 px-4 py-2.5 border-b border-gray-100">
              <div><input type="checkbox" className="rounded border-gray-300" /></div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">User</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">App permissions</span>
              <span />
            </div>
            <div className="divide-y divide-gray-100">
              {filtered.map((u, i) => (
                <div key={i} className="grid grid-cols-[40px_2fr_1fr_3fr_100px] items-center px-4 py-3.5 hover:bg-gray-50">
                  <div><input type="checkbox" className="rounded border-gray-300" /></div>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full ${u.color} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                      {u.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div><span className="text-sm text-gray-600 lowercase">{u.role}</span></div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {u.permissions.slice(0, 2).map((p, j) => (
                      <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">{p}</span>
                    ))}
                    {u.permissions.length > 2 && (
                      <button className="text-xs text-gray-400 hover:text-blue-600">Show {u.permissions.length - 2} more</button>
                    )}
                  </div>
                  <div className="text-right">
                    <button className="text-xs font-medium text-blue-600 hover:underline">Edit Access</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-entities Tab ──────────────────────────────────────────────────────────

function SubEntitiesTab({ entities, onSelectEntity, onAddEntity }: {
  entities: Entity[];
  onSelectEntity: (e: Entity) => void;
  onAddEntity: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const filtered = entities.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()));

  const toggleAll = () => setSelected(prev => prev.length === filtered.length ? [] : filtered.map(e => e.id));
  const toggleRow = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search sub-entities..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex-1" />
        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <SlidersHorizontal className="w-4 h-4" /> Filter
        </button>
        <button onClick={onAddEntity} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add new sub-entity
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">All Sub-entities <span className="text-gray-400 font-normal">({filtered.length})</span></h3>
          <div className="flex items-center gap-4">
            <button className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5" /> Add users to sub-entities
            </button>
            <button className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Add tags to sub-entities
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[40px_2.5fr_1.5fr_1fr_1fr_1.2fr_1.5fr] bg-gray-50 px-4 py-2.5 border-b border-gray-100 gap-3">
          <div><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-gray-300" /></div>
          {['Name', 'Tags', 'Users', 'Status', 'Monthly Revenue', 'Actions'].map(h => (
            <span key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</span>
          ))}
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.map(entity => (
            <div
              key={entity.id}
              className="grid grid-cols-[40px_2.5fr_1.5fr_1fr_1fr_1.2fr_1.5fr] items-center px-4 py-3.5 hover:bg-gray-50 cursor-pointer gap-3"
              onClick={() => onSelectEntity(entity)}
            >
              <div onClick={e => e.stopPropagation()}>
                <input type="checkbox" checked={selected.includes(entity.id)} onChange={() => toggleRow(entity.id)} className="rounded border-gray-300" />
              </div>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-900 truncate">{entity.name}</span>
                {entity.isMain && <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex-shrink-0">Main</span>}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {entity.tags.filter(t => t !== 'Main').map(t => <EntityTag key={t} label={t} />)}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                {entity.userCount}
              </div>
              <div><SyncBadge status={entity.status} /></div>
              <div className="text-sm font-medium text-gray-900">{entity.revenue}</div>
              <div onClick={e => e.stopPropagation()}>
                {entity.status === 'Unsynced' ? (
                  <button className="text-xs font-medium text-amber-700 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-50 transition-colors whitespace-nowrap">
                    Complete sync setup →
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
                      <LogIn className="w-3.5 h-3.5" /> Log in <ExternalLink className="w-3 h-3" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ME Users Tab ──────────────────────────────────────────────────────────────

// ── ME Invite Modal ───────────────────────────────────────────────────────────

const ME_ROLES = ['Super Admin', 'Admin', 'Customizer', 'Regular'] as const;

interface MEInviteRow {
  email: string;
  role: string;
  username: string;
  showUsername: boolean;
}

function MEInviteModal({
  onClose,
  onInvite,
  entities,
}: {
  onClose: () => void;
  onInvite: (emails: string[]) => void;
  entities: Entity[];
}) {
  const defaultEntityIds = entities.filter(e => !e.isMain).map(e => e.id);
  const [rows, setRows] = useState<MEInviteRow[]>([{ email: '', role: 'Regular', username: '', showUsername: false }]);
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>(defaultEntityIds);
  const [copyFromUserId, setCopyFromUserId] = useState('');
  const [copyDropdownOpen, setCopyDropdownOpen] = useState(false);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (copyRef.current && !copyRef.current.contains(e.target as Node)) {
        setCopyDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const updateRow = (i: number, patch: Partial<MEInviteRow>) =>
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  const addRow = () => setRows(prev => [...prev, { email: '', role: 'Regular', username: '', showUsername: false }]);

  const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const toggleEntity = (id: string) =>
    setSelectedEntityIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const selectedCopyUser = ME_USERS.find(u => u.id === copyFromUserId);

  const canSend = rows.some(r => r.email.trim().length > 0) && selectedEntityIds.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
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
          {/* Invite rows */}
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-2 items-start">
                  {/* Email */}
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="user@company.com"
                      value={row.email}
                      onChange={e => updateRow(i, { email: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {/* Role */}
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Role</label>
                    <div className="relative">
                      <select
                        value={row.role}
                        onChange={e => updateRow(i, { role: e.target.value })}
                        className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {ME_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  {/* Remove row */}
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(i)}
                      className="mt-5 p-1.5 text-gray-300 hover:text-red-500 rounded transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Expand username */}
                <button
                  type="button"
                  onClick={() => updateRow(i, { showUsername: !row.showUsername })}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  {row.showUsername ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {row.showUsername ? 'Hide' : 'Set'} username
                </button>

                {row.showUsername && (
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Username</label>
                    <input
                      type="text"
                      placeholder="e.g. sarah.wilson"
                      value={row.username}
                      onChange={e => updateRow(i, { username: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add another
            </button>
          </div>

          {/* Entity access */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Entity access</label>
            <div className="grid grid-cols-2 gap-1.5">
              {entities.map(entity => (
                <label key={entity.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedEntityIds.includes(entity.id)}
                    onChange={() => toggleEntity(entity.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-800 truncate">{entity.name}</span>
                  {entity.isMain && <span className="ml-auto text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Main</span>}
                </label>
              ))}
            </div>
            {selectedEntityIds.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Select at least one entity.</p>
            )}
          </div>

          {/* Copy role from existing user */}
          <div>
            <button
              type="button"
              onClick={() => setCopyDropdownOpen(o => !o)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <ChevronDown className={`w-3 h-3 transition-transform ${copyDropdownOpen ? 'rotate-180' : ''}`} />
              Or copy role and permissions from an existing user
            </button>
            {copyDropdownOpen && (
              <div ref={copyRef} className="mt-2 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                {ME_USERS.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { setCopyFromUserId(u.id); setCopyDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left ${copyFromUserId === u.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full ${u.color} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                      {u.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-500 truncate">{u.role}</p>
                    </div>
                    {copyFromUserId === u.id && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
            {selectedCopyUser && !copyDropdownOpen && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
                <div className={`w-6 h-6 rounded-full ${selectedCopyUser.color} flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0`}>
                  {selectedCopyUser.initials}
                </div>
                <span className="text-xs text-blue-800 font-medium flex-1 min-w-0 truncate">Copying role from {selectedCopyUser.name}</span>
                <button
                  type="button"
                  onClick={() => setCopyFromUserId('')}
                  className="text-blue-400 hover:text-blue-600 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* App access note */}
          <p className="text-xs text-gray-400 flex items-start gap-1.5">
            <Mail className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Users will get access to all apps enabled on the entities you've selected. App-level permissions can be adjusted after invite.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 gap-3">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
          <button
            disabled={!canSend}
            onClick={() => {
              onInvite(rows.filter(r => r.email.trim()).map(r => r.email));
              onClose();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Send invites
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────

function UsersTab({ entities }: { entities: Entity[] }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [users, setUsers] = useState<MEUser[]>(ME_USERS);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleRow = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleInvite = (emails: string[]) => {
    const newUsers: MEUser[] = emails.map((email, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      initials: email.slice(0, 2).toUpperCase(),
      color: 'bg-gray-500',
      name: email.split('@')[0],
      email,
      role: 'Regular',
      companies: [],
      status: 'Invite pending' as const,
    }));
    setUsers(prev => [...prev, ...newUsers]);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setInviteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Add new users
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">All Users <span className="text-gray-400 font-normal">({filtered.length})</span></h3>
            <div className="flex items-center gap-4">
              <button className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Add users to a sub-entity
              </button>
              <button className="text-xs font-medium text-red-500 hover:underline flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Remove users
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[40px_2fr_1fr_2fr_1fr_1fr] bg-gray-50 px-4 py-2.5 border-b border-gray-100 gap-3">
            <div><input type="checkbox" className="rounded border-gray-300" /></div>
            {['Name', 'Role', 'Companies', 'Status', 'Actions'].map(h => (
              <span key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</span>
            ))}
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.map(user => (
              <div key={user.id} className="grid grid-cols-[40px_2fr_1fr_2fr_1fr_1fr] items-center px-4 py-3.5 hover:bg-gray-50 gap-3">
                <div>
                  <input type="checkbox" checked={selected.includes(user.id)} onChange={() => toggleRow(user.id)} className="rounded border-gray-300" />
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div><RoleBadge role={user.role} /></div>
                <div className="flex items-center gap-1 flex-wrap">
                  {user.companies.slice(0, 2).map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">{c}</span>
                  ))}
                  {user.companies.length > 2 && <span className="text-xs text-gray-500">+{user.companies.length - 2}</span>}
                  {user.companies.length === 0 && <span className="text-xs text-gray-400">All entities</span>}
                </div>
                <div>
                  {user.status === 'Active'
                    ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Active</span>
                    : <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><AlertTriangle className="w-3 h-3" /> Invite pending</span>}
                </div>
                <div>
                  {user.status === 'Invite pending'
                    ? <button className="text-xs font-medium text-amber-700 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-50 transition-colors">Resend invite →</button>
                    : <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"><Settings className="w-4 h-4" /></button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {inviteModalOpen && (
        <MEInviteModal
          onClose={() => setInviteModalOpen(false)}
          onInvite={handleInvite}
          entities={entities}
        />
      )}
    </>
  );
}

// ── Preferences Tab ───────────────────────────────────────────────────────────

function PreferencesTab() {
  const items = [
    { Icon: Palette, title: 'Branding', desc: 'Manage logos and brand colors for sub-entities.' },
    { Icon: FileText, title: 'Email & report templates', desc: 'Configure templates for emails and reports used across sub-entities.' },
    { Icon: List, title: 'Custom fields', desc: 'Define and manage Method-specific custom fields for your sub-entities.' },
    { Icon: ChevronDown, title: 'Dropdowns', desc: 'Manage dropdown options available in forms and records in Method.' },
  ];
  return (
    <div className="space-y-3">
      {items.map(({ Icon, title, desc }) => (
        <div key={title} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Settings className="w-3.5 h-3.5" /> Configure
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Add Sub-entity Wizard ─────────────────────────────────────────────────────

const APP_PACKS = [
  { name: 'Contact Management', price: '$28/user monthly', desc: 'Manage contacts, leads, and customers', enabled: true },
  { name: 'Accounting Lists', price: 'Free', desc: 'Track accounts, categories, and financial records', enabled: true },
  { name: 'Sales Transactions', price: '$28/user monthly', desc: 'Process and track sales transactions with detailed reporting', enabled: true },
];

function AddSubEntityWizard({ onClose, onComplete }: { onClose: () => void; onComplete: (e: Entity) => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [nameError, setNameError] = useState(false);
  const [packs, setPacks] = useState(APP_PACKS.map(p => ({ ...p })));
  const [wizardUsers, setWizardUsers] = useState<WizardUser[]>([
    { id: '1', email: 'john.doe@example.com', name: 'John Doe (You)', role: 'Super-admin' },
    { id: '2', email: '', name: '', role: 'Regular' },
  ]);

  const progress = [25, 50, 75, 100][step - 1];

  function next() {
    if (step === 1 && !name.trim()) { setNameError(true); return; }
    setNameError(false);
    setStep(s => Math.min(4, s + 1) as 1 | 2 | 3 | 4);
  }

  function back() { setStep(s => Math.max(1, s - 1) as 1 | 2 | 3 | 4); }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  }

  function complete() {
    onComplete({
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name, tags,
      userCount: wizardUsers.filter(u => u.email).length,
      status: 'Unsynced',
      revenue: '$0', revenueNum: 0,
      lifetimeValue: '$0', activeOpps: 0, wonRate: '0%', lastActivity: 'Never',
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px]">
        <div className="flex items-start justify-between px-7 pt-7 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add Sub-entity</h2>
            <p className="text-sm text-gray-500 mt-0.5">Add a new sub-entity to your organization</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-7 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">Step {step} of 4</span>
          </div>
        </div>

        <div className="px-7 py-4 max-h-[60vh] overflow-y-auto">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-gray-800">Sub-entity details</h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Sub-entity name</label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setNameError(false); }}
                  placeholder="Enter sub-entity name"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${nameError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {nameError && <p className="text-xs text-red-500">Sub-entity name is required</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <div className="border border-gray-300 rounded-lg px-3 py-2 min-h-[44px] flex flex-wrap gap-1.5 items-center focus-within:ring-2 focus-within:ring-blue-500">
                  {tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {t}
                      <button onClick={() => setTags(prev => prev.filter(x => x !== t))} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder={tags.length === 0 ? 'Type and press Enter' : ''}
                    className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
                  />
                </div>
                <p className="text-xs text-gray-400">Recommended for easy filtering by eg. location or type (NYC, Kiosk, Pop-up)</p>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800">Users</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['#', 'Email', 'Full name', 'Role', ''].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-blue-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {wizardUsers.map((u, i) => (
                      <tr key={u.id}>
                        <td className="px-4 py-2.5 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-2.5">
                          <input type="email" value={u.email} disabled={i === 0} placeholder="user@example.com"
                            onChange={e => setWizardUsers(prev => prev.map(r => r.id === u.id ? { ...r, email: e.target.value } : r))}
                            className="w-full text-sm text-gray-700 outline-none bg-transparent disabled:text-gray-500 placeholder-gray-300" />
                        </td>
                        <td className="px-4 py-2.5">
                          <input type="text" value={u.name} disabled={i === 0} placeholder="Full Name"
                            onChange={e => setWizardUsers(prev => prev.map(r => r.id === u.id ? { ...r, name: e.target.value } : r))}
                            className="w-full text-sm text-gray-700 outline-none bg-transparent disabled:text-gray-500 placeholder-gray-300" />
                        </td>
                        <td className="px-4 py-2.5">
                          <select value={u.role} onChange={e => setWizardUsers(prev => prev.map(r => r.id === u.id ? { ...r, role: e.target.value } : r))}
                            className="text-sm text-gray-700 outline-none bg-transparent">
                            {['Super-admin', 'Admin', 'Customizer', 'Regular', 'View-only'].map(r => <option key={r}>{r}</option>)}
                          </select>
                        </td>
                        <td className="px-2 w-8">
                          {i > 0 && (
                            <button onClick={() => setWizardUsers(prev => prev.filter(r => r.id !== u.id))} className="text-gray-300 hover:text-gray-500">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setWizardUsers(prev => [...prev, { id: Date.now().toString(), email: '', name: '', role: 'Regular' }])}
                className="text-sm text-blue-600 hover:underline">
                + Add another user
              </button>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800">App packs</h3>
              <p className="text-sm text-gray-500">Last used app packs</p>
              <div className="space-y-3">
                {packs.map((pack, i) => (
                  <div key={pack.name} className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">{pack.name}</span>
                        <span className="text-xs text-gray-400">{pack.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{pack.desc}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button className="text-xs text-gray-500 flex items-center gap-0.5 hover:text-gray-700">
                        Access <ChevronDown className="w-3 h-3" />
                      </button>
                      <Switch checked={pack.enabled} onCheckedChange={v => setPacks(prev => prev.map((p, j) => j === i ? { ...p, enabled: v } : p))} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                Add more app packs
              </button>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-800">Summary</h3>
                <span className="text-sm text-gray-400">($68 / mo)</span>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={true} onCheckedChange={() => {}} />
                <span className="text-sm text-gray-700">Maintain previous access settings for existing users</span>
              </div>
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">John Doe (You)</p>
                      <p className="text-xs text-gray-400">john.doe@example.com</p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1">
                    <Settings className="w-3.5 h-3.5" /> Change permissions
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-gray-400">Access:</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">Customers - Full access</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">Activities - Full access</span>
                  <button className="text-xs text-blue-600 hover:underline">Show 11 more</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-100 px-7 py-4 flex items-center justify-between gap-3 rounded-b-2xl">
          <button onClick={back} disabled={step === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Back
          </button>
          <div className="flex items-center gap-3">
            {step === 1 && (
              <button onClick={complete} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Create without users
              </button>
            )}
            {step < 4 ? (
              <button onClick={next} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {step === 1 ? 'Create & Add users' : 'Next'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={complete} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  Add & new
                </button>
                <button onClick={complete} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Add users
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface MultiEntityPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function MultiEntityPage({ onBack }: MultiEntityPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [entities, setEntities] = useState<Entity[]>(INITIAL_ENTITIES);
  const [showWizard, setShowWizard] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'sub-entities', label: 'Sub-entities' },
    { id: 'users', label: 'Users' },
    { id: 'preferences', label: 'Preferences' },
  ];

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setSelectedEntity(null);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-5">
          <ChevronLeft className="w-4 h-4" /> Account Settings
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Multi-entity Management</h1>
            <p className="text-sm text-gray-500">Manage and monitor all your sub-entities</p>
          </div>
        </div>

        <div className="border-b border-gray-200 mt-5 mb-6">
          <nav className="-mb-px flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && <OverviewTab entities={entities} />}

        {activeTab === 'sub-entities' && !selectedEntity && (
          <SubEntitiesTab
            entities={entities}
            onSelectEntity={setSelectedEntity}
            onAddEntity={() => setShowWizard(true)}
          />
        )}
        {activeTab === 'sub-entities' && selectedEntity && (
          <EntityDetailView entity={selectedEntity} onBack={() => setSelectedEntity(null)} />
        )}

        {activeTab === 'users' && <UsersTab entities={entities} />}
        {activeTab === 'preferences' && <PreferencesTab />}
      </div>

      {showWizard && (
        <AddSubEntityWizard
          onClose={() => setShowWizard(false)}
          onComplete={entity => setEntities(prev => [...prev, entity])}
        />
      )}
    </div>
  );
}
