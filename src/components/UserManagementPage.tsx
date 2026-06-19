import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  UserPlus,
  Shield,
  MoreHorizontal,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  X,
  AlertTriangle,
  Users,
  Crown,
  Wrench,
  User,
  TrendingUp,
  ArrowRight,
  Mail,
  Hammer,
  Eye,
  Check,
  Info,
  ExternalLink,
  CornerDownRight,
  SlidersHorizontal,
  Key,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { ApplicationsAccessPage } from './ApplicationsAccessPage';
import type { ActiveSubscription } from './SubscriptionPage';

// ── Types ──────────────────────────────────────────────────────────────────────

type UserRole = 'Admin' | 'Customizer' | 'Regular' | 'Field Crew' | 'View-only';
type SeatType = 'full' | 'field-crew' | 'view-only';
type UserStatus = 'Active' | 'Invited' | 'Deactivated';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  apps: string[];
  avatarColor: string;
}

interface RoleOption {
  role: UserRole;
  label: string;
  description: string;
  seatType: SeatType;
  extraPricePerMonth: number | null; // price when over the plan seat limit
}

interface InviteRow {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  nameManuallyEdited: boolean;
  showName: boolean;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PLAN_ORDER = ['essentials', 'build', 'scale'] as const;

const PLAN_SEATS: Record<string, number> = {
  essentials: 1,
  build: 3,
  scale: 8,
};

const PLAN_NAMES: Record<string, string> = {
  essentials: 'Essentials',
  build: 'Build',
  scale: 'Scale',
};

const PLAN_PRICES_ANNUAL: Record<string, number> = {
  essentials: 40,
  build: 160,
  scale: 500,
};

const PLAN_PRICES_MONTHLY: Record<string, number> = {
  essentials: 50,
  build: 200,
  scale: 625,
};

const EXTRA_FULL_SEAT_PRICE = 59;
const EXTRA_FIELD_CREW_PRICE = 18;

// Field crew draws from the same plan seat pool as full seats.
// extraPricePerMonth is the cost ONLY when beyond the pool limit.
const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'Admin',
    label: 'Admin',
    description: 'Full access including billing & user management',
    seatType: 'full',
    extraPricePerMonth: EXTRA_FULL_SEAT_PRICE,
  },
  {
    role: 'Customizer',
    label: 'Customizer',
    description: 'Configure apps, screens & custom fields',
    seatType: 'full',
    extraPricePerMonth: EXTRA_FULL_SEAT_PRICE,
  },
  {
    role: 'Regular',
    label: 'Regular',
    description: 'Standard app access, no admin controls',
    seatType: 'full',
    extraPricePerMonth: EXTRA_FULL_SEAT_PRICE,
  },
  {
    role: 'Field Crew',
    label: 'Field Crew Member',
    description: 'Scoped field access — jobs, schedules & time tracking',
    seatType: 'field-crew',
    extraPricePerMonth: EXTRA_FIELD_CREW_PRICE,
  },
  {
    role: 'View-only',
    label: 'View-only',
    description: 'Read-only access, no edits or data entry',
    seatType: 'view-only',
    extraPricePerMonth: null,
  },
];

const ROLE_SEAT_TYPE: Record<UserRole, SeatType> = {
  Admin: 'full',
  Customizer: 'full',
  Regular: 'full',
  'Field Crew': 'field-crew',
  'View-only': 'view-only',
};

const ALL_MOCK_USERS: MockUser[] = [
  {
    id: '1', name: 'Paul McLane', email: 'p.mclane@acme.com', role: 'Admin', status: 'Active',
    apps: ['CRM', 'Customers', 'Estimates', 'Invoices', 'Payments', 'Email'], avatarColor: 'bg-indigo-600',
  },
  {
    id: '2', name: 'Sarah Chen', email: 's.chen@acme.com', role: 'Admin', status: 'Active',
    apps: ['CRM', 'Customers', 'Estimates', 'Invoices', 'Work Orders', 'Schedules', 'Reports'], avatarColor: 'bg-violet-600',
  },
  {
    id: '3', name: 'Jake Wilson', email: 'j.wilson@acme.com', role: 'Customizer', status: 'Active',
    apps: ['Work Orders', 'Field Crew', 'Time Tracking', 'Schedules'], avatarColor: 'bg-emerald-600',
  },
  {
    id: '4', name: 'Maya Rodriguez', email: 'm.rodriguez@acme.com', role: 'Regular', status: 'Invited',
    apps: ['Customers', 'Estimates'], avatarColor: 'bg-amber-600',
  },
  {
    id: '5', name: 'Tyler Copeland', email: 't.copeland@acme.com', role: 'Regular', status: 'Active',
    apps: ['Estimates', 'Invoices', 'Payments'], avatarColor: 'bg-blue-600',
  },
  {
    id: '6', name: 'Lisa Park', email: 'l.park@acme.com', role: 'Customizer', status: 'Active',
    apps: ['Work Orders', 'Schedules', 'Time Tracking'], avatarColor: 'bg-pink-600',
  },
  {
    id: '7', name: 'David Kim', email: 'd.kim@acme.com', role: 'Field Crew', status: 'Invited',
    apps: ['Field Crew', 'Time Tracking'], avatarColor: 'bg-orange-600',
  },
  {
    id: '8', name: 'Emma Brown', email: 'e.brown@acme.com', role: 'Field Crew', status: 'Active',
    apps: ['Field Crew', 'Schedules'], avatarColor: 'bg-teal-600',
  },
  {
    id: '9', name: 'Alex Turner', email: 'a.turner@acme.com', role: 'View-only', status: 'Active',
    apps: ['Customers', 'Estimates', 'Invoices'], avatarColor: 'bg-red-600',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function extractNameFromEmail(email: string): string {
  const prefix = email.split('@')[0] || '';
  return prefix
    .replace(/[._\-+]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function newInviteRow(defaultRole: UserRole = 'Regular'): InviteRow {
  return {
    id: Math.random().toString(36).slice(2),
    email: '',
    role: defaultRole,
    name: '',
    nameManuallyEdited: false,
    showName: false,
  };
}

// Compute how many seats are consumed by rows up to (not including) index i
function seatsConsumedBefore(rows: InviteRow[], index: number): number {
  let count = 0;
  for (let j = 0; j < index; j++) {
    if (rows[j].email.trim() && ROLE_SEAT_TYPE[rows[j].role] !== 'view-only') count++;
  }
  return count;
}

interface PricingInfo {
  isIncluded: boolean;
  isFree: boolean;
  extraPrice: number | null; // null = free
  label: string;
  sublabel: string;
}

function getPricingInfo(
  seatType: SeatType,
  seatsAvailableForThisSlot: number,
  isTrial: boolean
): PricingInfo {
  if (seatType === 'view-only') {
    return { isIncluded: true, isFree: true, extraPrice: null, label: 'Free', sublabel: 'Free' };
  }
  if (isTrial || seatsAvailableForThisSlot > 0) {
    return {
      isIncluded: true,
      isFree: false,
      extraPrice: seatType === 'field-crew' ? EXTRA_FIELD_CREW_PRICE : EXTRA_FULL_SEAT_PRICE,
      label: 'Included',
      sublabel: 'Included',
    };
  }
  if (seatType === 'field-crew') {
    return {
      isIncluded: false,
      isFree: false,
      extraPrice: EXTRA_FIELD_CREW_PRICE,
      label: `$${EXTRA_FIELD_CREW_PRICE}/mo`,
      sublabel: `$${EXTRA_FIELD_CREW_PRICE}/mo`,
    };
  }
  return {
    isIncluded: false,
    isFree: false,
    extraPrice: EXTRA_FULL_SEAT_PRICE,
    label: `$${EXTRA_FULL_SEAT_PRICE}/mo`,
    sublabel: `$${EXTRA_FULL_SEAT_PRICE}/mo`,
  };
}

// ── Role Badge ────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRole }) {
  if (role === 'Admin') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5">
        <Crown className="w-3 h-3" /> Admin
      </span>
    );
  }
  if (role === 'Customizer') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-2.5 py-0.5">
        <Wrench className="w-3 h-3" /> Customizer
      </span>
    );
  }
  if (role === 'Field Crew') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
        <Hammer className="w-3 h-3" /> Field Crew
      </span>
    );
  }
  if (role === 'View-only') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5">
        <Eye className="w-3 h-3" /> View-only
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5">
      <User className="w-3 h-3" /> Regular
    </span>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: UserStatus }) {
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

// ── App Count ─────────────────────────────────────────────────────────────────

const TOTAL_APPS = 25;

function AppCount({ count, role }: { count: number; role: UserRole }) {
  if (role === 'Admin') {
    return <span className="text-sm text-gray-500">All apps</span>;
  }
  return <span className="text-sm text-gray-500">{count}/{TOTAL_APPS} apps</span>;
}

// ── Custom Role Dropdown ──────────────────────────────────────────────────────

function RoleSelect({
  value,
  onChange,
  seatsAvailableForThisSlot,
  isTrial,
  essentialsOnly,
}: {
  value: UserRole;
  onChange: (role: UserRole) => void;
  seatsAvailableForThisSlot: number;
  isTrial: boolean;
  essentialsOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelStyle({ position: 'fixed', top: rect.bottom + 6, left: rect.left, width: rect.width, zIndex: 9999 });
    }
    setOpen(!open);
  };

  const selected = ROLE_OPTIONS.find((o) => o.role === value) ?? ROLE_OPTIONS[2];
  const selectedPricing = getPricingInfo(selected.seatType, seatsAvailableForThisSlot, isTrial);

  const visibleOptions = ROLE_OPTIONS;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-[44px]"
      >
        <span className="font-medium truncate">{selected.label}</span>
        <span className="flex items-center gap-1.5 flex-shrink-0">
          {selectedPricing.isFree && (
            <span className="text-xs font-medium text-green-600">Free</span>
          )}
          {!selectedPricing.isFree && selectedPricing.isIncluded && (
            <span className="text-xs font-medium text-green-600">Included</span>
          )}
          {!selectedPricing.isFree && !selectedPricing.isIncluded && (
            <span className="text-xs font-medium text-amber-600">{selectedPricing.label}</span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div ref={panelRef} style={panelStyle} className="bg-white rounded-xl border border-gray-200 shadow-xl">
          {visibleOptions.map((option, idx) => {
            const isSelected = option.role === value;
            const isLocked = essentialsOnly && option.seatType !== 'view-only';
            const pricing = getPricingInfo(option.seatType, seatsAvailableForThisSlot, isTrial);
            const isFirst = idx === 0;
            const isLast = idx === visibleOptions.length - 1;
            return (
              <div key={option.role} className="relative group">
                <button
                  type="button"
                  onClick={() => { if (!isLocked) { onChange(option.role); setOpen(false); } }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                    ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : ''}
                    ${isLocked ? 'opacity-40 cursor-not-allowed' : isSelected ? 'bg-blue-50/60' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{option.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {isLocked && option.extraPricePerMonth !== null && (
                      <div>
                        <p className="text-xs text-gray-400 line-through">${option.extraPricePerMonth}/mo</p>
                        <p className="text-xs font-semibold text-green-600 mt-0.5">Included</p>
                      </div>
                    )}
                    {!isLocked && pricing.isFree && <span className="text-xs font-semibold text-green-600">Free</span>}
                    {!isLocked && !pricing.isFree && pricing.isIncluded && (
                      <div>
                        <p className="text-xs text-gray-400 line-through">${pricing.extraPrice}/mo</p>
                        <p className="text-xs font-semibold text-green-600 mt-0.5">Included</p>
                      </div>
                    )}
                    {!isLocked && !pricing.isFree && !pricing.isIncluded && (
                      <div>
                        <p className="text-xs font-medium text-amber-600">
                          ${pricing.extraPrice}<span className="text-gray-400 font-normal">/mo</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {option.seatType === 'field-crew' ? 'Field crew seat' : 'Full seat'}
                        </p>
                      </div>
                    )}
                  </div>
                </button>
                {isLocked && (
                  <div className={`absolute ${isFirst ? 'top-full mt-1.5' : 'bottom-full mb-1.5'} left-1/2 -translate-x-1/2 z-[9999] px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none invisible group-hover:visible`}>
                    Requires Build plan or higher
                    <div className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${isFirst ? 'bottom-full border-b-gray-900' : 'top-full border-t-gray-900'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Row Menu ──────────────────────────────────────────────────────────────────

function RowMenu({ user, isOpen, onOpen, onClose, onEditPermissions, onRemove }: {
  user: MockUser; isOpen: boolean; onOpen: () => void; onClose: () => void;
  onEditPermissions: () => void; onRemove: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);

  function handleOpen() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    }
    onOpen();
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={(e) => { e.stopPropagation(); isOpen ? onClose() : handleOpen(); }}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {isOpen && menuPos && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={(e) => { e.stopPropagation(); onClose(); }} />
          <div
            style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, zIndex: 101 }}
            className="w-44 bg-white rounded-lg border border-gray-200 shadow-lg py-1 text-sm"
          >
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={(e) => { e.stopPropagation(); onClose(); onEditPermissions(); }}
            >
              Edit permissions
            </button>
            {user.status === 'Invited' && (
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); onClose(); }}>Resend invite</button>
            )}
            {user.status === 'Invited' && (
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); onClose(); }}>Cancel invite</button>
            )}
            <hr className="border-gray-100 my-1" />
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
              onClick={(e) => { e.stopPropagation(); onClose(); onRemove(); }}
            >
              Remove user
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── User Row ──────────────────────────────────────────────────────────────────

function UserRow({ user, cost, openMenu, onOpenMenu, onCloseMenu, onClick, onEditPermissions, onRemove }: {
  user: MockUser; cost: string; openMenu: string | null; onOpenMenu: (id: string) => void; onCloseMenu: () => void; onClick: () => void;
  onEditPermissions: (user: MockUser) => void; onRemove: (user: MockUser) => void;
}) {
  const isExtra = cost.startsWith('$');
  const isFree = cost === 'Free';
  return (
    <div onClick={onClick} className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_40px] items-center gap-4 px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-full ${user.avatarColor} flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold`}>
          {initials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>
      <div><RoleBadge role={user.role} /></div>
      <div>
        <span className={`text-sm font-medium ${isExtra ? 'text-gray-900' : 'text-gray-400'}`}>
          {isFree ? (
            <span className="text-gray-400 text-xs">Free</span>
          ) : isExtra ? (
            cost
          ) : (
            <span className="text-xs text-green-600 font-medium">Included</span>
          )}
        </span>
      </div>
      <div><StatusBadge status={user.status} /></div>
      <AppCount count={user.apps.length} role={user.role} />
      <div onClick={(e) => e.stopPropagation()}>
        <RowMenu
          user={user}
          isOpen={openMenu === user.id}
          onOpen={() => onOpenMenu(user.id)}
          onClose={onCloseMenu}
          onEditPermissions={() => onEditPermissions(user)}
          onRemove={() => onRemove(user)}
        />
      </div>
    </div>
  );
}

// ── Seat Meter ────────────────────────────────────────────────────────────────

function SeatMeter({
  subscription,
  includedSeats,
  fullSeatsUsed,
  fieldCrewCount,
  planName,
  basePrice,
  onUpgrade,
  multiEntityEnabled = false,
}: {
  subscription: ActiveSubscription | null;
  includedSeats: number;
  fullSeatsUsed: number;
  fieldCrewCount: number;
  planName: string;
  basePrice: number;
  onUpgrade: () => void;
  multiEntityEnabled?: boolean;
}) {
  if (!subscription) return null; // trial: no seat meter banner

  // Full seats take priority in the pool; field crew fill remaining slots
  const totalSeatsUsed = fullSeatsUsed + fieldCrewCount;
  const seatsForFieldCrew = Math.max(0, includedSeats - fullSeatsUsed);
  const extraFullSeats = Math.max(0, fullSeatsUsed - includedSeats);
  const extraFieldCrew = Math.max(0, fieldCrewCount - seatsForFieldCrew);
  const isOverLimit = extraFullSeats > 0 || extraFieldCrew > 0;
  const pct = Math.round((Math.min(totalSeatsUsed, includedSeats) / Math.max(includedSeats, 1)) * 100);
  const isNearLimit = !isOverLimit && pct >= 90;
  const isApproaching = !isOverLimit && !isNearLimit && pct >= 67;

  const extraFullCost = extraFullSeats * EXTRA_FULL_SEAT_PRICE;
  const extraFieldCrewCost = extraFieldCrew * EXTRA_FIELD_CREW_PRICE;
  const totalCost = basePrice + extraFullCost + extraFieldCrewCost;

  const theme = { bar: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', label: 'text-gray-900', tag: 'bg-white text-blue-700' };

  return (
    <div className={`rounded-xl border ${theme.border} ${theme.bg} p-4 mb-6`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full mt-0.5 bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <p className={`text-sm font-semibold ${theme.label}`}>
                {isOverLimit ? 'Over seat limit' : isNearLimit ? 'Seat limit reached' : isApproaching ? 'Approaching seat limit' : 'Seat usage'}
              </p>
            </div>
            <p className={`text-xs ${theme.text} mb-2`}>
              {totalSeatsUsed} of {includedSeats} seats used on {planName}
              {!isOverLimit && totalSeatsUsed < includedSeats ? ` — ${includedSeats - totalSeatsUsed} remaining` : ''}
            </p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${theme.bar}`} style={{ width: `${pct}%` }} />
            </div>
            {isOverLimit && (
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-xs text-gray-500">
                  {extraFullSeats + extraFieldCrew} extra {extraFullSeats + extraFieldCrew === 1 ? 'seat' : 'seats'}
                  {' '}({[
                    extraFullSeats > 0 && `${extraFullSeats} × $${EXTRA_FULL_SEAT_PRICE}`,
                    extraFieldCrew > 0 && `${extraFieldCrew} × $${EXTRA_FIELD_CREW_PRICE}`,
                  ].filter(Boolean).join(', ')})
                </span>
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">${extraFullCost + extraFieldCrewCost}/mo extra</span>
              </div>
            )}
          </div>
        </div>
        {!multiEntityEnabled && (
          <div className="flex-shrink-0">
            <button
              onClick={onUpgrade}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
            >
              {isOverLimit || isNearLimit || isApproaching ? (
                <><TrendingUp className="w-3.5 h-3.5" /> Upgrade plan</>
              ) : 'Manage plan'}
            </button>
          </div>
        )}
        {multiEntityEnabled && isOverLimit && (
          <p className="text-xs text-gray-500 flex-shrink-0 max-w-[180px] text-right">
            Additional seats are billed at ${EXTRA_FULL_SEAT_PRICE}/month each.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Invite Modal ──────────────────────────────────────────────────────────────

export function InviteModal({
  onClose,
  seatsAvailable,
  subscription,
  isTrial,
  onNavigate,
}: {
  onClose: () => void;
  seatsAvailable: number;
  subscription: ActiveSubscription | null;
  isTrial: boolean;
  onNavigate: (page: string) => void;
}) {
  const isEssentials = subscription?.planId === 'essentials';
  const defaultRole: UserRole = isEssentials ? 'View-only' : 'Regular';

  const [rows, setRows] = useState<InviteRow[]>(() => [newInviteRow(defaultRole)]);
  const [sent, setSent] = useState(false);
  const [copyFromUserId, setCopyFromUserId] = useState<string>('');

  const handleEmailChange = (id: string, value: string) => {
    setRows((prev) => {
      const next = prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          email: value,
          name: r.nameManuallyEdited ? r.name : extractNameFromEmail(value),
        };
      });

      // Keep exactly one trailing empty row
      const filledRows = next.filter((r) => r.email.trim());
      const emptyRows = next.filter((r) => !r.email.trim());
      // If the row being edited now has a value and was the last, add a new empty row
      const changedRow = next.find((r) => r.id === id);
      if (changedRow?.email.trim() && next.indexOf(changedRow) === next.length - 1) {
        return [...filledRows, ...emptyRows.slice(0, 1), newInviteRow(defaultRole)];
      }
      // Collapse extra empty rows to at most one
      return [...filledRows, ...(emptyRows.length > 0 ? [emptyRows[0]] : [newInviteRow(defaultRole)])];
    });
  };

  const handleRoleChange = (id: string, role: UserRole) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, role } : r)));
  };

  const handleNameChange = (id: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name: value, nameManuallyEdited: true } : r))
    );
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      if (next.length === 0) return [newInviteRow(defaultRole)];
      // Ensure at least one empty row at end
      const last = next[next.length - 1];
      if (last.email.trim()) return [...next, newInviteRow(defaultRole)];
      return next;
    });
  };

  const toggleName = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, showName: !r.showName } : r)));
  };

  const filledRows = rows.filter((r) => r.email.trim());
  const canSend = filledRows.length > 0;

  // Compute costs
  const inviteSummary = (() => {
    if (isTrial) return null;
    let seatsLeft = seatsAvailable;
    let extraFull = 0;
    let extraFieldCrew = 0;
    for (const row of filledRows) {
      const seatType = ROLE_SEAT_TYPE[row.role];
      if (seatType === 'view-only') continue;
      if (seatsLeft > 0) {
        seatsLeft--;
      } else {
        if (seatType === 'field-crew') extraFieldCrew++;
        else extraFull++;
      }
    }
    if (extraFull === 0 && extraFieldCrew === 0) return null;
    return {
      extraFull,
      extraFieldCrew,
      extraFullCost: extraFull * EXTRA_FULL_SEAT_PRICE,
      extraFieldCrewCost: extraFieldCrew * EXTRA_FIELD_CREW_PRICE,
      totalExtra: extraFull * EXTRA_FULL_SEAT_PRICE + extraFieldCrew * EXTRA_FIELD_CREW_PRICE,
    };
  })();

  const handleCopyFromUser = (userId: string) => {
    setCopyFromUserId(userId);
    if (!userId) return;
    const sourceUser = ALL_MOCK_USERS.find((u) => u.id === userId);
    if (!sourceUser) return;
    setRows((prev) => prev.map((r) => ({ ...r, role: sourceUser.role })));
  };

  const handleSend = () => {
    if (!canSend) return;
    setSent(true);
    setTimeout(onClose, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Invite team members</h2>
            <p className="text-sm text-gray-500 mt-0.5">They'll receive an email with a link to join</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rows */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {/* Trial disclaimer */}
          {isTrial && (
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-center gap-2.5 mb-4">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                No limits during trial. Seat limits apply once it ends —{' '}
                <a
                  href="/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-semibold underline underline-offset-2 hover:text-blue-900"
                >
                  view details <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          )}

          {/* Column headers */}
          <div className="flex gap-2 mb-2 px-0.5">
            <span className="flex-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Email address</span>
            <span className="flex-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Role</span>
            <div className="w-7 flex-shrink-0" />
          </div>

          <div className="space-y-1.5">
            {rows.map((row, i) => {
              const consumedBefore = seatsConsumedBefore(rows, i);
              const seatsForSlot = isTrial ? Infinity : Math.max(0, seatsAvailable - consumedBefore);
              const isEmptyRow = !row.email.trim();

              return (
                <div key={row.id}>
                  <div className="flex gap-2 items-center">
                    {/* Email */}
                    <div className="flex-1 relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="email"
                        value={row.email}
                        onChange={(e) => handleEmailChange(row.id, e.target.value)}
                        placeholder={i === 0 ? 'colleague@company.com' : 'Add another...'}
                        className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-[44px] bg-white"
                      />
                    </div>

                    {/* Role */}
                    <div className="flex-1">
                      <RoleSelect
                        value={row.role}
                        onChange={(role) => handleRoleChange(row.id, role)}
                        seatsAvailableForThisSlot={seatsForSlot}
                        isTrial={isTrial}
                        essentialsOnly={isEssentials}
                      />
                    </div>

                    {/* Name toggle — always visible on every row */}
                    <button
                      type="button"
                      onClick={() => toggleName(row.id)}
                      title="Set display name"
                      className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                        row.showName
                          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${row.showName ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Name field — revealed by chevron toggle */}
                  {row.showName && (
                    <div className="flex gap-1.5 mt-1.5 pl-1 pb-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 ml-1 mt-6" />
                      <div className="flex-1 min-w-0 pr-9">
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => handleNameChange(row.id, e.target.value)}
                          placeholder="User's full name"
                          disabled={isEmptyRow}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer area */}
        <div className="px-6 pb-5 flex-shrink-0 space-y-3">
          {/* Extra cost summary */}
          {inviteSummary && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Additional monthly charges
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                {inviteSummary.extraFull > 0 && (
                  <>
                    <span className="text-amber-700">{inviteSummary.extraFull} extra full {inviteSummary.extraFull === 1 ? 'seat' : 'seats'} × ${EXTRA_FULL_SEAT_PRICE}</span>
                    <span className="text-amber-900 font-semibold">${inviteSummary.extraFullCost}/mo</span>
                  </>
                )}
                {inviteSummary.extraFieldCrew > 0 && (
                  <>
                    <span className="text-amber-700">{inviteSummary.extraFieldCrew} extra field crew × ${EXTRA_FIELD_CREW_PRICE}</span>
                    <span className="text-amber-900 font-semibold">${inviteSummary.extraFieldCrewCost}/mo</span>
                  </>
                )}
                <span className="text-amber-900 font-bold pt-1 border-t border-amber-200">Total added to bill</span>
                <span className="text-amber-900 font-bold pt-1 border-t border-amber-200">${inviteSummary.totalExtra}/mo</span>
              </div>
            </div>
          )}

          {/* Essentials warning */}
          {isEssentials && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900">Essentials plan: View-only invites only</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Your plan includes 1 seat (yours). All other users can only be invited as View-only at no charge. To add Admin, Customizer, Regular, or Field Crew users, upgrade to Build.
                  </p>
                  <button
                    onClick={() => { onClose(); onNavigate('subscription-upgrade'); }}
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-900"
                  >
                    Upgrade to Build <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Divider separating the invite form from secondary options */}
          <div className="border-t border-gray-100 pt-3 space-y-1">
            {/* All apps note */}
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <p className="text-xs text-gray-500">
                Newly invited users will have access to all apps.{' '}
                <span
                  className="opacity-40 cursor-not-allowed select-none underline underline-offset-2 text-blue-600"
                  title="App-specific permissions coming soon"
                >
                  Specify which apps
                </span>
              </p>
            </div>

            {/* Copy role from existing user */}
            <div>
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  Or{' '}
                  <button
                    type="button"
                    onClick={() => setCopyFromUserId(copyFromUserId === '__open__' ? '' : '__open__')}
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
                  >
                    copy role and permissions from an existing user
                  </button>
                </p>
              </div>
              {copyFromUserId !== '' && (
                <div className="mt-2.5">
                  <UserDropdownSelect
                    value={copyFromUserId === '__open__' ? '' : copyFromUserId}
                    onChange={handleCopyFromUser}
                    options={ALL_MOCK_USERS}
                    placeholder="Select a user..."
                    onClear={() => setCopyFromUserId('')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!canSend || sent}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sent ? 'Invites sent!' : (
                <>
                  <Mail className="w-4 h-4" />
                  Send {filledRows.length > 1 ? `${filledRows.length} invites` : 'invite'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WIP User Detail ───────────────────────────────────────────────────────────

// ── Settings Toggle ────────────────────────────────────────────────────────────

function SettingsToggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ── User Detail Page ───────────────────────────────────────────────────────────

const QB_EMPLOYEES = [
  { value: '', label: 'Not linked' },
  { value: 'john-smith', label: 'John Smith' },
  { value: 'sarah-johnson', label: 'Sarah Johnson' },
  { value: 'mike-davis', label: 'Mike Davis' },
  { value: 'emily-chen', label: 'Emily Chen' },
];

const MOCK_ENTITIES = ['Method HQ', 'Method NYC', 'Method LA', 'Method UK', 'Method Canada'];

function EmpSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelStyle({ position: 'fixed', top: rect.bottom + 6, left: rect.left, width: rect.width, zIndex: 9999 });
    }
    setOpen(!open);
  };

  const selected = QB_EMPLOYEES.find((e) => e.value === value) ?? QB_EMPLOYEES[0];

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-[44px]"
      >
        <span className={`truncate ${!value ? 'text-gray-400' : 'font-medium'}`}>{selected.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div ref={panelRef} style={panelStyle} className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          {QB_EMPLOYEES.map((emp, idx) => (
            <button
              key={emp.value}
              type="button"
              onClick={() => { onChange(emp.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-gray-50 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
            >
              <span className={value === emp.value ? 'font-medium text-gray-900' : 'text-gray-700'}>
                {emp.label}
              </span>
              {value === emp.value && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Remove User Modal ──────────────────────────────────────────────────────────

const MOCK_RECORD_COUNTS: Record<string, number> = {
  '1': 142, '2': 87, '3': 63, '4': 29, '5': 51, '6': 74, '7': 18, '8': 34, '9': 11,
};

function fixedDropdownStyle(trigger: HTMLElement): React.CSSProperties {
  const rect = trigger.getBoundingClientRect();
  return { position: 'fixed', top: rect.bottom + 4, left: rect.left, width: rect.width, zIndex: 9999 };
}

function UserDropdownSelect({
  value,
  onChange,
  options,
  placeholder,
  onClear,
}: {
  value: string;
  onChange: (id: string) => void;
  options: MockUser[];
  placeholder?: string;
  onClear?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((u) => u.id === value);

  return (
    <div>
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        onClick={() => {
          if (triggerRef.current) setStyle(fixedDropdownStyle(triggerRef.current));
          setOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (triggerRef.current) setStyle(fixedDropdownStyle(triggerRef.current));
            setOpen((o) => !o);
          }
        }}
        className="w-full flex items-center justify-between gap-2 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer select-none"
      >
        {selected ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-6 h-6 rounded-full ${selected.avatarColor} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
              {initials(selected.name)}
            </div>
            <span>{selected.name}</span>
            <span className="text-gray-400 text-xs">{selected.role}</span>
          </div>
        ) : (
          <span className="text-gray-400">{placeholder ?? 'Select a user'}</span>
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
          {selected && onClear && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="p-0.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {open && (
        <div ref={panelRef} style={style} className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          {options.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => { onChange(u.id); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${value === u.id ? 'bg-blue-50' : ''}`}
            >
              <div className={`w-6 h-6 rounded-full ${u.avatarColor} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                {initials(u.name)}
              </div>
              <span className="flex-1 text-gray-900">{u.name}</span>
              <span className="text-gray-400 text-xs">{u.role}</span>
              {value === u.id && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Role downgrade warning modal ───────────────────────────────────────────────

function RoleDowngradeWarningModal({
  onInviteAdmin,
  onClose,
}: {
  onInviteAdmin: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px]">
        <div className="flex items-start gap-3 px-7 pt-7 pb-5">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-900">Can't change role</h2>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              You're the only admin on this account. Changing your role would leave the account with no admin.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-7 pb-5">
          <p className="text-xs font-medium text-gray-500 mb-3">To change your role, first:</p>
          <ol className="space-y-2.5">
            {[
              'Assign admin rights to an existing team member, or invite a new admin',
              'Once another admin is active, you can then change your own role',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-gray-50 border-t border-gray-100 px-7 py-4 flex items-center justify-between gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onClose(); onInviteAdmin(); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Invite a new admin
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Remove user modal ───────────────────────────────────────────────────────────

function RemoveUserModal({
  user,
  otherUsers,
  isSelf,
  isOnlyAdmin,
  userCosts,
  subscription,
  onClose,
  onConfirm,
  onInviteAdmin,
}: {
  user: MockUser;
  otherUsers: MockUser[];
  isSelf: boolean;
  isOnlyAdmin: boolean;
  userCosts: Record<string, string>;
  subscription: ActiveSubscription | null;
  onClose: () => void;
  onConfirm: (reassignToId: string, newAdminId?: string) => void;
  onInviteAdmin: () => void;
}) {
  const recordCount = MOCK_RECORD_COUNTS[user.id] ?? 24;
  const activeOthers = otherUsers.filter((u) => u.status === 'Active');

  const [reassignTo, setReassignTo] = useState(activeOthers[0]?.id ?? '');
  const [newAdminId, setNewAdminId] = useState(activeOthers[0]?.id ?? '');

  // Derive which modal variant to show
  const isOnlyUser = activeOthers.length === 0;
  const showHandover = isSelf && isOnlyAdmin && !isOnlyUser;
  const showBlockedNoUsers = isSelf && isOnlyAdmin && isOnlyUser;

  // Billing impact when doing a handover (only meaningful when subscription exists)
  const newAdminUser = activeOthers.find((u) => u.id === newAdminId);
  const billingNote: { text: string; type: 'saving' | 'neutral' } | null = (() => {
    if (!showHandover || !subscription || !newAdminUser) return null;
    const cost = userCosts[newAdminUser.id] ?? '';
    const seatType = ROLE_SEAT_TYPE[newAdminUser.role];
    if (seatType === 'field-crew' && cost.startsWith('$')) {
      return {
        type: 'saving',
        text: `Promoting ${newAdminUser.name} to Admin frees their Field Crew seat, saving $${EXTRA_FIELD_CREW_PRICE}/mo.`,
      };
    }
    if (seatType === 'full' && cost.startsWith('$')) {
      return {
        type: 'saving',
        text: `Your freed seat will cover ${newAdminUser.name}'s extra seat charge — saving $${EXTRA_FULL_SEAT_PRICE}/mo.`,
      };
    }
    return { type: 'neutral', text: 'Your seat will be freed — no billing change.' };
  })();

  // ── Blocked: only user on account ──────────────────────────────────────────
  if (showBlockedNoUsers) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px]">
          <div className="flex items-start justify-between px-7 pt-7 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">You can't remove your access yet</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-7 pb-7 space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              You're the only user on this account. To remove your own access, you must first invite another admin to take over.
            </p>
            <div className="rounded-xl border border-gray-200 divide-y divide-gray-100">
              <div className="flex items-start gap-3 px-4 py-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <p className="text-sm text-gray-700">Invite a new admin and wait for them to accept</p>
              </div>
              <div className="flex items-start gap-3 px-4 py-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <p className="text-sm text-gray-700">Come back here to remove your own access and reassign your records</p>
              </div>
            </div>
            <div className="pt-1 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3">Alternatively, if you want to delete the entire account:</p>
              <button
                disabled
                className="text-xs text-gray-400 underline underline-offset-2 cursor-not-allowed"
                title="Contact support to delete your account (not available in prototype)"
              >
                Contact support to delete this account
              </button>
            </div>
          </div>
          <div className="bg-gray-50 border-t border-gray-100 px-7 py-4 flex items-center justify-between gap-3 rounded-b-2xl">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={onInviteAdmin}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" /> Invite a new admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Handover: only admin, but other users exist ─────────────────────────────
  if (showHandover) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px]">
          <div className="flex items-start justify-between px-7 pt-7 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Remove your access?</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-7 pb-7 space-y-5">
            <p className="text-sm text-gray-600 leading-relaxed">
              You're the only admin. Before removing your access, select who receives your{' '}
              <span className="font-medium text-gray-900">{recordCount} records</span> and who takes over as admin.
            </p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Reassign your records to</label>
              <UserDropdownSelect value={reassignTo} onChange={setReassignTo} options={activeOthers} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">New admin</label>
              <p className="text-xs text-gray-400 -mt-0.5">This user will be promoted to Admin and take over account ownership.</p>
              <UserDropdownSelect value={newAdminId} onChange={setNewAdminId} options={activeOthers} />
            </div>
            {billingNote && (
              <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 ${
                billingNote.type === 'saving'
                  ? 'bg-green-50 border border-green-100'
                  : 'bg-blue-50 border border-blue-100'
              }`}>
                <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${billingNote.type === 'saving' ? 'text-green-600' : 'text-blue-500'}`} />
                <p className={`text-xs leading-relaxed ${billingNote.type === 'saving' ? 'text-green-700' : 'text-blue-600'}`}>
                  {billingNote.text}
                </p>
              </div>
            )}
          </div>
          <div className="bg-gray-50 border-t border-gray-100 px-7 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={() => onConfirm(reassignTo, newAdminId)}
              disabled={!reassignTo || !newAdminId}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Remove & hand over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal: removing another user ──────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px]">
        <div className="flex items-start justify-between px-7 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Remove {user.name.split(' ')[0]}'s access?</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-7 pb-7 space-y-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-medium text-gray-900">{user.name}</span> has{' '}
            <span className="font-medium text-gray-900">{recordCount} records</span> assigned to them. Removing their access will not delete these records, but you should reassign them to keep your data organized.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Reassign records to</label>
            <UserDropdownSelect value={reassignTo} onChange={setReassignTo} options={activeOthers} />
          </div>
        </div>
        <div className="bg-gray-50 border-t border-gray-100 px-7 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reassignTo)}
            disabled={!reassignTo}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Remove & reassign records
          </button>
        </div>
      </div>
    </div>
  );
}

function UserDetailPage({
  user,
  allUsers,
  userCosts,
  onBack,
  subscription,
  onViewAppAccess,
  onInviteAdmin,
  highlightRole,
  onRoleHighlightDone,
}: {
  user: MockUser;
  allUsers: MockUser[];
  userCosts: Record<string, string>;
  onBack: () => void;
  subscription: ActiveSubscription | null;
  onViewAppAccess: () => void;
  highlightRole?: boolean;
  onRoleHighlightDone?: () => void;
  onInviteAdmin: () => void;
}) {
  const [username, setUsername] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role);
  const [qbEmployee, setQbEmployee] = useState('');
  const [peerRecords, setPeerRecords] = useState(true);
  const [apiEnabled, setApiEnabled] = useState(false);
  const [notifInvoice, setNotifInvoice] = useState(false);
  const [notifEstimate, setNotifEstimate] = useState(false);
  const [notifBilling, setNotifBilling] = useState(false);
  const [notifUser, setNotifUser] = useState(false);
  const [twoFAStatus] = useState<'enabled' | 'not-set-up'>(
    user.status === 'Active' ? 'enabled' : 'not-set-up'
  );
  const [entities, setEntities] = useState<string[]>(['Method HQ']);
  const [twoFaReset, setTwoFaReset] = useState(false);
  const [savedAll, setSavedAll] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRoleDowngradeModal, setShowRoleDowngradeModal] = useState(false);
  const [rolePulse, setRolePulse] = useState(false);
  const roleRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightRole) {
      const t1 = setTimeout(() => {
        roleRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setRolePulse(true);
      }, 120);
      const t2 = setTimeout(() => { setRolePulse(false); onRoleHighlightDone?.(); }, 2000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [highlightRole]);

  const initial = useRef({ username: user.name, role: user.role as UserRole, qbEmployee: '', peerRecords: true, apiEnabled: false, entities: ['Method HQ'], notifInvoice: false, notifEstimate: false, notifBilling: false, notifUser: false });

  const hasChanges =
    username !== initial.current.username ||
    role !== initial.current.role ||
    qbEmployee !== initial.current.qbEmployee ||
    peerRecords !== initial.current.peerRecords ||
    apiEnabled !== initial.current.apiEnabled ||
    JSON.stringify(entities) !== JSON.stringify(initial.current.entities) ||
    notifInvoice !== initial.current.notifInvoice ||
    notifEstimate !== initial.current.notifEstimate ||
    notifBilling !== initial.current.notifBilling ||
    notifUser !== initial.current.notifUser;

  const isScale = subscription?.planId === 'scale';
  // Prototype: the logged-in user is always Paul (id '1')
  const isSelf = user.id === '1';
  const isOnlyAdmin = user.role === 'Admin' && allUsers.filter((u) => u.role === 'Admin').length <= 1;

  function saveAll() {
    initial.current = { username, role, qbEmployee, peerRecords, apiEnabled, entities: [...entities], notifInvoice, notifEstimate, notifBilling, notifUser };
    setSavedAll(true);
    setTimeout(() => setSavedAll(false), 2000);
  }

  function undoChanges() {
    setUsername(initial.current.username);
    setRole(initial.current.role);
    setQbEmployee(initial.current.qbEmployee);
    setPeerRecords(initial.current.peerRecords);
    setApiEnabled(initial.current.apiEnabled);
    setEntities([...initial.current.entities]);
    setNotifInvoice(initial.current.notifInvoice);
    setNotifEstimate(initial.current.notifEstimate);
    setNotifBilling(initial.current.notifBilling);
    setNotifUser(initial.current.notifUser);
  }

  function handleRoleChange(newRole: UserRole) {
    if (isSelf && isOnlyAdmin && newRole !== 'Admin') {
      setShowRoleDowngradeModal(true);
      return;
    }
    setRole(newRole);
  }

  function toggleEntity(entity: string) {
    setEntities((prev) =>
      prev.includes(entity) ? prev.filter((e) => e !== entity) : [...prev, entity]
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm mb-6">
          <button onClick={onBack} className="text-blue-600 hover:underline">Users</button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-700 font-medium">{user.name}</span>
        </div>

        {/* User header */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 rounded-full ${user.avatarColor} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
            {initials(user.name)}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
              <StatusBadge status={user.status} />
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <RoleBadge role={role} />
            </div>
          </div>
        </div>

        {/* ── Single unified card ──────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

          {/* Profile & role */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 py-7 px-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Profile & role</h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">Display name and permission level within Method.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Display name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[44px]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Sign-in email</label>
                <input
                  type="text"
                  value={user.email}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed h-[44px]"
                />
                <p className="mt-1.5 text-xs text-gray-400">The user can update their own sign-in email from their account settings.</p>
              </div>
              <div
                ref={roleRowRef}
                className={`rounded-lg transition-all duration-300 ${rolePulse ? 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50/40' : ''}`}
              >
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Role</label>
                <RoleSelect
                  value={role}
                  onChange={handleRoleChange}
                  seatsAvailableForThisSlot={999}
                  isTrial={!subscription}
                  essentialsOnly={false}
                />
              </div>
            </div>
          </div>

          <hr className="mx-6 border-gray-100" />

          {/* QuickBooks employee */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 py-7 px-6 md:items-center">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">QuickBooks employee</h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">Link to a QB employee record to sync labour data automatically.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Linked employee</label>
              <EmpSelect value={qbEmployee} onChange={setQbEmployee} />
            </div>
          </div>

          <hr className="mx-6 border-gray-100" />

          {/* Records access */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 py-7 px-6 md:items-center">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Records access</h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">Control visibility of records owned by other team members.</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Access all peer records</p>
                <p className="text-xs text-gray-500 mt-0.5">When off, this user only sees records assigned directly to them.</p>
              </div>
              <SettingsToggle enabled={peerRecords} onChange={setPeerRecords} />
            </div>
          </div>

          <hr className="mx-6 border-gray-100" />

          {/* Application access */}
          <button
            onClick={onViewAppAccess}
            className="w-full grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 py-7 px-6 hover:bg-gray-50 transition-colors text-left group md:items-center rounded-none"
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Application access</h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">Choose which apps this user can access.</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Manage app access</p>
                <p className="text-xs text-gray-500 mt-0.5">{user.apps.length} {user.apps.length === 1 ? 'app' : 'apps'} currently enabled</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
            </div>
          </button>

          <hr className="mx-6 border-gray-100" />

          {/* Developer access */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 py-7 px-6 md:items-center">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Developer access</h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">Allow this user to connect to the Method API for custom integrations.</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Allow Method API access</p>
                <p className="text-xs text-gray-500 mt-0.5">User can generate API keys and authenticate programmatically.</p>
              </div>
              <SettingsToggle enabled={apiEnabled} onChange={setApiEnabled} />
            </div>
          </div>

          <hr className="mx-6 border-gray-100" />

          {/* Two-factor authentication */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 py-7 px-6 md:items-center">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Two-factor authentication</h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">Resetting forces the user to reconfigure their authenticator on next sign-in.</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                {twoFAStatus === 'enabled' ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5">
                    <ShieldCheck className="w-4 h-4" /> 2FA enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5">
                    Not set up
                  </span>
                )}
              </div>
              {twoFAStatus === 'enabled' && (
                <button
                  onClick={() => { setTwoFaReset(true); setTimeout(() => setTwoFaReset(false), 2000); }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    twoFaReset
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {twoFaReset ? 'Reset sent' : 'Reset 2FA'}
                </button>
              )}
            </div>
          </div>

          <hr className="mx-6 border-gray-100" />

          {/* Entity access — Scale plan only */}
          {isScale && (
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 py-7 px-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-semibold text-gray-900">Entity access</h2>
                  <span className="text-xs font-medium text-purple-700 bg-purple-50 border border-purple-100 rounded-full px-2 py-0.5">Scale</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">Manage which entity accounts this user belongs to.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Assigned entity accounts</label>
                <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                  {entities.map((e) => (
                    <span key={e} className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg px-2.5 py-1">
                      <Building2 className="w-3 h-3 text-gray-400" />
                      {e}
                      <button onClick={() => toggleEntity(e)} className="text-gray-400 hover:text-red-500 transition-colors ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {entities.length === 0 && <span className="text-xs text-gray-400 py-1">No entity accounts assigned</span>}
                </div>
                {MOCK_ENTITIES.filter((e) => !entities.includes(e)).length > 0 && (
                  <select
                    value=""
                    onChange={(e) => { if (e.target.value) toggleEntity(e.target.value); }}
                    className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">+ Add to another entity account…</option>
                    {MOCK_ENTITIES.filter((e) => !entities.includes(e)).map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}

          <hr className="mx-6 border-gray-100" />

          {/* Notification settings */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 py-7 px-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Notification settings</h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                Email notifications {user.name.split(' ')[0]} receives for account activity.
              </p>
            </div>
            <div className="space-y-4">
              {(
                [
                  { label: 'Invoice paid', desc: 'Notify when a customer pays an invoice', value: notifInvoice, onChange: setNotifInvoice },
                  { label: 'Estimate accepted', desc: 'Notify when a customer accepts an estimate', value: notifEstimate, onChange: setNotifEstimate },
                  { label: 'Billing changes', desc: 'Notify when the account plan or billing details change', value: notifBilling, onChange: setNotifBilling },
                  { label: 'User added or removed', desc: 'Notify when a team member is invited or removed', value: notifUser, onChange: setNotifUser },
                ] as const
              ).map(({ label, desc, value, onChange }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <SettingsToggle enabled={value} onChange={onChange} />
                </div>
              ))}
            </div>
          </div>

          <hr className="mx-6 border-gray-100" />

          {/* Remove user */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 py-7 px-6 md:items-center">
            <div>
              <h2 className="text-sm font-semibold text-red-500">
                {isSelf ? 'Remove your access' : 'Remove user'}
              </h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                {isSelf && isOnlyAdmin
                  ? 'As the only admin, removing your access requires handing over admin rights to another user.'
                  : 'Revokes access immediately. Their records stay intact.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isSelf ? 'Remove your access from this account' : `Remove ${username} from this account`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isSelf
                    ? 'Your records and admin rights must be transferred before you can leave.'
                    : 'They lose access immediately. You\'ll be able to reassign their records to another user.'}
                </p>
                <button
                  onClick={() => setShowRemoveModal(true)}
                  className="mt-2 text-xs font-medium text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors"
                >
                  {isSelf ? 'Remove my access' : 'Remove user access'}
                </button>
              </div>
            </div>
          </div>

        </div>
        <div className="h-24" />
      </div>

      {/* Floating save bar */}
      {(hasChanges || savedAll) && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white rounded-xl shadow-2xl border border-gray-200 px-4 py-2.5 transition-all">
          <span className="text-xs text-gray-400 mr-1">Unsaved changes</span>
          <button
            onClick={undoChanges}
            className="text-sm text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
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
            {savedAll ? <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Saved</span> : 'Save all changes'}
          </button>
        </div>
      )}

      {showRemoveModal && (
        <RemoveUserModal
          user={user}
          otherUsers={allUsers.filter((u) => u.id !== user.id)}
          isSelf={isSelf}
          isOnlyAdmin={isOnlyAdmin}
          userCosts={userCosts}
          subscription={subscription}
          onClose={() => setShowRemoveModal(false)}
          onConfirm={() => { setShowRemoveModal(false); onBack(); }}
          onInviteAdmin={() => { setShowRemoveModal(false); onInviteAdmin(); }}
        />
      )}

      {showRoleDowngradeModal && (
        <RoleDowngradeWarningModal
          onClose={() => setShowRoleDowngradeModal(false)}
          onInviteAdmin={() => { setShowRoleDowngradeModal(false); onInviteAdmin(); }}
        />
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

interface UserManagementPageProps {
  subscription: ActiveSubscription | null;
  teamSize: number;
  onNavigate: (page: string) => void;
  onBack: () => void;
  isTrial?: boolean;
  onUpgrade?: (planId: string) => void;
  multiEntityEnabled?: boolean;
}

export function UserManagementPage({
  subscription,
  teamSize,
  onNavigate,
  onBack,
  isTrial = false,
  onUpgrade,
  multiEntityEnabled = false,
}: UserManagementPageProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Invited' | 'Deactivated'>('All');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [viewingAppAccess, setViewingAppAccess] = useState(false);
  const [roleHighlight, setRoleHighlight] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<MockUser | null>(null);

  const isEssentials = subscription?.planId === 'essentials';

  const teamUsers = ALL_MOCK_USERS.slice(0, Math.min(teamSize, ALL_MOCK_USERS.length))
    .map((u, idx) => isEssentials && idx > 0 ? { ...u, role: 'View-only' as UserRole } : u);
  const fullSeatsUsed = teamUsers.filter((u) => ROLE_SEAT_TYPE[u.role] === 'full').length;
  const fieldCrewCount = teamUsers.filter((u) => ROLE_SEAT_TYPE[u.role] === 'field-crew').length;

  const includedSeats = subscription ? (PLAN_SEATS[subscription.planId] ?? 1) : 999;
  const totalSeatsUsed = fullSeatsUsed + fieldCrewCount;
  const seatsAvailable = isTrial ? 999 : Math.max(0, includedSeats - totalSeatsUsed);
  const planName = subscription ? PLAN_NAMES[subscription.planId] : 'Trial';

  const currentPlanIndex = subscription ? PLAN_ORDER.indexOf(subscription.planId as typeof PLAN_ORDER[number]) : -1;
  const nextPlanId = currentPlanIndex >= 0 && currentPlanIndex < PLAN_ORDER.length - 1
    ? PLAN_ORDER[currentPlanIndex + 1]
    : null;

  // Per-user cost: full seats fill pool first, field crew fill remaining slots
  const userCosts: Record<string, string> = (() => {
    const costs: Record<string, string> = {};
    let fullCount = 0;
    let fcPoolLeft = Math.max(0, includedSeats - fullSeatsUsed);
    teamUsers.forEach((u) => {
      const st = ROLE_SEAT_TYPE[u.role];
      if (st === 'view-only') { costs[u.id] = 'Free'; }
      else if (st === 'full') { fullCount++; costs[u.id] = fullCount <= includedSeats ? 'Included' : `$${EXTRA_FULL_SEAT_PRICE}/mo`; }
      else { costs[u.id] = fcPoolLeft-- > 0 ? 'Included' : `$${EXTRA_FIELD_CREW_PRICE}/mo`; }
    });
    return costs;
  })();

  const basePrice = subscription
    ? subscription.billingCycle === 'annual'
      ? PLAN_PRICES_ANNUAL[subscription.planId] ?? 0
      : PLAN_PRICES_MONTHLY[subscription.planId] ?? 0
    : 0;

  const STATUS_OPTIONS = [
    { value: 'All' as const, label: 'All Users' },
    { value: 'Active' as const, label: 'Active Users' },
    { value: 'Invited' as const, label: 'Invited Users Pending Activation' },
    { value: 'Deactivated' as const, label: 'Deactivated Users' },
  ];
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === filterStatus)?.label ?? 'All Users';

  const visibleUsers = teamUsers
    .filter((u) => {
      if (filterStatus === 'Active') return u.status === 'Active';
      if (filterStatus === 'Invited') return u.status === 'Invited';
      if (filterStatus === 'Deactivated') return u.status === 'Deactivated';
      return true;
    })
    .filter((u) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const aInvited = a.status === 'Invited' ? 0 : 1;
      const bInvited = b.status === 'Invited' ? 0 : 1;
      if (aInvited !== bInvited) return aInvited - bInvited;
      return a.name.localeCompare(b.name);
    });

  if (selectedUser && viewingAppAccess) {
    return (
      <ApplicationsAccessPage
        user={selectedUser.name}
        isAdmin={selectedUser.role === 'Admin'}
        userRole={selectedUser.role}
        subscription={subscription}
        onBack={() => setViewingAppAccess(false)}
        onChangeRole={() => { setViewingAppAccess(false); setRoleHighlight(true); }}
        onNavigate={onNavigate}
        onUpgrade={() => onNavigate('subscription-upgrade')}
      />
    );
  }

  if (selectedUser) {
    return (
      <UserDetailPage
        user={selectedUser}
        allUsers={teamUsers}
        userCosts={userCosts}
        onBack={() => { setSelectedUser(null); setViewingAppAccess(false); }}
        subscription={subscription}
        onViewAppAccess={() => setViewingAppAccess(true)}
        onInviteAdmin={() => { setSelectedUser(null); setShowInviteModal(true); }}
        highlightRole={roleHighlight}
        onRoleHighlightDone={() => setRoleHighlight(false)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-4 text-sm">
          <ChevronLeft className="w-4 h-4" /> Account Settings
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500">Manage your team members and their access</p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShow2FAModal(true)}
              className="inline-flex items-center gap-1.5 border border-blue-600 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 bg-transparent hover:bg-blue-50 transition-colors h-9 whitespace-nowrap"
            >
              <Shield className="w-4 h-4" /> Enable 2FA
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors h-9 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" /> Invite user
            </button>
          </div>
        </div>

        <SeatMeter
          subscription={subscription}
          includedSeats={includedSeats}
          fullSeatsUsed={fullSeatsUsed}
          fieldCrewCount={fieldCrewCount}
          planName={planName}
          basePrice={basePrice}
          onUpgrade={() => nextPlanId && onUpgrade ? onUpgrade(nextPlanId) : onNavigate('subscription-upgrade')}
          multiEntityEnabled={multiEntityEnabled}
        />

        {/* Grid header: title dropdown + search */}
        <div className="flex items-center justify-between mb-3">
          {/* Status title dropdown */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setStatusDropdownOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              {statusLabel}
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl z-20 w-72 overflow-hidden">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setFilterStatus(opt.value); setStatusDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                      filterStatus === opt.value ? 'bg-blue-50/60 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-3.5 flex-shrink-0">
                      {filterStatus === opt.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search + non-functional filter icon */}
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-r-0 border-gray-300 rounded-l-lg pl-9 pr-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 h-9"
              />
            </div>
            <div className="h-9 w-px bg-gray-300" />
            <button className="border border-l-0 border-gray-300 rounded-r-lg px-2.5 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors bg-white cursor-default">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_40px] items-center gap-4 px-4 py-2.5 border-b border-gray-100 bg-gray-50/80">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">User</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Cost</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">App access</span>
            <span />
          </div>
          {visibleUsers.length === 0 ? (
            <div className="py-14 flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">No users found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {visibleUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  cost={userCosts[user.id] ?? 'Included'}
                  openMenu={openMenu}
                  onOpenMenu={setOpenMenu}
                  onCloseMenu={() => setOpenMenu(null)}
                  onClick={() => setSelectedUser(user)}
                  onEditPermissions={(u) => { setSelectedUser(u); setViewingAppAccess(true); }}
                  onRemove={(u) => setRemoveTarget(u)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showInviteModal && (
        <InviteModal
          seatsAvailable={seatsAvailable}
          subscription={subscription}
          isTrial={isTrial}
          onClose={() => setShowInviteModal(false)}
          onNavigate={onNavigate}
        />
      )}

      {show2FAModal && <TwoFAModal onClose={() => setShow2FAModal(false)} />}

      {removeTarget && (() => {
        const admins = teamUsers.filter((u) => u.role === 'Admin');
        const isSelf = removeTarget.id === '1';
        const isOnlyAdmin = removeTarget.role === 'Admin' && admins.length === 1;
        return (
          <RemoveUserModal
            user={removeTarget}
            otherUsers={teamUsers.filter((u) => u.id !== removeTarget.id)}
            isSelf={isSelf}
            isOnlyAdmin={isOnlyAdmin}
            userCosts={userCosts}
            subscription={subscription}
            onClose={() => setRemoveTarget(null)}
            onConfirm={() => setRemoveTarget(null)}
            onInviteAdmin={() => { setRemoveTarget(null); setShowInviteModal(true); }}
          />
        );
      })()}
    </div>
  );
}

// ── 2FA Modal ─────────────────────────────────────────────────────────────────

function TwoFAModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = React.useState<'optional' | 'enforce'>('optional');
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px]">
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5">
          <h2 className="text-xl font-bold text-gray-900 pr-4">Enabling two-factor authentication</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pb-7">
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Improve your account's security by requiring another layer of authentication for users signing in with email and password. 2FA is not required for those signing in using SSO.
          </p>

          <div className="space-y-4">
            {/* Optional */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                selected === 'optional' ? 'border-blue-600' : 'border-gray-300 group-hover:border-gray-400'
              }`}>
                {selected === 'optional' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
              </div>
              <input type="radio" className="sr-only" checked={selected === 'optional'} onChange={() => setSelected('optional')} />
              <span className="text-sm text-gray-800">Optional</span>
            </label>

            {/* Enforce */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                selected === 'enforce' ? 'border-blue-600' : 'border-gray-300 group-hover:border-gray-400'
              }`}>
                {selected === 'enforce' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
              </div>
              <input type="radio" className="sr-only" checked={selected === 'enforce'} onChange={() => setSelected('enforce')} />
              <span className="text-sm text-gray-800">Enforce on all users accounts</span>
              <div className="relative flex-shrink-0" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-default transition-colors" />
                {showTooltip && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 w-56 text-center pointer-events-none">
                    Two-factor authentication will be enforced on users' next sign in
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-7 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
