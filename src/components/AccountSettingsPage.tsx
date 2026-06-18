import { Settings, ChevronLeft } from 'lucide-react';

interface SettingsSection {
  title: string;
  description: string;
  linkLabel: string;
  page?: string;
}

const sections: SettingsSection[] = [
  {
    title: 'Subscription',
    description: 'Update your payment method and app subscriptions.',
    linkLabel: 'Subscription settings',
    page: 'subscription',
  },
  {
    title: 'Users',
    description: 'Update user information, and invite more users to Method.',
    linkLabel: 'User settings',
    page: 'users',
  },
  {
    title: 'Display',
    description: 'Upload your company logo, and set your display preferences.',
    linkLabel: 'Display settings',
  },
  {
    title: 'Communication',
    description: 'Set your email provider preferences and manage senders.',
    linkLabel: 'Communication settings',
  },
  {
    title: 'Notifications',
    description: 'Set where and how you receive activity reminders.',
    linkLabel: 'Notification settings',
  },
  {
    title: 'Tables & Fields',
    description: 'Create and review Tables & Fields to use for customization.',
    linkLabel: 'Tables & Fields settings',
  },
  {
    title: 'Portal',
    description:
      "Method's portal is a dedicated and secure web page for your customers to access information shared with them.",
    linkLabel: 'Portal settings',
  },
  {
    title: 'Audit Trail',
    description: 'Review historical changes made to your Method Account.',
    linkLabel: 'Audit Trail settings',
  },
  {
    title: 'App Routines',
    description: 'See a list of app routines that have been queued up to run.',
    linkLabel: 'App Routine settings',
  },
  {
    title: 'Reports & Print Templates',
    description:
      'Create and edit reports and print templates such as Activity Reports and Invoice Print templates.',
    linkLabel: 'Report & Print Template settings',
  },
  {
    title: 'Multi-entity setup',
    description:
      'Set up multi-entity management for your multiple franchises, locations, or QuickBooks accounts.',
    linkLabel: 'Multi-entity settings',
    page: 'multi-entity',
  },
];

interface AccountSettingsPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function AccountSettingsPage({ onBack, onNavigate }: AccountSettingsPageProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Account Settings</h1>
        </div>

        <hr className="border-gray-200 mb-2" />

        {/* Sections */}
        <div className="divide-y divide-transparent">
          {sections.map((section) => (
            <div
              key={section.title}
              className="flex items-start justify-between gap-6 py-7"
            >
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-medium text-blue-700 mb-3">
                  {section.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 max-w-3xl">
                  {section.description}
                </p>
              </div>
              <button
                onClick={() => section.page && onNavigate?.(section.page)}
                className="text-blue-600 hover:underline whitespace-nowrap flex-shrink-0 text-sm sm:text-base"
              >
                {section.linkLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
