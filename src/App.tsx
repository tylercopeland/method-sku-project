import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { AdminDashboard } from '@/components/AdminDashboard';
import { EstimatesPage } from '@/components/EstimatesPage';
import { CustomersPage } from '@/components/CustomersPage';
import { EmptyStatePage } from '@/components/EmptyStatePage';
import { SubscriptionPage } from '@/components/SubscriptionPage';
import type { ActiveSubscription } from '@/components/SubscriptionPage';
import { AccountSettingsPage } from '@/components/AccountSettingsPage';
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
  // Days remaining in the free trial (0 = expired). Drives banner + deferred-billing copy.
  const [trialDaysLeft, setTrialDaysLeft] = useState(7);

  // The user is "in trial" until the trial runs out. While in trial, a new subscription
  // defers its first charge to the trial-end date instead of charging immediately.
  const isInTrial = trialDaysLeft > 0;
  const trialEndLabel = (() => {
    const d = new Date();
    d.setDate(d.getDate() + trialDaysLeft);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  })();

  // Close mobile sidebar when navigating
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [currentPage]);

  // Page label mapping for the top header
  const pageLabels: Record<string, string> = {
    'home': 'Home',
    'customers': 'Customers & Leads',
    'estimates': 'Estimates',
    'activities': 'Activities',
    'vendors': 'Vendors',
    'opportunities': 'Opportunities',
    'web-to-lead': 'Web to Lead',
    'invoices': 'Invoices',
    'sales-receipts': 'Sales Receipts',
    'payments': 'Payments',
    'marketplace': 'App Marketplace',
    'subscription': 'Subscription',
    'account-settings': 'Account Settings',
  };

  // Determine if current page should show empty state
  const emptyStatePages = ['activities', 'vendors', 'opportunities', 'web-to-lead', 'invoices', 'sales-receipts', 'payments', 'marketplace'];
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
          className={`${isInTrial ? 'bg-blue-600' : 'bg-red-600'} text-white px-4 sm:px-4 py-2 flex items-center justify-center relative flex-shrink-0`}
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
        />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <TopHeader
          currentPageLabel={pageLabels[currentPage] || 'Home'}
          onNavigate={handlePageNavigation}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Render different pages based on current page */}
        {currentPage === 'home' ? (
          <AdminDashboard
            userName={adminUserName}
            onNavigateToEstimates={navigateToEstimates}
            onNavigateToCustomers={navigateToCustomers}
          />
        ) : currentPage === 'customers' ? (
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <CustomersPage initialFilter={customersFilter} />
          </div>
        ) : currentPage === 'estimates' ? (
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <EstimatesPage initialFilter={estimatesFilter} />
          </div>
        ) : currentPage === 'subscription' ? (
          <SubscriptionPage
            onBack={navigateToHome}
            activeSubscription={subscription}
            isInTrial={isInTrial}
            trialEndLabel={trialEndLabel}
            onSubscribed={(sub) => {
              setSubscription(sub);
              setShowTrialBanner(false);
            }}
          />
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
              { label: '7 days', days: 7 },
              { label: '2 days', days: 2 },
              { label: 'Expired', days: 0 },
            ].map((opt) => (
              <button
                key={opt.days}
                onClick={() => {
                  setTrialDaysLeft(opt.days);
                  setShowTrialBanner(true);
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
        </div>
      )}

      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
    </div>
  );
}

export default App;
