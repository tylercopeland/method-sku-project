import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  Sparkles
} from 'lucide-react';

interface EmptyStateModalProps {
  page: string;
  isOpen: boolean;
  onClose: () => void;
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
}

export function EmptyStateModal({ page, isOpen, onClose }: EmptyStateModalProps) {
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

      default:
        return {
          icon: <Sparkles className="w-6 h-6 text-gray-400" />,
          title: 'Coming Soon',
          description: 'This feature is under development and will be available soon.',
          valueProps: []
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-y-auto max-h-[90vh]">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
                    onClick={() => {
                      config.primaryAction?.onClick();
                      onClose();
                    }}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {config.primaryAction.label}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {config.secondaryAction && (
                  <Button
                    onClick={() => {
                      config.secondaryAction?.onClick();
                      onClose();
                    }}
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
              <div className="w-4/5 h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 flex items-center justify-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-blue-300 rounded-full"></div>
                  <div className="absolute bottom-6 left-4 w-8 h-8 bg-indigo-300 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-purple-300 rounded-full"></div>
                </div>
                
                {/* Dynamic illustration based on page */}
                <div className="text-center p-6 relative z-10">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    {page === 'activities' && (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <FileText className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {page === 'vendors' && (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {page === 'opportunities' && (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Lightbulb className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {page === 'web-to-lead' && (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <List className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {page === 'invoices' && (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Receipt className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {page === 'sales-receipts' && (
                      <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <List className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {page === 'payments' && (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Lock className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {page === 'marketplace' && (
                      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Store className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {!['activities', 'vendors', 'opportunities', 'web-to-lead', 'invoices', 'sales-receipts', 'payments', 'marketplace'].includes(page) && (
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Sparkles className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Floating elements for visual interest */}
                  <div className="space-y-2">
                    <div className="flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                    <p className="text-gray-600 text-xs font-medium">
                      {page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

