import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  ArrowRight,
  Lock,
  Wrench,
  Clock,
  Truck,
  Hammer,
  CalendarDays,
  Boxes,
  FileText,
  Plug,
  Users,
} from 'lucide-react';

interface AppConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  gradient: string;
  title: string;
  description: string;
  valueProps: string[];
}

const configs: Record<string, AppConfig> = {
  'work-orders': {
    label: 'Work Orders',
    icon: Wrench,
    iconColor: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    title: 'Streamline Your Work Orders',
    description: 'Create, assign, and track every job from request through completion — all in one place.',
    valueProps: [
      'Assign work to the right crew member',
      'Track status from open to done',
      'Attach photos, notes, and customer details',
      'Convert completed work into invoices',
    ],
  },
  'time-tracking': {
    label: 'Time Tracking',
    icon: Clock,
    iconColor: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600',
    title: 'Track Time, Bill Accurately',
    description: 'Capture billable hours so payroll and invoices are always accurate.',
    valueProps: [
      'Log time against jobs and customers',
      'Approve and export timesheets',
      'Turn hours into invoices automatically',
      "See where your team's time goes",
    ],
  },
  'field-crew': {
    label: 'Field Crew',
    icon: Truck,
    iconColor: 'text-teal-600',
    gradient: 'from-teal-500 to-teal-600',
    title: 'Empower Your Field Crew',
    description: 'Give your team a mobile app to see their jobs, capture details, and update status from anywhere.',
    valueProps: [
      "Mobile access to today's jobs",
      'Capture signatures, photos, and notes',
      'Update job status in real time',
      'Keep the office and field in sync',
    ],
  },
  jobs: {
    label: 'Jobs',
    icon: Hammer,
    iconColor: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600',
    title: 'Manage Every Job End-to-End',
    description: 'Run multi-stage projects with tasks, costs, and timelines in one view.',
    valueProps: [
      'Break jobs into trackable tasks',
      'Monitor costs and profitability',
      'Keep timelines on schedule',
      'See job progress at a glance',
    ],
  },
  schedules: {
    label: 'Schedules',
    icon: CalendarDays,
    iconColor: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
    title: 'Plan and Dispatch with Ease',
    description: 'Coordinate your team with a shared, drag-and-drop schedule.',
    valueProps: [
      "Visualize your team's week",
      'Dispatch the right person, fast',
      'Avoid double-booking',
      'Keep everyone on the same page',
    ],
  },
  inventory: {
    label: 'Inventory',
    icon: Boxes,
    iconColor: 'text-green-600',
    gradient: 'from-green-500 to-green-600',
    title: 'Know Your Inventory',
    description: 'Track stock levels, costs, and reorder points across every location.',
    valueProps: [
      'Track quantities in real time',
      'Set reorder points and alerts',
      'Manage costs and margins',
      'Sync items with QuickBooks',
    ],
  },
  'users': {
    label: 'User Management',
    icon: Users,
    iconColor: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    title: 'Manage Your Team with Ease',
    description: 'Invite team members, control permissions, and collaborate across your whole organisation.',
    valueProps: [
      'Invite unlimited team members',
      'Set role-based permissions per user',
      'Manage developer & API access',
      'See activity across your whole team',
    ],
  },
  'integrations-api': {
    label: 'API & Integrations',
    icon: Plug,
    iconColor: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    title: 'Connect Method to Your Favourite Tools',
    description: 'Unlock API access and powerful third-party integrations to extend Method across your entire workflow.',
    valueProps: [
      'Full API access to read, write, and automate data',
      'Connect to Zapier and 2,000+ apps',
      'Sync contacts with Mailchimp',
      'Surface Method data in Outlook and Gmail',
    ],
  },
  'app-routines': {
    label: 'App Routines',
    icon: FileText,
    iconColor: 'text-violet-600',
    gradient: 'from-violet-500 to-violet-600',
    title: 'Automate Your Workflows with App Routines',
    description: 'Set up routines that run automatically to keep your apps and data in sync without manual effort.',
    valueProps: [
      'Trigger actions based on events or schedules',
      'Automate repetitive tasks across apps',
      'Keep records updated without manual work',
      'Build multi-step workflows with ease',
    ],
  },
};

interface UpgradeRequiredPageProps {
  page: string;
  onUpgrade?: () => void;
  onBack?: () => void;
}

export function UpgradeRequiredPage({ page, onUpgrade, onBack }: UpgradeRequiredPageProps) {
  const cfg = configs[page] ?? {
    label: 'This app',
    icon: Lock,
    iconColor: 'text-gray-500',
    gradient: 'from-gray-400 to-gray-500',
    title: 'Unlock more with Build',
    description: 'This app is available on the Build plan.',
    valueProps: ['Custom workflows', 'Multi-user apps', 'Automations & app routines', 'API access'],
  };
  const Icon = cfg.icon;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Account Settings
          </button>
        )}
        <Card className="border-gray-200 shadow-xl bg-white w-full">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[500px]">
              <div className="flex-1">
                <div className="mb-6">
                  <div className="flex mb-4">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <Icon className={`w-6 h-6 ${cfg.iconColor}`} />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{cfg.title}</h1>
                  <p className="text-lg text-gray-600 max-w-3xl mb-6">{cfg.description}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Why use {cfg.label}?</h2>
                  <div className="space-y-2">
                    {cfg.valueProps.map((prop, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 text-sm">{prop}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <Button
                    onClick={onUpgrade}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Upgrade to Build
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex items-stretch justify-end">
                <div className="w-full lg:w-4/5 h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 flex items-center justify-center relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-16 h-16 bg-blue-300 rounded-full"></div>
                    <div className="absolute bottom-8 left-6 w-12 h-12 bg-indigo-300 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-purple-300 rounded-full"></div>
                  </div>

                  <div className="text-center p-8 relative z-10">
                    <div className="w-32 h-32 mx-auto mb-6 relative transform hover:scale-105 transition-transform duration-300">
                      <div className={`w-full h-full bg-gradient-to-br ${cfg.gradient} rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                        <Icon className="w-16 h-16 text-white" />
                      </div>
                    </div>

                    {/* Floating elements for visual interest */}
                    <div className="space-y-3">
                      <div className="flex justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-indigo-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <p className="text-gray-600 text-sm font-medium">{cfg.label} Visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
