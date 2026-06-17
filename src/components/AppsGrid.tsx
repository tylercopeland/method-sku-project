import {
  FileText,
  Receipt,
  ClipboardList,
  UserPlus,
  Building2,
  List,
  Lightbulb,
  CreditCard,
  ReceiptText,
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
  Plus,
  MoreVertical,
  Lock,
  Calendar,
  Settings,
  ArrowRight,
} from 'lucide-react';

type Icon = React.ComponentType<{ className?: string }>;

export interface AppTile {
  name: string;
  description?: string;
  icon: Icon;
  accent: string; // top accent bar color
  action?: { label: string; icon?: Icon };
  stat?: string;
  lockKey?: string; // page key used to gate the tile behind a higher plan
}

// Canonical installed-app list — mirrors the sidebar order. Shared with the App
// Marketplace so "Your apps" stays in sync. Counts reflect a brand-new trial account.
export const appTiles: AppTile[] = [
  { name: 'Activities', description: 'Assign follow-ups, history and reminders so nothing is missed.', icon: FileText, accent: 'bg-blue-500', action: { label: 'New' }, stat: '0 DUE NOW' },
  { name: 'Invoices', description: 'Create, edit and send invoices.', icon: Receipt, accent: 'bg-green-500', action: { label: 'New' }, stat: '0 OVERDUE' },
  { name: 'Estimates', description: 'Create, edit and send estimates and quotes.', icon: ClipboardList, accent: 'bg-indigo-500', action: { label: 'New' }, stat: '0 ACTIVE' },
  { name: 'Customers & Leads', description: 'Organize customers, leads and the work that flows between them.', icon: UserPlus, accent: 'bg-red-500', action: { label: 'New' }, stat: '0 ACTIVE' },

  { name: 'Vendors', description: 'Keep track of your suppliers, contractors and vendors in one place.', icon: Building2, accent: 'bg-green-500', action: { label: 'New' }, stat: '0 ACTIVE' },
  { name: 'Web to Lead', description: 'Web to Lead forms capture information directly from your website and automatically create a contact and a sales lead.', icon: List, accent: 'bg-orange-500', action: { label: 'New' }, stat: '0 RESPONSES' },
  { name: 'Opportunities', description: 'Manage potential business to maximize sales.', icon: Lightbulb, accent: 'bg-red-500', action: { label: 'New' }, stat: '0 PIPELINE' },
  { name: 'Payments', description: 'Record customer payments.', icon: CreditCard, accent: 'bg-red-500', action: { label: 'New' }, stat: '0 TODAY' },

  { name: 'Sales Receipts', description: 'Create, edit and send sales receipts.', icon: ReceiptText, accent: 'bg-blue-500', action: { label: 'New' }, stat: '0 TODAY' },
  { name: 'Items', description: 'The products and services you buy or sell.', icon: Package, accent: 'bg-blue-500', action: { label: 'New' }, stat: '0 ACTIVE' },
  { name: 'Accounts', description: 'Keep track of and assign different QuickBooks transactions based on assets, liabilities, income or expenses.', icon: Briefcase, accent: 'bg-green-500', action: { label: 'New' }, stat: '0 ACTIVE' },
  { name: 'Send Email', description: 'Send Email with standard or personalized templates.', icon: Mail, accent: 'bg-cyan-500', action: { label: 'Send Email', icon: Mail }, stat: 'EDIT TEMPLATE' },

  { name: 'Email Campaigns', description: 'Quickly create and send bulk emails to your customers and leads using email templates that you create.', icon: Megaphone, accent: 'bg-cyan-500', action: { label: 'New' }, stat: '0 ONGOING' },
  { name: 'Donor Pages', description: 'Accept online donations, which automatically create a record, sync with QuickBooks, and send a thank you message and tax receipt.', icon: Heart, accent: 'bg-purple-500', action: { label: 'Setup', icon: Settings }, stat: 'TEST DRIVE' },
  { name: 'Work Orders', description: 'Create, schedule, edit and manage field services work.', icon: Wrench, accent: 'bg-blue-500', action: { label: 'New' }, stat: '0 TODAY', lockKey: 'work-orders' },
  { name: 'Time Tracking', description: 'Create, edit and manage time tracking entries by customer, employees and services.', icon: Clock, accent: 'bg-blue-500', action: { label: 'New' }, stat: '0 UNAPPROVED', lockKey: 'time-tracking' },

  { name: 'Field Crew', description: 'View and track time against scheduled work orders.', icon: Truck, accent: 'bg-blue-500', action: { label: 'Calendar', icon: Calendar }, stat: '0 TODAY', lockKey: 'field-crew' },
  { name: 'Jobs', description: 'Plan, track, and manage every job from start to finish — all in one place.', icon: Hammer, accent: 'bg-orange-500', action: { label: 'New' }, stat: '0 ACTIVE', lockKey: 'jobs' },
  { name: 'Schedules', description: 'Plan and dispatch your team with a shared, drag-and-drop schedule.', icon: CalendarDays, accent: 'bg-purple-500', action: { label: 'New' }, stat: '0 TODAY', lockKey: 'schedules' },
  { name: 'Inventory', description: 'Track stock levels, costs, and reorder points across every location.', icon: Boxes, accent: 'bg-green-500', action: { label: 'New' }, stat: '0 ITEMS', lockKey: 'inventory' },

  { name: 'Donations', description: 'Simplify the way you accept and track donations, send thank yous and receipts, and stay on top of follow-ups.', icon: Gift, accent: 'bg-rose-500', action: { label: 'New' }, stat: '0 ALL' },
  { name: 'Cases', description: 'Deliver outstanding customer service. Create and track tickets so your team can share information and solve issues.', icon: Folder, accent: 'bg-orange-500', action: { label: 'New' }, stat: '0 OPEN' },
  { name: 'Classes', description: 'Track and assign to QuickBooks transactions.', icon: GraduationCap, accent: 'bg-yellow-400', action: { label: 'New' }, stat: '0 ACTIVE' },
  { name: 'Sales Orders', description: 'Create, edit and send sales orders.', icon: ShoppingCart, accent: 'bg-blue-500', action: { label: 'New' }, stat: '0 OPEN' },

  { name: 'Purchase Orders', description: 'Create, edit and manage purchase orders.', icon: ShoppingBag, accent: 'bg-blue-500', action: { label: 'New' }, stat: '0 OPEN' },
  { name: 'Bills', description: 'Create, edit and manage bills.', icon: Wallet, accent: 'bg-blue-500', action: { label: 'New' }, stat: '0 OPEN' },
  { name: 'Proposals', description: 'Streamline and automate your quote-to-cash process. Create and send proposals and have your customers accept them and pay.', icon: FileSignature, accent: 'bg-blue-500', action: { label: 'New' }, stat: '0 ACTIVE' },
];

interface AppsGridProps {
  lockedApps?: string[];
  /** Open a locked app's value screen (empty-state preview of the app). */
  onOpenApp?: (lockKey: string) => void;
  /** Jump straight to the subscription/upgrade flow. */
  onUpgrade?: () => void;
  /** With App Studio on, apps are managed there — hide the inline Add/Remove tile. */
  appStudioEnabled?: boolean;
}

export function AppsGrid({ lockedApps = [], onOpenApp, onUpgrade, appStudioEnabled = false }: AppsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {appTiles.map((tile) => {
        const Icon = tile.icon;
        const locked = !!tile.lockKey && lockedApps.includes(tile.lockKey);
        const hasFooter = Boolean(tile.action || tile.stat);

        return (
          <div
            key={tile.name}
            onClick={locked && tile.lockKey ? () => onOpenApp?.(tile.lockKey!) : undefined}
            className={`flex flex-col h-56 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${
              locked ? 'cursor-pointer hover:ring-2 hover:ring-blue-200' : ''
            }`}
          >
            {/* Accent bar */}
            <div className={`h-1 ${locked ? 'bg-gray-300' : tile.accent}`} />

            <div className="flex-1 flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold ${locked ? 'text-gray-500' : 'text-gray-900'}`}>
                  {tile.name}
                </h3>
                {locked ? (
                  <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <MoreVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </div>

              <div className={`flex gap-3 mt-3 flex-1 ${locked ? 'opacity-60' : ''}`}>
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-400" />
                </div>
                {tile.description && (
                  <p className="text-sm text-gray-500 leading-snug line-clamp-4">{tile.description}</p>
                )}
              </div>

              {/* Footer */}
              {locked ? (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpgrade?.();
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Upgrade to unlock
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                hasFooter && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    {tile.action ? (
                      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                        {tile.action.icon ? (
                          <tile.action.icon className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        {tile.action.label}
                      </button>
                    ) : (
                      <span />
                    )}
                    {tile.stat && (
                      <span className="text-xs font-medium text-gray-500 tracking-wide">{tile.stat}</span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}

      {/* Add / Remove Apps — hidden when App Studio manages apps */}
      {!appStudioEnabled && (
        <button className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-blue-600 font-semibold text-sm hover:bg-gray-50 h-56">
          Add / Remove Apps
        </button>
      )}
    </div>
  );
}
