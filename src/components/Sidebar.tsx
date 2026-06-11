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
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

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
}

export function Sidebar({ currentPage, onNavigate, isMobileOpen = false, onMobileClose, locked = false, lockedApps = [], appStudioEnabled = true }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMoreAppsOpen, setIsMoreAppsOpen] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onMobileClose?.();
  };

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

        {/* App Marketplace — hidden when App Studio access is on (Studio replaces it) */}
        {!appStudioEnabled && (
          <div className="mt-8 pt-8 border-t border-blue-700">
            <Button
              variant="ghost"
              onClick={() => handleNavigate('marketplace')}
              className="w-full justify-start text-left p-3 h-auto text-blue-100 hover:bg-blue-700 hover:text-white"
            >
              <Store className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span className="ml-3">App Marketplace</span>}
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
    </>
  );
}