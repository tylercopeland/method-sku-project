import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { AdminDashboard } from '@/components/AdminDashboard';
import { EstimatesPage } from '@/components/EstimatesPage';
import { CustomersPage } from '@/components/CustomersPage';
import { EmptyStatePage } from '@/components/EmptyStatePage';
import { SubscriptionPage } from '@/components/SubscriptionPage';
import type { ActiveSubscription } from '@/components/SubscriptionPage';
import { AccountSettingsPage } from '@/components/AccountSettingsPage';
import { UpgradeRequiredPage } from '@/components/UpgradeRequiredPage';
import { OnboardingModal } from '@/components/OnboardingModal';
import { useState, useEffect } from 'react';
import { Agentation } from 'agentation';
import { X } from 'lucide-react';

function App() {
  // In a real app, this would come from authentication/user context
  const adminUserName = 'Paul';
  const [currentPage, setCurrentPage] = useState('home');
  const [estimatesFilter, setEstimatesFilter] = useState<string | undefined>(undefined);
  const [customersFilter, setCustomersFilter] = useState<string | undefined>(undefined);
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // First-run onboarding modal — shows over Home until the user completes it.
  const [showOnboarding, setShowOnboarding] = useState(true);
  // When entering the subscription page from an upgrade prompt, open on the change-plan grid.
  const [openToChangePlan, setOpenToChangePlan] = useState(false);
  const teamSize = 4; // Known at render time; drives seat math on the pricing cards.
  // Days remaining in the free trial (0 = expired). Drives banner + deferred-billing copy.
  const [trialDaysLeft, setTrialDaysLeft] = useState(10);

  // The user is "in trial" until the trial runs out. While in trial, a new subscription
  // defers its first charge to the trial-end date instead of charging immediately.
  const isInTrial = trialDaysLeft > 0;
  const trialEndLabel = (() => {
    const d = new Date();
    d.setDate(d.getDate() + trialDaysLeft);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  })();

  // Once the trial expires with no subscription, the app is gated: only the
  // Subscribe screen is reachable until the user subscribes.
  const isLocked = !isInTrial && !subscription;

  // Build-tier ("Your Team, Your Way") multi-user apps. Locked for Essentials subscribers
  // (e.g. after downgrading from Build) — clicking routes to the upgrade value moment.
  const premiumApps = ['work-orders', 'time-tracking', 'field-crew', 'jobs', 'schedules', 'inventory'];
  const premiumLocked = subscription?.planId === 'essentials';
  const lockedApps = premiumLocked ? premiumApps : [];

  // Close mobile sidebar when navigating
  useEffect(() => {
    setIsMobileSidebarOpen(false);
    // Leaving the subscription page clears the change-plan deep-link intent.
    if (currentPage !== 'subscription') setOpenToChangePlan(false);
  }, [currentPage]);

  // Page label mapping for the top header
  const pageLabels: Record<string, string> = {
    'home': 'Home',
    'contacts': 'Contacts',
    'customers': 'Customers & Leads',
    'estimates': 'Estimates',
    'activities': 'Activities',
    'vendors': 'Vendors',
    'opportunities': 'Opportunities',
    'web-to-lead': 'Web to Lead',
    'invoices': 'Invoices',
    'sales-receipts': 'Sales Receipts',
    'payments': 'Payments',
    'items': 'Items',
    'accounts': 'Accounts',
    'send-email': 'Send Email',
    'email-campaigns': 'Email Campaigns',
    'donor-pages': 'Donor Pages',
    'work-orders': 'Work Orders',
    'time-tracking': 'Time Tracking',
    'field-crew': 'Field Crew',
    'jobs': 'Jobs',
    'schedules': 'Schedules',
    'inventory': 'Inventory',
    'donations': 'Donations',
    'cases': 'Cases',
    'classes': 'Classes',
    'sales-orders': 'Sales Orders',
    'purchase-orders': 'Purchase Orders',
    'bills': 'Bills',
    'proposals': 'Proposals',
    'marketplace': 'App Marketplace',
    'subscription': 'Subscription',
    'account-settings': 'Account Settings',
  };

  // Determine if current page should show empty state
  const emptyStatePages = [
    'activities', 'vendors', 'opportunities', 'web-to-lead', 'invoices', 'sales-receipts', 'payments', 'marketplace',
    'items', 'accounts', 'send-email', 'email-campaigns', 'donor-pages', 'work-orders', 'time-tracking',
    'field-crew', 'jobs', 'schedules', 'inventory', 'donations', 'cases', 'classes', 'sales-orders',
    'purchase-orders', 'bills', 'proposals',
  ];
  const shouldShowEmptyState = emptyStatePages.includes(currentPage);

  const handlePageNavigation = (page: string) => {
    if (page === 'home') {
      navigateToHome();
    } else if (page === 'customers') {
      navigateToCustomers();
    } else if (page === 'estimates') {
      navigateToEstimates();
    } else {
      setCurrentPage(page);
    }
  };

  const navigateToEstimates = (filter?: string) => {
    setCurrentPage('estimates');
    setEstimatesFilter(filter);
  };

  const navigateToCustomers = (filter?: string) => {
    setCurrentPage('customers');
    setCustomersFilter(filter);
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setEstimatesFilter(undefined);
    setCustomersFilter(undefined);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Trial Banner */}
      {showTrialBanner && !subscription && (
        <div
          className={`${isInTrial ? 'bg-violet-600' : 'bg-red-600'} text-white px-4 sm:px-4 py-2 flex items-center justify-center relative flex-shrink-0`}
        >
          <span className="text-xs sm:text-sm font-medium text-center pr-6 sm:pr-0">
            {isInTrial ? (
              <>
                <span className="hidden sm:inline">{trialDaysLeft} days left in your trial. </span>
                <span className="sm:hidden">{trialDaysLeft} days left. </span>
              </>
            ) : (
              <span>Your trial has expired. </span>
            )}
            <button
              onClick={() => setCurrentPage('subscription')}
              className="underline hover:no-underline font-semibold"
            >
              Subscribe now
            </button>
          </span>
          {/* Only allow dismissing while there's comfortable time left in the trial. */}
          {isInTrial && trialDaysLeft > 3 && (
            <button
              onClick={() => setShowTrialBanner(false)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handlePageNavigation}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          locked={isLocked}
          lockedApps={lockedApps}
        />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <TopHeader
          currentPageLabel={isLocked ? 'Subscription' : pageLabels[currentPage] || 'Home'}
          onNavigate={handlePageNavigation}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Render different pages based on current page. When the trial has expired
            with no subscription, the app is locked to the Subscribe screen. */}
        {isLocked || currentPage === 'subscription' ? (
          <SubscriptionPage
            onBack={navigateToHome}
            activeSubscription={subscription}
            isInTrial={isInTrial}
            trialEndLabel={trialEndLabel}
            teamSize={teamSize}
            trialUsage={{
              customAppsBuilt: 2,
              workflowDesignerOpened: true,
            }}
            initialStep={openToChangePlan ? 'plans' : 'manage'}
            onSubscribed={(sub) => {
              setSubscription(sub);
              setShowTrialBanner(false);
            }}
          />
        ) : premiumLocked && premiumApps.includes(currentPage) ? (
          <UpgradeRequiredPage
            page={currentPage}
            onUpgrade={() => {
              setOpenToChangePlan(true);
              setCurrentPage('subscription');
            }}
          />
        ) : currentPage === 'home' ? (
          <AdminDashboard
            userName={adminUserName}
            onNavigateToEstimates={navigateToEstimates}
            onNavigateToCustomers={navigateToCustomers}
          />
        ) : currentPage === 'customers' || currentPage === 'contacts' ? (
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <CustomersPage initialFilter={customersFilter} />
          </div>
        ) : currentPage === 'estimates' ? (
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <EstimatesPage initialFilter={estimatesFilter} />
          </div>
        ) : currentPage === 'account-settings' ? (
          <AccountSettingsPage
            onBack={navigateToHome}
            onNavigate={handlePageNavigation}
          />
        ) : shouldShowEmptyState && ['activities', 'vendors', 'invoices'].includes(currentPage) ? (
          // Inline mode with banner and sample data for activities, vendors, invoices
          <EmptyStatePage page={currentPage} showBanner={true} showSampleData={true} />
        ) : shouldShowEmptyState ? (
          // Inline mode without banner for other pages
          <EmptyStatePage page={currentPage} showBanner={false} />
        ) : (
          <EmptyStatePage page="not-found" />
        )}
        </div>
      </div>

      {/* Demo controls (dev only) — switch trial state + reset subscription for presenting */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-[60] w-56 rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-lg">
          <p className="mb-2 font-semibold text-gray-700">Demo controls</p>
          <p className="mb-1 text-gray-500">Trial</p>
          <div className="mb-3 flex gap-1">
            {[
              { label: '10 days', days: 10 },
              { label: '2 days', days: 2 },
              { label: 'Expired', days: 0 },
            ].map((opt) => (
              <button
                key={opt.days}
                onClick={() => {
                  setTrialDaysLeft(opt.days);
                  setShowTrialBanner(true);
                  // Expiring with no subscription locks the app to the Subscribe screen.
                  if (opt.days === 0) setCurrentPage('subscription');
                }}
                className={`flex-1 rounded border px-2 py-1 transition-colors ${
                  trialDaysLeft === opt.days
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-2">
            <span className="text-gray-500">
              {subscription ? `Subscribed: ${subscription.planId}` : 'Not subscribed'}
            </span>
            {subscription && (
              <button
                onClick={() => {
                  setSubscription(null);
                  setShowTrialBanner(true);
                }}
                className="font-medium text-blue-600 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <div className="border-t border-gray-100 pt-2 mt-2">
            <button
              onClick={() => {
                navigateToHome();
                setShowOnboarding(true);
              }}
              className="font-medium text-blue-600 hover:underline"
            >
              Replay onboarding
            </button>
          </div>
        </div>
      )}

      {/* First-run onboarding — modal over Home, blocks the app until completed */}
      {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}

      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
    </div>
  );
}

export default App;
