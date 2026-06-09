import { ChevronLeft, LayoutGrid, Table2, Plus } from 'lucide-react';

interface Pack {
  name: string;
  description?: string;
}

const availablePacks: Pack[] = [
  {
    name: 'SaaSphalt',
    description:
      'SaaSphalt is software for paving, sealcoating and striping contractors that features CRM, Estimating, Scheduling & Invoicing.',
  },
  {
    name: 'SaaSphalt Crew Leader',
    description: 'SaaSphalt Crew Leader allows crew leaders to access schedule for day.',
  },
];

const installedPacks: Pack[] = [
  { name: 'Accounting Lists', description: 'Add and update your accounting lists (Accounts, Classes, SalesReps, Items, Terms) and sync them with QuickBooks.' },
  { name: 'Activities Calendar (migration)', description: 'Pack for Activities Calendar (migration)' },
  { name: 'App Builder Invoice', description: 'Pack for App Builder Invoice' },
  { name: 'brianTest', description: 'Pack for brianTest' },
  { name: 'Case Management', description: 'Case Management allows you to create and track customer service tickets to help your team share information and solve issues.' },
  { name: 'Companies', description: 'Pack for Companies' },
  { name: 'Contact Details (migration)', description: 'Pack for Contact Details (migration)' },
  { name: 'Contact Management', description: 'Save time by keeping critical customer information, transactions and communication history organized.' },
  { name: 'Contact Preferences (migration)', description: 'Pack for Contact Preferences (migration)' },
  { name: 'Contacts 2', description: 'Pack for Contacts 2' },
  { name: 'Customer Portal Dashboard (migration)', description: 'Pack for Customer Portal Dashboard (migration)' },
  { name: 'Customers & Leads (migration)', description: 'Pack for Customers & Leads (migration)' },
  { name: "Dawid's custom app", description: "Pack for Dawid's custom app" },
  { name: 'Donor Management', description: "When you have each donor's history at your fingertips, it's easier to cultivate great relationships with each member, and get better results." },
  { name: 'Edit Contact (migration)', description: 'Pack for Edit Contact (migration)' },
  { name: 'Edit Customer (migration)', description: 'Pack for Edit Customer (migration)' },
  { name: 'Email Campaigns', description: 'Email Campaigns enable you to quickly create and send out mass emails to filtered contact lists directly from within your Method account.' },
  { name: 'Field Crew', description: 'Manage work orders from the field. Track time for crew members on the job.' },
  { name: 'Invoice Manager', description: 'Pack for Invoice Manager' },
  { name: 'Jobs', description: 'Plan, track, and manage every job from start to finish — all in one place.' },
  { name: 'Leads', description: 'Pack for Leads' },
  { name: 'Lunch Order Tracker', description: 'Pack for Lunch Order Tracker' },
  { name: 'New App Who Dis', description: 'Pack for New App Who Dis' },
  { name: 'New Contact modal (migration)', description: 'Pack for New Contact modal (migration)' },
  { name: 'New/Edit Bill (migration)', description: 'Pack for New/Edit Bill (migration)' },
  { name: 'New/Edit Contact (migration)', description: 'Pack for New/Edit Contact (migration)' },
  { name: 'New/Edit Invoice (migration)', description: 'Pack for New/Edit Invoice (migration)' },
  { name: 'New/Edit Opportunity (migration)', description: 'Pack for New/Edit Opportunity (migration)' },
  { name: 'New/Edit Opportunity (migration) ', description: 'Pack for New/Edit Opportunity (migration)' },
  { name: 'New/Edit Proposal (migration)', description: 'Pack for New/Edit Proposal (migration)' },
  { name: 'PawWalk', description: 'Pack for PawWalk' },
  { name: 'Pay & Sign Proposal in Customer Port…', description: 'Pack for Pay & Sign Proposal in Customer Portal (migration)' },
  { name: 'Proposals', description: 'Manage engagements with automated recurring invoicing and payments.' },
  { name: 'Purchase Transactions', description: 'Create and update your purchase transactions (Bills, Purchase Orders) and sync them with QuickBooks.' },
  { name: 'Rewards', description: 'Pack for Rewards' },
  { name: 'Rewardsads', description: 'Pack for Rewardsads' },
  { name: 'rrf', description: 'Pack for rrf' },
  { name: 'SaaS Valuation Calculator', description: 'Pack for SaaS Valuation Calculator' },
  { name: 'Sales Pipeline', description: "For sales managers and staff who want to grow revenue by focusing on the right deals. You'll get a clear view into your opportunities and more." },
  { name: 'Sales Transactions', description: 'Create and update all your sales transactions (Invoices, Estimates, Payments, Sales Orders, Sales Receipts) and sync them with QuickBooks.' },
  { name: 'Schedule', description: 'Manage and schedule visits, and plan upcoming unscheduled work.' },
  { name: 'Single Screen Test', description: 'Pack for Single Screen Test' },
  { name: 'Test App', description: 'Pack for Test App' },
  { name: 'Test2', description: 'Pack for Test2' },
  { name: 'Time Tracking', description: 'Track time spent on daily tasks and services. Manage entries for approval.' },
  { name: 'Work Orders', description: 'Create, dispatch and invoice work orders from one place.' },
];

function PackCard({ name, description }: Pack) {
  return (
    <div className="flex flex-col h-44 bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="h-0.5 bg-blue-600 flex-shrink-0" />
      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">{name}</h3>
        <div className="flex gap-3 flex-1 min-h-0">
          <Table2 className="w-7 h-7 text-blue-500 flex-shrink-0 mt-0.5" />
          {description && (
            <p className="text-xs text-gray-500 leading-snug line-clamp-5">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface AppMarketplacePageProps {
  onBack?: () => void;
}

export function AppMarketplacePage({ onBack }: AppMarketplacePageProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
      {/* Back + title */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-3"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-200">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <LayoutGrid className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Add / Remove Apps</h1>
      </div>

      {/* Available Packs */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Available Packs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <button className="flex h-44 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-semibold text-blue-600 hover:bg-gray-50">
          Create Custom App
        </button>
        {availablePacks.map((pack) => (
          <PackCard key={pack.name} {...pack} />
        ))}
      </div>

      {/* Installed App Packs */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Installed App Packs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {installedPacks.map((pack) => (
          <PackCard key={pack.name} {...pack} />
        ))}
      </div>

      {/* Create Custom App CTA */}
      <div className="flex justify-end mt-8">
        <button className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create Custom App
        </button>
      </div>
    </div>
  );
}
