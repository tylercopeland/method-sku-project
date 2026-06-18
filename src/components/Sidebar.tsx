import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  Palette,
  UserPlus,
  Building2,
  FileText,
  Lightbulb,
  List,
  Receipt,
  ReceiptText,
  ClipboardList,
  CreditCard,
  Package,
  Briefcase,
  Mail,
  Megaphone,
  Heart,
  Wrench,
  Clock,
  Truck,
  Hammer,
  CalendarDays,
  Boxes,
  Gift,
  Folder,
  GraduationCap,
  ShoppingCart,
  ShoppingBag,
  Wallet,
  FileSignature,
  Lock,
  Layers,
  Store,
  ChevronLeft,
  ChevronUp,
  ChevronRight,
  Users,
  DollarSign,
  Calculator,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { useState, useRef } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  /** When locked (e.g. expired trial), navigation is disabled. */
  locked?: boolean;
  /** Page keys gated behind a higher plan — shown with a lock; still clickable (routes to upgrade). */
  lockedApps?: string[];
  /** When false, the App Studio link is hidden entirely (access turned off). */
  appStudioEnabled?: boolean;
  /** When true, show folder-based category navigation instead of flat list. */
  navFoldersEnabled?: boolean;
}

// --------------- Folder navigation data ---------------
const NAV_FOLDERS = [
  {
    key: 'contacts',
    label: 'Contacts & Comms',
    icon: Users,
    apps: [
      { page: 'customers', label: 'Customers & Leads', icon: UserPlus },
      { page: 'activities', label: 'Activities', icon: FileText },
      { page: 'send-email', label: 'Send Email', icon: Mail },
      { page: 'email-campaigns', label: 'Email Campaigns', icon: Megaphone },
    ],
  },
  {
    key: 'sales',
    label: 'Sales & Payments',
    icon: DollarSign,
    apps: [
      { page: 'opportunities', label: 'Opportunities', icon: Lightbulb },
      { page: 'web-to-lead', label: 'Web to Lead', icon: List },
      { page: 'estimates', label: 'Estimates', icon: ClipboardList },
      { page: 'invoices', label: 'Invoices', icon: Receipt },
      { page: 'payments', label: 'Payments', icon: CreditCard },
      { page: 'sales-receipts', label: 'Sales Receipts', icon: ReceiptText },
      { page: 'sales-orders', label: 'Sales Orders', icon: ShoppingCart },
      { page: 'proposals', label: 'Proposals', icon: FileSignature },
    ],
  },
  {
    key: 'expenses',
    label: 'Expenses & Purchasing',
    icon: ShoppingBag,
    apps: [
      { page: 'bills', label: 'Bills', icon: Wallet },
      { page: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingBag },
      { page: 'vendors', label: 'Vendors', icon: Building2 },
    ],
  },
  {
    key: 'accounting',
    label: 'Accounting',
    icon: Calculator,
    apps: [
      { page: 'accounts', label: 'Accounts', icon: Briefcase },
      { page: 'items', label: 'Items', icon: Package },
      { page: 'classes', label: 'Classes', icon: GraduationCap },
    ],
  },
  {
    key: 'operations',
    label: 'Operations',
    icon: Settings,
    apps: [
      { page: 'work-orders', label: 'Work Orders', icon: Wrench },
      { page: 'time-tracking', label: 'Time Tracking', icon: Clock },
      { page: 'field-crew', label: 'Field Crew', icon: Truck },
      { page: 'jobs', label: 'Jobs', icon: Hammer },
      { page: 'schedules', label: 'Schedules', icon: CalendarDays },
      { page: 'inventory', label: 'Inventory', icon: Boxes },
    ],
  },
  {
    key: 'donors',
    label: 'Donors',
    icon: Heart,
    apps: [
      { page: 'donations', label: 'Donations', icon: Gift },
      { page: 'donor-pages', label: 'Donor Pages', icon: Heart },
    ],
  },
  {
    key: 'support',
    label: 'Support',
    icon: MessageSquare,
    apps: [
      { page: 'cases', label: 'Cases', icon: Folder },
    ],
  },
];

export function Sidebar({ currentPage, onNavigate, isMobileOpen = false, onMobileClose, locked = false, lockedApps = [], appStudioEnabled = true, navFoldersEnabled = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMoreAppsOpen, setIsMoreAppsOpen] = useState(false);

  // Folder flyout state
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [flyoutStyle, setFlyoutStyle] = useState<React.CSSProperties>({});
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onMobileClose?.();
    setOpenFolder(null);
  };

  const handleFolderMouseEnter = (key: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const maxTop = window.innerHeight - 320;
    setFlyoutStyle({
      position: 'fixed',
      top: Math.min(rect.top, maxTop),
      left: rect.right + 4,
      zIndex: 9999,
      minWidth: 220,
    });
    setOpenFolder(key);
  };

  const handleFolderMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setOpenFolder(null), 80);
  };

  const handleFlyoutMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const handleFlyoutMouseLeave = () => {
    setOpenFolder(null);
  };

  const activeFolderKey = NAV_FOLDERS.find((f) =>
    f.apps.some((a) => a.page === currentPage)
  )?.key ?? null;

  const navigationItems = [
    { icon: LayoutGrid, label: 'Home', page: 'home' },
    { icon: Palette, label: 'App Studio', page: 'app-studio' },
    { icon: FileText, label: 'Activities', page: 'activities' },
    { icon: Receipt, label: 'Invoices', page: 'invoices' },
    { icon: ClipboardList, label: 'Estimates', page: 'estimates' },
    { icon: UserPlus, label: 'Customers & Leads', page: 'customers' },
    { icon: Building2, label: 'Vendors', page: 'vendors' },
    { icon: List, label: 'Web to Lead', page: 'web-to-lead' },
    { icon: Lightbulb, label: 'Opportunities', page: 'opportunities' },
    { icon: CreditCard, label: 'Payments', page: 'payments' },
    { icon: ReceiptText, label: 'Sales Receipts', page: 'sales-receipts' },
    { icon: Package, label: 'Items', page: 'items' },
    { icon: Briefcase, label: 'Accounts', page: 'accounts' },
    { icon: Mail, label: 'Send Email', page: 'send-email' },
    { icon: Megaphone, label: 'Email Campaigns', page: 'email-campaigns' },
    { icon: Heart, label: 'Donor Pages', page: 'donor-pages' },
    { icon: Wrench, label: 'Work Orders', page: 'work-orders' },
    { icon: Clock, label: 'Time Tracking', page: 'time-tracking' },
    { icon: Truck, label: 'Field Crew', page: 'field-crew' },
    { icon: Hammer, label: 'Jobs', page: 'jobs' },
    { icon: CalendarDays, label: 'Schedules', page: 'schedules' },
    { icon: Boxes, label: 'Inventory', page: 'inventory' },
    { icon: Gift, label: 'Donations', page: 'donations' },
    { icon: Folder, label: 'Cases', page: 'cases' },
    { icon: GraduationCap, label: 'Classes', page: 'classes' },
    { icon: ShoppingCart, label: 'Sales Orders', page: 'sales-orders' },
    { icon: ShoppingBag, label: 'Purchase Orders', page: 'purchase-orders' },
    { icon: Wallet, label: 'Bills', page: 'bills' },
    { icon: FileSignature, label: 'Proposals', page: 'proposals' },
  ];

  // Home + App Studio stay pinned at the top; core apps are always visible;
  // the rest sit behind a "View more" toggle. App Studio drops out when access is off.
  const pinnedItems = navigationItems
    .slice(0, 2)
    .filter((item) => item.page !== 'app-studio' || appStudioEnabled);
  const primaryItems = navigationItems.slice(2, 12);
  const moreItems = navigationItems.slice(12);
  // Keep the section expanded if the active page lives inside it.
  const activeInMore = moreItems.some((item) => item.page === currentPage);

  const renderNavItem = (item: (typeof navigationItems)[number], index: number) => (
    <Button
      key={index}
      variant="ghost"
      onClick={() => handleNavigate(item.page)}
      className={`w-full justify-start text-left p-3 h-auto ${
        currentPage === item.page
          ? 'bg-blue-700 text-white'
          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
      }`}
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />
      {(!isCollapsed || isMobileOpen) && <span className="ml-3">{item.label}</span>}
      {lockedApps.includes(item.page) && (!isCollapsed || isMobileOpen) && (
        <Lock className="w-3.5 h-3.5 ml-auto text-blue-300" />
      )}
    </Button>
  );

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <div className={`
        bg-[#1e3a8a] text-white transition-all duration-300 flex flex-col flex-shrink-0
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        fixed lg:relative inset-y-0 left-0 z-50
        w-64
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Header */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg">method</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isMobileOpen ? onMobileClose?.() : setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-blue-700 p-1 hidden lg:flex"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Pinned at top — does not scroll */}
      <div className={`flex-shrink-0 px-4 pt-4 pb-2 space-y-2 ${locked ? 'pointer-events-none opacity-50' : ''}`}>
        {pinnedItems.map(renderNavItem)}
      </div>

      {/* Navigation (scrollable) */}
      <nav className={`flex-1 px-4 pb-4 overflow-y-auto ${locked ? 'pointer-events-none opacity-50' : ''}`}>

        {navFoldersEnabled ? (
          // --------------- Folder-based navigation ---------------
          <div className="space-y-1">
            {NAV_FOLDERS.map((folder) => {
              const isActive = activeFolderKey === folder.key;
              const isOpen = openFolder === folder.key;
              return (
                <button
                  key={folder.key}
                  type="button"
                  onMouseEnter={(e) => handleFolderMouseEnter(folder.key, e)}
                  onMouseLeave={handleFolderMouseLeave}
                  className={`w-full flex items-center text-left p-3 rounded-md transition-colors ${
                    isActive || isOpen
                      ? 'bg-blue-700 text-white hover:bg-blue-700 cursor-default'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <folder.icon className="w-5 h-5 flex-shrink-0" />
                  {(!isCollapsed || isMobileOpen) && (
                    <>
                      <span className="ml-3 flex-1 text-sm">{folder.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-60 flex-shrink-0" />
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          // --------------- Flat navigation (default) ---------------
          <>
            <div className="space-y-2">
              {primaryItems.map(renderNavItem)}
            </div>

            {/* Overflow apps revealed by "View more" */}
            {(isMoreAppsOpen || activeInMore) && (
              <div className="space-y-2 mt-2">
                {moreItems.map(renderNavItem)}
              </div>
            )}

            {/* View more / less toggle */}
            <div className="mt-2">
              <Button
                variant="ghost"
                onClick={() => setIsMoreAppsOpen(!isMoreAppsOpen)}
                className={`w-full ${isCollapsed && !isMobileOpen ? 'justify-center' : 'justify-start'} text-left p-3 h-auto text-blue-100 hover:bg-blue-700 hover:text-white`}
              >
                {isMoreAppsOpen || activeInMore ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Layers className="w-5 h-5 flex-shrink-0" />
                )}
                {(!isCollapsed || isMobileOpen) && (
                  <span className="ml-3">{isMoreAppsOpen || activeInMore ? 'View less' : 'View more'}</span>
                )}
              </Button>
            </div>
          </>
        )}

        {/* App Launchpad — hidden when App Studio access is on (Studio replaces it) */}
        {!appStudioEnabled && (
          <div className="mt-8 pt-8 border-t border-blue-700">
            <Button
              variant="ghost"
              onClick={() => handleNavigate('marketplace')}
              className="w-full justify-start text-left p-3 h-auto text-blue-100 hover:bg-blue-700 hover:text-white"
            >
              <Store className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span className="ml-3">App Launchpad</span>}
            </Button>
          </div>
        )}
      </nav>

      {/* Collapse indicator - desktop only */}
      {isCollapsed && !isMobileOpen && (
        <div className="p-2 text-center hidden lg:block">
          <span className="text-xs text-blue-300">collapse</span>
        </div>
      )}
    </div>

    {/* Folder flyout panel — rendered outside sidebar to avoid overflow clipping */}
    {navFoldersEnabled && openFolder && (() => {
      const folder = NAV_FOLDERS.find((f) => f.key === openFolder);
      if (!folder) return null;
      return (
        <div
          style={flyoutStyle}
          className="bg-white rounded-xl border border-gray-200 shadow-xl py-2 overflow-hidden"
          onMouseEnter={handleFlyoutMouseEnter}
          onMouseLeave={handleFlyoutMouseLeave}
        >
          <p className="px-4 pb-2 pt-0.5 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 mb-1">
            {folder.label}
          </p>
          {folder.apps.map((app) => {
            const isLocked = lockedApps.includes(app.page);
            const isActive = currentPage === app.page;

            if (isLocked) {
              return (
                <button
                  key={app.page}
                  type="button"
                  onClick={() => handleNavigate(app.page)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors group"
                >
                  <app.icon className="w-4 h-4 flex-shrink-0 text-gray-300" />
                  <span className="flex-1 text-gray-400">{app.label}</span>
                  <span className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                    Preview
                  </span>
                  <Lock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                </button>
              );
            }

            return (
              <button
                key={app.page}
                type="button"
                onClick={() => handleNavigate(app.page)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <app.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="flex-1">{app.label}</span>
              </button>
            );
          })}
        </div>
      );
    })()}
    </>
  );
}
