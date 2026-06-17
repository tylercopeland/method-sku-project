import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  UserPlus,
  Shield,
  MoreHorizontal,
  ChevronLeft,
  ChevronDown,
  X,
  AlertTriangle,
  Users,
  Crown,
  Wrench,
  User,
  TrendingUp,
  ArrowRight,
  Clock,
  Mail,
  Hammer,
  Eye,
  Check,
  Info,
  ExternalLink,
  Trash2,
  UserRound,
} from 'lucide-react';
import type { ActiveSubscription } from './SubscriptionPage';

// ── Types ──────────────────────────────────────────────────────────────────────

type UserRole = 'Admin' | 'Customizer' | 'Regular' | 'Field Crew' | 'View-only';
type SeatType = 'full' | 'field-crew' | 'view-only';
type UserStatus = 'Active' | 'Invited';

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

function newInviteRow(): InviteRow {
  return {
    id: Math.random().toString(36).slice(2),
    email: '',
    role: 'Regular',
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

// ── App Chips ─────────────────────────────────────────────────────────────────

function AppChips({ apps }: { apps: string[] }) {
  const visible = apps.slice(0, 2);
  const overflow = apps.length - 2;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((app) => (
        <span key={app} className="inline-block text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5 border border-gray-200">
          {app}
        </span>
      ))}
      {overflow > 0 && <span className="inline-block text-xs text-gray-400 font-medium">+{overflow} more</span>}
    </div>
  );
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

  const visibleOptions = essentialsOnly
    ? ROLE_OPTIONS.filter((o) => o.seatType === 'view-only')
    : ROLE_OPTIONS;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="w-full flex items-start justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[44px]"
      >
        <span className="flex flex-col items-start">
          <span className="font-medium leading-tight">{selected.label}</span>
          {/* Sub-label: pricing for this slot */}
          {selectedPricing.isFree ? (
            <span className="text-[10px] text-green-600 mt-0.5">Free</span>
          ) : selectedPricing.isIncluded ? (
            <span className="text-[10px] text-green-600 mt-0.5">Included</span>
          ) : (
            <span className="text-[10px] text-amber-600 mt-0.5">{selectedPricing.label} extra</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 mt-0.5 ml-1 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div ref={panelRef} style={panelStyle} className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          {visibleOptions.map((option) => {
            const isSelected = option.role === value;
            const pricing = getPricingInfo(option.seatType, seatsAvailableForThisSlot, isTrial);
            return (
              <button
                key={option.role}
                type="button"
                onClick={() => { onChange(option.role); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50/60' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{option.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {pricing.isFree && <span className="text-xs font-semibold text-green-600">Free</span>}
                  {!pricing.isFree && pricing.isIncluded && (
                    <div>
                      <p className="text-xs text-gray-400 line-through">
                        ${pricing.extraPrice}/mo
                      </p>
                      <p className="text-xs font-semibold text-green-600 mt-0.5">Included</p>
                    </div>
                  )}
                  {!pricing.isFree && !pricing.isIncluded && (
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
                <div className="w-4 flex-shrink-0 flex items-center justify-center">
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Row Menu ──────────────────────────────────────────────────────────────────

function RowMenu({ user, isOpen, onOpen, onClose }: {
  user: MockUser; isOpen: boolean; onOpen: () => void; onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); isOpen ? onClose() : onOpen(); }}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); onClose(); }} />
          <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-lg border border-gray-200 shadow-lg py-1 text-sm">
            <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); onClose(); }}>Edit permissions</button>
            {user.status === 'Invited' && (
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); onClose(); }}>Resend invite</button>
            )}
            <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); onClose(); }}>
              {user.status === 'Active' ? 'Disable user' : 'Cancel invite'}
            </button>
            <hr className="border-gray-100 my-1" />
            <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors" onClick={(e) => { e.stopPropagation(); onClose(); }}>Remove user</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── User Row ──────────────────────────────────────────────────────────────────

function UserRow({ user, openMenu, onOpenMenu, onCloseMenu, onClick }: {
  user: MockUser; openMenu: string | null; onOpenMenu: (id: string) => void; onCloseMenu: () => void; onClick: () => void;
}) {
  return (
    <div onClick={onClick} className="grid grid-cols-[2fr_1fr_1fr_2fr_40px] items-center gap-4 px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
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
      <div><StatusBadge status={user.status} /></div>
      <AppChips apps={user.apps} />
      <div onClick={(e) => e.stopPropagation()}>
        <RowMenu user={user} isOpen={openMenu === user.id} onOpen={() => onOpenMenu(user.id)} onClose={onCloseMenu} />
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
}: {
  subscription: ActiveSubscription | null;
  includedSeats: number;
  fullSeatsUsed: number;
  fieldCrewCount: number;
  planName: string;
  basePrice: number;
  onUpgrade: () => void;
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

  const theme = isOverLimit
    ? { bar: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'text-red-900', tag: 'bg-red-100 text-red-700' }
    : isNearLimit
    ? { bar: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', label: 'text-orange-900', tag: 'bg-orange-100 text-orange-700' }
    : isApproaching
    ? { bar: 'bg-amber-400', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'text-amber-900', tag: 'bg-amber-100 text-amber-700' }
    : { bar: 'bg-blue-500', bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-600', label: 'text-gray-900', tag: 'bg-blue-50 text-blue-700' };

  return (
    <div className={`rounded-xl border ${theme.border} ${theme.bg} p-4`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-9 h-9 rounded-full mt-0.5 ${isOverLimit ? 'bg-red-100' : isNearLimit ? 'bg-orange-100' : isApproaching ? 'bg-amber-100' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`}>
            <Users className={`w-4 h-4 ${isOverLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : isApproaching ? 'text-amber-600' : 'text-blue-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <p className={`text-sm font-semibold ${theme.label}`}>
                {isOverLimit ? `Over seat limit` : isNearLimit ? 'Seat limit reached' : isApproaching ? 'Approaching seat limit' : 'Seat usage'}
              </p>
              {isOverLimit && (
                <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${theme.tag}`}>
                  ${extraFullCost + extraFieldCrewCost}/mo extra
                </span>
              )}
            </div>
            <p className={`text-xs ${theme.text} mb-2`}>
              {totalSeatsUsed} of {includedSeats} seats used on {planName}
              {!isOverLimit && totalSeatsUsed < includedSeats ? ` — ${includedSeats - totalSeatsUsed} remaining` : ''}
            </p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${theme.bar}`} style={{ width: `${pct}%` }} />
            </div>
            {isOverLimit && (
              <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-x-8 gap-y-0.5 text-xs">
                <span className={theme.text}>{planName} plan</span>
                <span className={`${theme.label} font-medium`}>${basePrice}/mo</span>
                {extraFullSeats > 0 && (
                  <>
                    <span className={theme.text}>{extraFullSeats} extra full {extraFullSeats === 1 ? 'seat' : 'seats'} × ${EXTRA_FULL_SEAT_PRICE}</span>
                    <span className={`${theme.label} font-medium`}>${extraFullCost}/mo</span>
                  </>
                )}
                {extraFieldCrew > 0 && (
                  <>
                    <span className="text-amber-700">{extraFieldCrew} extra field crew × ${EXTRA_FIELD_CREW_PRICE}</span>
                    <span className="text-amber-900 font-medium">${extraFieldCrewCost}/mo</span>
                  </>
                )}
                <span className={`${theme.label} font-semibold mt-1`}>Total</span>
                <span className={`${theme.label} font-bold mt-1`}>${totalCost}/mo</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onUpgrade}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isOverLimit ? 'bg-red-600 text-white hover:bg-red-700'
              : isNearLimit || isApproaching ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isOverLimit || isNearLimit || isApproaching ? (
              <><TrendingUp className="w-3.5 h-3.5" /> Upgrade plan</>
            ) : 'Manage plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Invite Modal ──────────────────────────────────────────────────────────────

function InviteModal({
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
  const [rows, setRows] = useState<InviteRow[]>([newInviteRow()]);
  const [sent, setSent] = useState(false);

  const isEssentials = subscription?.planId === 'essentials';

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
        return [...filledRows, ...emptyRows.slice(0, 1), newInviteRow()];
      }
      // Collapse extra empty rows to at most one
      return [...filledRows, ...(emptyRows.length > 0 ? [emptyRows[0]] : [newInviteRow()])];
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

  const toggleName = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, showName: !r.showName } : r)));
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      if (next.length === 0) return [newInviteRow()];
      // Ensure at least one empty row at end
      const last = next[next.length - 1];
      if (last.email.trim()) return [...next, newInviteRow()];
      return next;
    });
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

        {/* Essentials warning */}
        {isEssentials && (
          <div className="mx-6 mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4 flex-shrink-0">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">Essentials plan: View-only invites only</p>
                <p className="text-xs text-amber-700 mt-1">
                  Your plan includes 1 seat (yours). All other users can only be invited as View-only at no charge. To add Admin, Customizer, Regular, or Field Crew users, upgrade to Build.
                </p>
                <button
                  onClick={() => { onClose(); onNavigate('subscription'); }}
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-900"
                >
                  Upgrade to Build <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rows */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_160px_32px_28px] gap-2 mb-2 px-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Email address</span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Role</span>
            <span />
            <span />
          </div>

          <div className="space-y-2">
            {rows.map((row, i) => {
              const consumedBefore = seatsConsumedBefore(rows, i);
              const seatsForSlot = isTrial ? Infinity : Math.max(0, seatsAvailable - consumedBefore);
              const isEmptyRow = !row.email.trim();

              return (
                <div key={row.id}>
                  <div className="grid grid-cols-[1fr_160px_32px_28px] gap-2 items-start">
                    {/* Email */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="email"
                        value={row.email}
                        onChange={(e) => handleEmailChange(row.id, e.target.value)}
                        placeholder={i === 0 ? 'colleague@company.com' : 'Add another...'}
                        className={`w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isEmptyRow ? 'bg-gray-50' : 'bg-white'}`}
                      />
                    </div>

                    {/* Role */}
                    <RoleSelect
                      value={row.role}
                      onChange={(role) => handleRoleChange(row.id, role)}
                      seatsAvailableForThisSlot={seatsForSlot}
                      isTrial={isTrial}
                      essentialsOnly={isEssentials}
                    />

                    {/* Name toggle */}
                    <button
                      type="button"
                      title="Set display name"
                      onClick={() => toggleName(row.id)}
                      className={`flex items-center justify-center w-8 h-[44px] rounded-lg border transition-colors ${
                        row.showName
                          ? 'border-blue-300 bg-blue-50 text-blue-600'
                          : 'border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <UserRound className="w-4 h-4" />
                    </button>

                    {/* Remove */}
                    {rows.length > 1 && !isEmptyRow ? (
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="flex items-center justify-center w-7 h-[44px] text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="w-7" />
                    )}
                  </div>

                  {/* Name field expansion */}
                  {row.showName && (
                    <div className="mt-1.5 pl-0 grid grid-cols-[1fr_160px_32px_28px] gap-2">
                      <div className="col-span-2 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 uppercase tracking-wide">Name</span>
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => handleNameChange(row.id, e.target.value)}
                          placeholder="Display name"
                          className="w-full border border-gray-200 rounded-lg pl-14 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Trial disclaimer */}
          {isTrial && (
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <span className="font-semibold">No user limits during your trial.</span>{' '}
                Once your trial ends, seat limits depend on your plan.{' '}
                <a
                  href="/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-semibold underline underline-offset-2 hover:text-blue-900"
                >
                  View pricing details <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          )}

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

function UserDetailWIP({ user, onBack }: { user: MockUser; onBack: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-6 text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to Users
        </button>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-14 h-14 rounded-full ${user.avatarColor} flex items-center justify-center text-white text-lg font-bold`}>
            {initials(user.name)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Clock className="w-7 h-7 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">User detail screen</h2>
          <p className="text-sm text-gray-400 max-w-xs">Coming in the next session — profile info, app access, permissions, and activity.</p>
          <span className="mt-4 inline-block text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-3 py-1">Work in progress</span>
        </div>
      </div>
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
}

export function UserManagementPage({
  subscription,
  teamSize,
  onNavigate,
  onBack,
  isTrial = false,
}: UserManagementPageProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Invited'>('All');
  const [filterRole, setFilterRole] = useState<'All' | UserRole>('All');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  const teamUsers = ALL_MOCK_USERS.slice(0, Math.min(teamSize, ALL_MOCK_USERS.length));
  const fullSeatsUsed = teamUsers.filter((u) => ROLE_SEAT_TYPE[u.role] === 'full').length;
  const fieldCrewCount = teamUsers.filter((u) => ROLE_SEAT_TYPE[u.role] === 'field-crew').length;

  const includedSeats = subscription ? (PLAN_SEATS[subscription.planId] ?? 1) : 999;
  const totalSeatsUsed = fullSeatsUsed + fieldCrewCount;
  const seatsAvailable = isTrial ? 999 : Math.max(0, includedSeats - totalSeatsUsed);
  const planName = subscription ? PLAN_NAMES[subscription.planId] : 'Trial';

  const basePrice = subscription
    ? subscription.billingCycle === 'annual'
      ? PLAN_PRICES_ANNUAL[subscription.planId] ?? 0
      : PLAN_PRICES_MONTHLY[subscription.planId] ?? 0
    : 0;

  const visibleUsers = teamUsers
    .filter((u) => {
      if (filterStatus === 'Active') return u.status === 'Active';
      if (filterStatus === 'Invited') return u.status === 'Invited';
      return true;
    })
    .filter((u) => filterRole === 'All' || u.role === filterRole)
    .filter((u) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });

  if (selectedUser) {
    return <UserDetailWIP user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-4 text-sm">
          <ChevronLeft className="w-4 h-4" /> Account Settings
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500">Manage your team members and their access</p>
          </div>
        </div>

        <SeatMeter
          subscription={subscription}
          includedSeats={includedSeats}
          fullSeatsUsed={fullSeatsUsed}
          fieldCrewCount={fieldCrewCount}
          planName={planName}
          basePrice={basePrice}
          onUpgrade={() => onNavigate('subscription')}
        />

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-6 mb-3">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-9"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active only</option>
              <option value="Invited">Invited only</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}
              className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-9"
            >
              <option value="All">All roles</option>
              <option value="Admin">Admin</option>
              <option value="Customizer">Customizer</option>
              <option value="Regular">Regular</option>
              <option value="Field Crew">Field Crew</option>
              <option value="View-only">View-only</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60 h-9"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors h-9 whitespace-nowrap">
            <Shield className="w-4 h-4" /> Enable 2FA
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center justify-center gap-1.5 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors h-9 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" /> Invite user
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-3 px-0.5">
          {visibleUsers.length} {visibleUsers.length === 1 ? 'user' : 'users'}
          {filterStatus !== 'All' ? ` · ${filterStatus}` : ''}
          {filterRole !== 'All' ? ` · ${filterRole}` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_2fr_40px] items-center gap-4 px-4 py-2.5 border-b border-gray-100 bg-gray-50/80">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">User</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</span>
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
                  openMenu={openMenu}
                  onOpenMenu={setOpenMenu}
                  onCloseMenu={() => setOpenMenu(null)}
                  onClick={() => setSelectedUser(user)}
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
    </div>
  );
}
