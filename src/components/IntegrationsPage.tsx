import { ChevronLeft, Share2, Lock } from 'lucide-react';

const integrations = [
  {
    title: 'QuickBooks Sync',
    description: 'Sync Method with QuickBooks, resolve sync conflicts, and update sync settings.',
    linkLabel: 'QuickBooks Sync settings',
  },
  {
    title: 'Import',
    description: 'Import new or update existing data in Method.',
    linkLabel: 'Import settings',
  },
  {
    title: 'Export',
    description: 'Export data from any table to a spreadsheet readable format.',
    linkLabel: 'Export settings',
  },
  {
    title: 'Payment Gateways',
    description: 'Enter your merchant account information so that you can accept credit card payments from your customers.',
    linkLabel: 'Payment Gateways settings',
  },
  {
    title: 'Method:Sidebar for Gmail',
    description: "View, edit and create customers, invoices, estimates, payments and sales orders directly inside Gmail... it's really slick!",
    linkLabel: 'Method:Sidebar for Gmail settings',
  },
  {
    title: 'Google Calendar',
    description: "Sync Activities in Method's calendar with your Google Calendar.",
    linkLabel: 'Google Calendar settings',
  },
  {
    title: 'API',
    description: 'The API is an easy programming interface for software developers to access, add and edit data for your Method account.',
    linkLabel: 'API settings',
    requiresUpgrade: true,
  },
  {
    title: 'Mailchimp',
    description: 'Send Contacts from Method to your Mailchimp account.',
    linkLabel: 'Mailchimp settings',
    requiresUpgrade: true,
  },
  {
    title: 'Outlook Gadget',
    description: 'Find Contacts, Invoices, Opportunities, Activities, Estimates and Sales Receipts related to emails received.',
    linkLabel: 'Outlook Gadget settings',
    requiresUpgrade: true,
  },
  {
    title: 'Zapier',
    description: 'Lets you connect Method to 2000+ other apps in its app store.',
    linkLabel: 'Zapier settings',
    requiresUpgrade: true,
  },
];

interface IntegrationsPageProps {
  onBack?: () => void;
  upgradeRequired?: boolean;
  onNavigate?: (page: string) => void;
}

export function IntegrationsPage({ onBack, upgradeRequired = false, onNavigate }: IntegrationsPageProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Integrations</h1>
        </div>

        <hr className="border-gray-200 mb-2" />

        <div className="divide-y divide-transparent">
          {integrations.map((item) => {
            const locked = Boolean(item.requiresUpgrade) && upgradeRequired;
            return (
              <div key={item.title} className="flex items-start justify-between gap-6 py-7">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => locked ? onNavigate?.('integrations-api') : undefined}
                      className="text-lg sm:text-xl font-medium text-blue-700 hover:underline text-left"
                    >
                      {item.title}
                    </button>
                    {locked && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                        <Lock className="w-3 h-3" />
                        Upgrade
                      </span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 max-w-3xl">{item.description}</p>
                </div>
                <button
                  onClick={() => locked ? onNavigate?.('integrations-api') : undefined}
                  className="text-blue-600 hover:underline whitespace-nowrap flex-shrink-0 text-sm sm:text-base"
                >
                  {item.linkLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
