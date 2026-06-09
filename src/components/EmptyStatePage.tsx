import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Users,
  Lightbulb,
  List,
  Receipt,
  Lock,
  Store,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  X,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
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
  FileSignature
} from 'lucide-react';
import { useState } from 'react';

interface EmptyStatePageProps {
  page: string;
  showBanner?: boolean;
  showSampleData?: boolean;
}

interface EmptyStateConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  valueProps: string[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  // Drives the right-hand illustration for pages without a hardcoded illustration.
  accentIcon?: React.ComponentType<{ className?: string }>;
  gradient?: string;
}

export function EmptyStatePage({ page, showBanner = false, showSampleData = false }: EmptyStatePageProps) {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const getEmptyStateConfig = (): EmptyStateConfig => {
    switch (page) {
      case 'activities':
        return {
          icon: <FileText className="w-6 h-6 text-blue-600" />,
          title: 'Track Every Customer Interaction',
          description: 'Activities helps you maintain a complete history of all customer communications, meetings, and follow-ups in one centralized place.',
          valueProps: [
            'Log calls, emails, meetings, and notes automatically',
            'Set follow-up reminders to never miss an opportunity',
            'View complete interaction history for each customer',
            'Sync activities across your team for better collaboration'
          ],
          primaryAction: {
            label: 'Log Your First Activity',
            onClick: () => console.log('Log activity')
          },
          secondaryAction: {
            label: 'Learn More',
            onClick: () => console.log('Learn more')
          }
        };

      case 'vendors':
        return {
          icon: <Users className="w-6 h-6 text-green-600" />,
          title: 'Manage Your Vendor Relationships',
          description: 'Keep track of all your suppliers, contractors, and vendors in one organized system. Build stronger relationships and streamline procurement.',
          valueProps: [
            'Store vendor contact information and details',
            'Track purchase history and spending patterns',
            'Manage vendor contracts and agreements',
            'Streamline procurement and ordering processes'
          ],
          primaryAction: {
            label: 'Add Your First Vendor',
            onClick: () => console.log('Add vendor')
          },
          secondaryAction: {
            label: 'Import Vendors',
            onClick: () => console.log('Import vendors')
          }
        };

      case 'opportunities':
        return {
          icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
          title: 'Turn Leads Into Revenue',
          description: 'Opportunities helps you track potential deals from initial contact through to close. Never lose a sale due to poor follow-up.',
          valueProps: [
            'Track deal stages and probability of closing',
            'Set revenue targets and forecast accurately',
            'Identify your best sales opportunities',
            'Automate follow-ups to keep deals moving forward'
          ],
          primaryAction: {
            label: 'Create Your First Opportunity',
            onClick: () => console.log('Create opportunity')
          },
          secondaryAction: {
            label: 'View Sales Pipeline',
            onClick: () => console.log('View pipeline')
          }
        };

      case 'web-to-lead':
        return {
          icon: <List className="w-6 h-6 text-purple-600" />,
          title: 'Capture Leads Automatically',
          description: 'Web to Lead automatically captures leads from your website forms and adds them directly to Method. No manual data entry required.',
          valueProps: [
            'Capture leads 24/7 from your website forms',
            'Automatically create customer records',
            'Get instant notifications for new leads',
            'Route leads to the right team members automatically'
          ],
          primaryAction: {
            label: 'Set Up Web Forms',
            onClick: () => console.log('Setup forms')
          },
          secondaryAction: {
            label: 'View Integration Guide',
            onClick: () => console.log('View guide')
          }
        };

      case 'invoices':
        return {
          icon: <Receipt className="w-6 h-6 text-indigo-600" />,
          title: 'Get Paid Faster with Professional Invoices',
          description: 'Create, send, and track invoices effortlessly. Accept online payments and get paid 2x faster with automated reminders.',
          valueProps: [
            'Create professional invoices in seconds',
            'Accept online payments directly through invoices',
            'Send automatic payment reminders',
            'Track invoice status and payment history'
          ],
          primaryAction: {
            label: 'Create Your First Invoice',
            onClick: () => console.log('Create invoice')
          },
          secondaryAction: {
            label: 'Learn About Online Payments',
            onClick: () => console.log('Learn payments')
          }
        };

      case 'sales-receipts':
        return {
          icon: <List className="w-6 h-6 text-teal-600" />,
          title: 'Record Sales Instantly',
          description: 'Sales Receipts lets you record completed sales transactions immediately. Perfect for point-of-sale and same-day transactions.',
          valueProps: [
            'Record sales transactions on the spot',
            'Generate receipts for customers instantly',
            'Track cash and card payments',
            'Sync with your accounting automatically'
          ],
          primaryAction: {
            label: 'Create Sales Receipt',
            onClick: () => console.log('Create receipt')
          },
          secondaryAction: {
            label: 'View Receipt History',
            onClick: () => console.log('View history')
          }
        };

      case 'payments':
        return {
          icon: <Lock className="w-6 h-6 text-emerald-600" />,
          title: 'Streamline Payment Processing',
          description: 'Payments helps you track, process, and reconcile customer payments efficiently. Reduce late payments and improve cash flow.',
          valueProps: [
            'Track all customer payments in one place',
            'Process online and offline payments',
            'Automatically match payments to invoices',
            'Generate payment reports and insights'
          ],
          primaryAction: {
            label: 'Record Payment',
            onClick: () => console.log('Record payment')
          },
          secondaryAction: {
            label: 'Set Up Payment Processing',
            onClick: () => console.log('Setup processing')
          }
        };

      case 'marketplace':
        return {
          icon: <Store className="w-6 h-6 text-orange-600" />,
          title: 'Extend Method with Powerful Apps',
          description: 'Discover apps that integrate seamlessly with Method to add new capabilities and streamline your workflow.',
          valueProps: [
            'Connect with popular business tools',
            'Automate workflows between apps',
            'Add specialized features for your industry',
            'All apps sync automatically with Method'
          ],
          primaryAction: {
            label: 'Browse Apps',
            onClick: () => console.log('Browse apps')
          },
          secondaryAction: {
            label: 'View Popular Integrations',
            onClick: () => console.log('View integrations')
          }
        };

      case 'items':
        return {
          icon: <Package className="w-6 h-6 text-amber-600" />,
          accentIcon: Package,
          gradient: 'from-amber-500 to-amber-600',
          title: 'Build Your Product & Service Catalog',
          description: 'Items keeps every product and service you sell in one place, with pricing, descriptions, and QuickBooks sync.',
          valueProps: [
            'Store products and services with pricing',
            'Sync items two-way with QuickBooks',
            'Add items to estimates and invoices fast',
            'Track what sells best',
          ],
          primaryAction: { label: 'Add Your First Item', onClick: () => {} },
          secondaryAction: { label: 'Import from QuickBooks', onClick: () => {} },
        };

      case 'accounts':
        return {
          icon: <Briefcase className="w-6 h-6 text-slate-600" />,
          accentIcon: Briefcase,
          gradient: 'from-slate-500 to-slate-600',
          title: 'Organize Your Accounts',
          description: 'Accounts gives you a clear view of every company you work with — customers, vendors, and partners.',
          valueProps: [
            'Group contacts under their company',
            'See every interaction in one place',
            'Track relationships and activity',
            'Keep your book of business organized',
          ],
          primaryAction: { label: 'Create Your First Account', onClick: () => {} },
          secondaryAction: { label: 'Import Accounts', onClick: () => {} },
        };

      case 'send-email':
        return {
          icon: <Mail className="w-6 h-6 text-blue-600" />,
          accentIcon: Mail,
          gradient: 'from-blue-500 to-blue-600',
          title: 'Send Email Without Leaving Method',
          description: 'Send personalized emails to customers and leads, with every message logged against their record.',
          valueProps: [
            'Email directly from any record',
            'Use templates to save time',
            'Track opens and replies',
            'Keep a full communication history',
          ],
          primaryAction: { label: 'Send Your First Email', onClick: () => {} },
          secondaryAction: { label: 'Connect Your Inbox', onClick: () => {} },
        };

      case 'email-campaigns':
        return {
          icon: <Megaphone className="w-6 h-6 text-pink-600" />,
          accentIcon: Megaphone,
          gradient: 'from-pink-500 to-pink-600',
          title: 'Reach Your Whole List at Once',
          description: 'Email Campaigns lets you design, send, and measure marketing emails to segmented lists.',
          valueProps: [
            'Build campaigns with a drag-and-drop editor',
            'Target segments of your customer list',
            'Schedule sends in advance',
            'Track opens, clicks, and conversions',
          ],
          primaryAction: { label: 'Create a Campaign', onClick: () => {} },
          secondaryAction: { label: 'Browse Templates', onClick: () => {} },
        };

      case 'donor-pages':
        return {
          icon: <Heart className="w-6 h-6 text-rose-600" />,
          accentIcon: Heart,
          gradient: 'from-rose-500 to-rose-600',
          title: 'Collect Donations Online',
          description: 'Donor Pages give your supporters a simple, branded page to give — with every gift recorded in Method.',
          valueProps: [
            'Create branded donation pages',
            'Accept one-time and recurring gifts',
            'Record donors and donations automatically',
            'Send receipts and thank-yous',
          ],
          primaryAction: { label: 'Create a Donor Page', onClick: () => {} },
          secondaryAction: { label: 'See an Example', onClick: () => {} },
        };

      case 'work-orders':
        return {
          icon: <Wrench className="w-6 h-6 text-blue-600" />,
          accentIcon: Wrench,
          gradient: 'from-blue-500 to-blue-600',
          title: 'Streamline Your Work Orders',
          description: 'Create, assign, and track every job from request through completion — all in one place.',
          valueProps: [
            'Assign work to the right crew member',
            'Track status from open to done',
            'Attach photos, notes, and customer details',
            'Convert completed work into invoices',
          ],
          primaryAction: { label: 'Create a Work Order', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'time-tracking':
        return {
          icon: <Clock className="w-6 h-6 text-indigo-600" />,
          accentIcon: Clock,
          gradient: 'from-indigo-500 to-indigo-600',
          title: 'Track Time, Bill Accurately',
          description: 'Capture billable hours so payroll and invoices are always accurate.',
          valueProps: [
            'Log time against jobs and customers',
            'Approve and export timesheets',
            'Turn hours into invoices automatically',
            "See where your team's time goes",
          ],
          primaryAction: { label: 'Track Your First Hours', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'field-crew':
        return {
          icon: <Truck className="w-6 h-6 text-teal-600" />,
          accentIcon: Truck,
          gradient: 'from-teal-500 to-teal-600',
          title: 'Empower Your Field Crew',
          description: 'Give your team a mobile app to see their jobs, capture details, and update status from anywhere.',
          valueProps: [
            "Mobile access to today's jobs",
            'Capture signatures, photos, and notes',
            'Update job status in real time',
            'Keep the office and field in sync',
          ],
          primaryAction: { label: 'Invite Your Crew', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'jobs':
        return {
          icon: <Hammer className="w-6 h-6 text-orange-600" />,
          accentIcon: Hammer,
          gradient: 'from-orange-500 to-orange-600',
          title: 'Manage Every Job End-to-End',
          description: 'Run multi-stage projects with tasks, costs, and timelines in one view.',
          valueProps: [
            'Break jobs into trackable tasks',
            'Monitor costs and profitability',
            'Keep timelines on schedule',
            'See job progress at a glance',
          ],
          primaryAction: { label: 'Create Your First Job', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'schedules':
        return {
          icon: <CalendarDays className="w-6 h-6 text-purple-600" />,
          accentIcon: CalendarDays,
          gradient: 'from-purple-500 to-purple-600',
          title: 'Plan and Dispatch with Ease',
          description: 'Coordinate your team with a shared, drag-and-drop schedule.',
          valueProps: [
            "Visualize your team's week",
            'Dispatch the right person, fast',
            'Avoid double-booking',
            'Keep everyone on the same page',
          ],
          primaryAction: { label: 'Open the Scheduler', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'inventory':
        return {
          icon: <Boxes className="w-6 h-6 text-green-600" />,
          accentIcon: Boxes,
          gradient: 'from-green-500 to-green-600',
          title: 'Know Your Inventory',
          description: 'Track stock levels, costs, and reorder points across every location.',
          valueProps: [
            'Track quantities in real time',
            'Set reorder points and alerts',
            'Manage costs and margins',
            'Sync items with QuickBooks',
          ],
          primaryAction: { label: 'Add Inventory', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'donations':
        return {
          icon: <Gift className="w-6 h-6 text-rose-600" />,
          accentIcon: Gift,
          gradient: 'from-rose-500 to-rose-600',
          title: 'Track Every Donation',
          description: 'Record gifts, manage donors, and keep a complete giving history for your organization.',
          valueProps: [
            'Log one-time and recurring gifts',
            'Link donations to donor records',
            'Issue receipts automatically',
            'Report on giving over time',
          ],
          primaryAction: { label: 'Record a Donation', onClick: () => {} },
          secondaryAction: { label: 'Import Donations', onClick: () => {} },
        };

      case 'cases':
        return {
          icon: <Folder className="w-6 h-6 text-cyan-600" />,
          accentIcon: Folder,
          gradient: 'from-cyan-500 to-cyan-600',
          title: 'Resolve Customer Issues Faster',
          description: 'Cases helps you capture, assign, and resolve customer requests so nothing falls through the cracks.',
          valueProps: [
            'Capture issues from any channel',
            'Assign and prioritize cases',
            'Track status to resolution',
            'See the full history per customer',
          ],
          primaryAction: { label: 'Open Your First Case', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'classes':
        return {
          icon: <GraduationCap className="w-6 h-6 text-violet-600" />,
          accentIcon: GraduationCap,
          gradient: 'from-violet-500 to-violet-600',
          title: 'Organize Work with Classes',
          description: 'Classes let you categorize transactions and records by department, location, or program.',
          valueProps: [
            'Segment records by class',
            'Report on performance by class',
            'Keep books aligned with QuickBooks',
            'Stay organized as you grow',
          ],
          primaryAction: { label: 'Create a Class', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'sales-orders':
        return {
          icon: <ShoppingCart className="w-6 h-6 text-emerald-600" />,
          accentIcon: ShoppingCart,
          gradient: 'from-emerald-500 to-emerald-600',
          title: 'Manage Orders from Quote to Fulfillment',
          description: "Sales Orders track what customers have ordered, what's fulfilled, and what's left to invoice.",
          valueProps: [
            'Convert estimates into orders',
            'Track fulfillment status',
            'Turn orders into invoices',
            'Keep inventory in sync',
          ],
          primaryAction: { label: 'Create a Sales Order', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'purchase-orders':
        return {
          icon: <ShoppingBag className="w-6 h-6 text-amber-600" />,
          accentIcon: ShoppingBag,
          gradient: 'from-amber-500 to-amber-600',
          title: 'Streamline Your Purchasing',
          description: "Purchase Orders help you order from vendors, track what's received, and control spend.",
          valueProps: [
            'Create and send POs to vendors',
            'Track received vs. outstanding items',
            'Control costs and approvals',
            'Sync purchases with QuickBooks',
          ],
          primaryAction: { label: 'Create a Purchase Order', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'bills':
        return {
          icon: <Wallet className="w-6 h-6 text-red-600" />,
          accentIcon: Wallet,
          gradient: 'from-red-500 to-red-600',
          title: 'Stay on Top of What You Owe',
          description: 'Bills keeps your payables organized so you never miss a due date.',
          valueProps: [
            'Record bills from vendors',
            'Track due dates and balances',
            'Schedule and apply payments',
            'Sync with QuickBooks',
          ],
          primaryAction: { label: 'Add Your First Bill', onClick: () => {} },
          secondaryAction: { label: 'Learn More', onClick: () => {} },
        };

      case 'proposals':
        return {
          icon: <FileSignature className="w-6 h-6 text-sky-600" />,
          accentIcon: FileSignature,
          gradient: 'from-sky-500 to-sky-600',
          title: 'Win More Work with Polished Proposals',
          description: 'Proposals helps you create, send, and track professional proposals that close deals.',
          valueProps: [
            'Build proposals from templates',
            'Send and track engagement',
            'Convert accepted proposals to estimates',
            'Get e-signature approval',
          ],
          primaryAction: { label: 'Create a Proposal', onClick: () => {} },
          secondaryAction: { label: 'Browse Templates', onClick: () => {} },
        };

      default:
        return {
          icon: <Sparkles className="w-6 h-6 text-gray-400" />,
          accentIcon: Sparkles,
          gradient: 'from-gray-400 to-gray-500',
          title: 'Page not found',
          description: "We couldn't find the page you're looking for. Try selecting an app from the sidebar.",
          valueProps: []
        };
    }
  };

  const getSampleData = () => {
    switch (page) {
      case 'activities':
        return {
          headers: ['Type', 'Subject', 'Customer', 'Date', 'Status'],
          rows: [
            { type: 'Follow-up', subject: '[Sample] Follow-up with a lead', customer: 'New Lead', date: 'Today at 05:00pm', status: 'Not started' },
            { type: 'Meeting', subject: '[Sample] Meet with a customer', customer: 'Customer', date: 'Tomorrow at 05:00pm', status: 'Not started' },
            { type: 'Email', subject: '[Sample] Send a follow-up email', customer: 'Customer/Lead', date: 'Dec-13-2025 05:00 PM', status: 'Not started' }
          ],
          addButtonLabel: 'Log Activity'
        };
      case 'vendors':
        return {
          headers: ['Name', 'Company', 'Contact', 'Location', 'Status'],
          rows: [
            { name: '[Sample] John Smith', company: 'Supply Co', contact: 'john@supplyco.com', location: 'New York, NY', status: 'Active' },
            { name: '[Sample] Sarah Johnson', company: 'Materials Inc', contact: 'sarah@materials.com', location: 'Los Angeles, CA', status: 'Active' }
          ],
          addButtonLabel: 'Add Vendor'
        };
      case 'invoices':
        return {
          headers: ['Invoice #', 'Customer', 'Amount', 'Status', 'Date', 'Due Date'],
          rows: [
            { number: 'INV-1001', customer: 'Acme Corporation', amount: '$5,247.50', status: 'Paid', date: 'Dec 15, 2024', dueDate: 'Jan 14, 2025' },
            { number: 'INV-1002', customer: 'Tech Solutions LLC', amount: '$3,890.00', status: 'Sent', date: 'Dec 22, 2024', dueDate: 'Jan 21, 2025' },
            { number: 'INV-1003', customer: 'Global Industries', amount: '$7,125.75', status: 'Paid', date: 'Dec 28, 2024', dueDate: 'Jan 27, 2025' },
            { number: 'INV-1004', customer: 'Metro Services', amount: '$2,450.00', status: 'Overdue', date: 'Nov 30, 2024', dueDate: 'Dec 30, 2024' },
            { number: 'INV-1005', customer: 'Sunrise Consulting', amount: '$4,680.25', status: 'Sent', date: 'Jan 5, 2025', dueDate: 'Feb 4, 2025' }
          ],
          addButtonLabel: 'Create Invoice'
        };
      default:
        return null;
    }
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'Active' || status === 'Paid') {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
          {status}
        </Badge>
      );
    }
    if (status === 'Sent' || status === 'Not started') {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
          {status}
        </Badge>
      );
    }
    if (status === 'Overdue') {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
          {status}
        </Badge>
      );
    }
    return <span>{status}</span>;
  };

  const config = getEmptyStateConfig();
  const AccentIcon = config.accentIcon ?? Sparkles;
  const sampleData = showSampleData ? getSampleData() : null;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Value Proposition Banner */}
        {showBanner && !bannerDismissed && config.valueProps.length > 0 && (
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 animate-in slide-in-from-top duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-sm w-fit mb-3">
                      {config.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{config.title}</h3>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {config.valueProps.map((prop, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{prop}</p>
                      </div>
                    ))}
                  </div>

                  {sampleData && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-xs text-gray-600 font-medium">
                        {page === 'invoices' ? (
                          <>The invoices below are synced from your QuickBooks account to show you how Method integrates with your existing data.</>
                        ) : (
                          <>The content below is sample data to show you what {page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')} looks like with real information.</>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBannerDismissed(true)}
                  className="ml-4 h-8 w-8 p-0 hover:bg-blue-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sample Data Table */}
        {showSampleData && sampleData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')}
                </CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  {sampleData.addButtonLabel}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {sampleData.headers.map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className="hover:bg-gray-50">
                      {Object.values(row).map((value, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {sampleData.headers[cellIndex] === 'Status'
                            ? renderStatusBadge(value as string)
                            : value}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State Card - Only show if no sample data */}
        {!showSampleData && (
          <Card className="border-gray-200 shadow-xl bg-white w-full">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[500px]">
                <div className="flex-1">
                  <div className="mb-6">
                    <div className="flex mb-4">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        {config.icon}
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">{config.title}</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mb-6">
                      {config.description}
                    </p>
                  </div>

                  {config.valueProps.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Why use {page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')}?
                      </h2>
                      <div className="space-y-2">
                        {config.valueProps.map((prop, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700 text-sm">{prop}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    {config.primaryAction && (
                      <Button
                        onClick={config.primaryAction.onClick}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        {config.primaryAction.label}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                    {config.secondaryAction && (
                      <Button
                        onClick={config.secondaryAction.onClick}
                        variant="outline"
                        size="lg"
                        className="px-6 py-4 text-sm border-2 hover:bg-gray-50"
                      >
                        {config.secondaryAction.label}
                      </Button>
                    )}
                  </div>

                  {config.valueProps.length === 0 && (
                    <div className="mt-6">
                      <p className="text-gray-500">This feature is under development and will be available soon.</p>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex items-stretch justify-end">
                  <div className="w-full lg:w-4/5 h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 flex items-center justify-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-16 h-16 bg-blue-300 rounded-full"></div>
                      <div className="absolute bottom-8 left-6 w-12 h-12 bg-indigo-300 rounded-full"></div>
                      <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-purple-300 rounded-full"></div>
                    </div>

                    {/* Dynamic illustration based on page */}
                    <div className="text-center p-8 relative z-10">
                      <div className="w-32 h-32 mx-auto mb-6 relative transform hover:scale-105 transition-transform duration-300">
                        {page === 'activities' && (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <FileText className="w-16 h-16 text-white" />
                          </div>
                        )}
                        {page === 'vendors' && (
                          <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <Users className="w-16 h-16 text-white" />
                          </div>
                        )}
                        {page === 'opportunities' && (
                          <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <Lightbulb className="w-16 h-16 text-white" />
                          </div>
                        )}
                        {page === 'web-to-lead' && (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <List className="w-16 h-16 text-white" />
                          </div>
                        )}
                        {page === 'invoices' && (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <Receipt className="w-16 h-16 text-white" />
                          </div>
                        )}
                        {page === 'sales-receipts' && (
                          <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <List className="w-16 h-16 text-white" />
                          </div>
                        )}
                        {page === 'payments' && (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <Lock className="w-16 h-16 text-white" />
                          </div>
                        )}
                        {page === 'marketplace' && (
                          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <Store className="w-16 h-16 text-white" />
                          </div>
                        )}
                        {!['activities', 'vendors', 'opportunities', 'web-to-lead', 'invoices', 'sales-receipts', 'payments', 'marketplace'].includes(page) && (
                          <div className={`w-full h-full bg-gradient-to-br ${config.gradient ?? 'from-gray-400 to-gray-500'} rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                            <AccentIcon className="w-16 h-16 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Floating elements for visual interest */}
                      <div className="space-y-3">
                        <div className="flex justify-center space-x-2">
                          <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
                          <div className="w-3 h-3 bg-indigo-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">
                          {page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')} Visualization
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
