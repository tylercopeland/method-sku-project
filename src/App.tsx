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
import { AppStudioPage, aiApps } from '@/components/AppStudioPage';
import { AppMarketplacePage } from '@/components/AppMarketplacePage';
import { ApplicationsAccessPage } from '@/components/ApplicationsAccessPage';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AIFieldsProvider, AddFieldChatPanel, FieldSurfaceRegistrar } from '@/lib/ai-fields';
import { useState, useEffect } from 'react';
import { X, GripVertical, ChevronDown } from 'lucide-react';

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
  // Demo: render checkout (payment + order summary) inline as a page or in a modal.
  const [checkoutMode, setCheckoutMode] = useState<'inline' | 'modal'>('modal');
  // Demo: whether App Studio is accessible (shown in the sidebar). Off by default;
  // toggled on via demo controls. While off, the sidebar shows no App Studio menu item.
  const [appStudioEnabled, setAppStudioEnabled] = useState(false);
  // Demo: enables the "Add field with AI" custom-fields experience on detail screens.
  const [aiFieldsEnabled, setAiFieldsEnabled] = useState(false);
  // Demo: emphasize the annual discount with the discounted monthly price on plan cards.
  const [showDiscountedPrice, setShowDiscountedPrice] = useState(true);
  // Applications Access deep-link: which user, scrolled to which app they came from.
  const [accessUser, setAccessUser] = useState<string | null>(null);
  const [accessScrollApp, setAccessScrollApp] = useState<string | undefined>(undefined);
  // Draggable position + collapsed state of the demo-controls panel.
  const [demoPos, setDemoPos] = useState<{ x: number; y: number } | null>(null);
  const [demoCollapsed, setDemoCollapsed] = useState(false);

  const startDemoDrag = (e: React.PointerEvent<HTMLElement>) => {
    const panel = e.currentTarget.closest('[data-demo-panel]') as HTMLElement | null;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const onMove = (ev: PointerEvent) => {
      setDemoPos({ x: ev.clientX - offsetX, y: ev.clientY - offsetY });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };
  // Team size — drives the recommended plan and seat-based pricing on the cards.
  const [teamSize, setTeamSize] = useState(1);
  // Days remaining in the free trial (0 = expired). Drives banner + deferred-billing copy.
  const [trialDaysLeft, setTrialDaysLeft] = useState(10);
  // Whether a (non-subscribed) trial user has canceled — account closes at trial end.
  const [trialCanceled, setTrialCanceled] = useState(false);

  // The user is "in trial" until the trial runs out. While in trial, a new subscription
  // defers its first charge to the trial-end date instead of charging immediately.
  const isInTrial = trialDaysLeft > 0;
  // Final stretch of the trial — switch to higher-urgency, continuity-framed copy.
  const endingSoon = isInTrial && trialDaysLeft <= 3;
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
    'app-studio': 'App Studio',
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
    'applications-access': 'Account Settings',
    'subscription': 'Subscription',
    'account-settings': 'Account Settings',
  };

  // Determine if current page should show empty state
  const emptyStatePages = [
    'activities', 'vendors', 'opportunities', 'web-to-lead', 'invoices', 'sales-receipts', 'payments',
    'items', 'accounts', 'send-email', 'email-campaigns', 'donor-pages', 'work-orders', 'time-tracking',
    'field-crew', 'jobs', 'schedules', 'inventory', 'donations', 'cases', 'classes', 'sales-orders',
    'purchase-orders', 'bills', 'proposals',
  ];
  const shouldShowEmptyState = emptyStatePages.includes(currentPage);

  // System pages (not CRM app/object screens) — these don't get the app-title menu.
  const nonAppScreens = [
    'home', 'subscription', 'account-settings', 'marketplace', 'applications-access', 'app-studio',
  ];

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
    <AIFieldsProvider enabled={aiFieldsEnabled}>
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Trial Banner */}
      {showTrialBanner && !subscription && (
        <div
          className={`${
            trialCanceled ? 'bg-amber-600' : isInTrial ? 'bg-violet-600' : 'bg-red-600'
          } text-white px-4 sm:px-4 py-2 flex items-center justify-center relative flex-shrink-0`}
        >
          <span className="text-xs sm:text-sm font-medium text-center pr-6 sm:pr-0">
            {trialCanceled ? (
              <>
                <span>
                  Your trial is canceled — access ends{' '}
                  {isInTrial ? `in ${trialDaysLeft} days. ` : 'now. '}
                </span>
                <button
                  onClick={() => setTrialCanceled(false)}
                  className="underline hover:no-underline font-semibold"
                >
                  Reactivate
                </button>
              </>
            ) : (
              <>
                {!isInTrial ? (
                  <span>Your trial has expired. </span>
                ) : endingSoon ? (
                  <span>Your trial ends in {trialDaysLeft} days. </span>
                ) : (
                  <>
                    <span className="hidden sm:inline">{trialDaysLeft} days left in your trial. </span>
                    <span className="sm:hidden">{trialDaysLeft} days left. </span>
                  </>
                )}
                <button
                  onClick={() => setCurrentPage('subscription')}
                  className="underline hover:no-underline font-semibold"
                >
                  Subscribe now
                </button>
                {endingSoon && (
                  <span className="hidden sm:inline"> to keep everything you've set up.</span>
                )}
              </>
            )}
          </span>
          {/* Only allow dismissing while there's comfortable time left in the trial. */}
          {isInTrial && trialDaysLeft > 3 && !trialCanceled && (
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
          appStudioEnabled={appStudioEnabled}
        />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <TopHeader
          currentPageLabel={isLocked ? 'Subscription' : pageLabels[currentPage] || 'Home'}
          isAppScreen={!isLocked && !nonAppScreens.includes(currentPage)}
          onNavigate={handlePageNavigation}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Page + chat panel share a row below the top bar */}
        <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col">

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
              customAppsBuilt: aiApps.length,
              publishedApps: aiApps.filter((a) => a.status === 'published').length,
              draftApps: aiApps.filter((a) => a.status === 'draft').length,
              workflowDesignerOpened: true,
            }}
            initialStep={openToChangePlan ? 'plans' : 'manage'}
            checkoutMode={checkoutMode}
            hasAppStudioAccess={appStudioEnabled}
            showDiscountedPrice={showDiscountedPrice}
            onSubscribed={(sub) => {
              setSubscription(sub);
              setShowTrialBanner(false);
            }}
            onCancel={() => {
              // Paid subscriber → cancel at period end; trial user → close at trial end.
              if (subscription) {
                setSubscription({ ...subscription, cancelAtPeriodEnd: true });
              } else {
                setTrialCanceled(true);
              }
            }}
            onResume={() => {
              if (subscription) {
                setSubscription({ ...subscription, cancelAtPeriodEnd: false });
              } else {
                setTrialCanceled(false);
              }
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
        ) : currentPage === 'app-studio' && appStudioEnabled ? (
          <AppStudioPage
            userName={adminUserName}
            locked={premiumLocked}
            onUpgrade={() => {
              setOpenToChangePlan(true);
              setCurrentPage('subscription');
            }}
          />
        ) : currentPage === 'applications-access' && accessUser ? (
          <ApplicationsAccessPage
            user={accessUser}
            scrollToApp={accessScrollApp}
            onBack={() => setCurrentPage('marketplace')}
            onNavigate={handlePageNavigation}
          />
        ) : currentPage === 'marketplace' ? (
          <AppMarketplacePage
            onBack={navigateToHome}
            onOpenUserAccess={(user, appName) => {
              setAccessUser(user);
              setAccessScrollApp(appName);
              setCurrentPage('applications-access');
            }}
          />
        ) : currentPage === 'home' ? (
          <AdminDashboard
            userName={adminUserName}
            onNavigateToEstimates={navigateToEstimates}
            onNavigateToCustomers={navigateToCustomers}
            lockedApps={lockedApps}
            onOpenApp={(page) => setCurrentPage(page)}
            onUpgrade={() => {
              setOpenToChangePlan(true);
              setCurrentPage('subscription');
            }}
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

        {/* Make the Customize launcher available on every app screen. Customers/
            Contacts register their own surface (list vs detail), so skip them here. */}
        {!isLocked &&
          !nonAppScreens.includes(currentPage) &&
          !(premiumLocked && premiumApps.includes(currentPage)) &&
          !['customers', 'contacts'].includes(currentPage) && (
            <FieldSurfaceRegistrar
              entityType={currentPage}
              entityLabel={pageLabels[currentPage] || 'Records'}
            />
          )}

        {/* Add-field chat panel — sits below the top bar, beside the page */}
        <AddFieldChatPanel />
        </div>
        </div>
      </div>

      {/* Demo controls — switch trial state + reset subscription for presenting (shown in prod too) */}
      {(
        <div
          data-demo-panel
          style={demoPos ? { left: demoPos.x, top: demoPos.y } : undefined}
          className={`fixed z-[60] w-56 rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-lg ${
            demoPos ? '' : 'bottom-4 left-4'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              onPointerDown={startDemoDrag}
              className="flex cursor-move select-none items-center gap-1 font-semibold text-gray-700"
            >
              <GripVertical className="h-3.5 w-3.5 text-gray-400" />
              Demo controls
            </span>
            <button
              onClick={() => setDemoCollapsed(!demoCollapsed)}
              className="p-0.5 text-gray-400 hover:text-gray-600"
              aria-label={demoCollapsed ? 'Expand demo controls' : 'Collapse demo controls'}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${demoCollapsed ? '-rotate-90' : ''}`} />
            </button>
          </div>
          {!demoCollapsed && (
            <>
          {/* Trial state is only relevant before subscribing */}
          {!subscription && (
            <>
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
                      setTrialCanceled(false);
                      // Expiring with no subscription locks the app to the Subscribe screen.
                      if (opt.days === 0 && !subscription) setCurrentPage('subscription');
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
            </>
          )}
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
          {subscription && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="mb-1 text-gray-500">Plan (gates apps)</p>
              <div className="flex gap-1">
                {[
                  { label: 'Essentials', id: 'essentials' },
                  { label: 'Build', id: 'build' },
                  { label: 'Scale', id: 'scale' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSubscription({ ...subscription, planId: opt.id })}
                    className={`flex-1 rounded border px-2 py-1 transition-colors ${
                      subscription.planId === opt.id
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="mb-1 text-gray-500">Users</p>
            <div className="flex gap-1">
              {[1, 4, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => setTeamSize(n)}
                  className={`flex-1 rounded border px-2 py-1 transition-colors ${
                    teamSize === n
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="mb-1 text-gray-500">Checkout</p>
            <div className="flex gap-1">
              {(['inline', 'modal'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCheckoutMode(mode)}
                  className={`flex-1 rounded border px-2 py-1 capitalize transition-colors ${
                    checkoutMode === mode
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="mb-1 text-gray-500">App Studio access</p>
            <div className="flex gap-1">
              {([
                { label: 'On', value: true },
                { label: 'Off', value: false },
              ] as const).map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setAppStudioEnabled(opt.value);
                    // If we're turning it off while viewing it, step back to Home.
                    if (!opt.value && currentPage === 'app-studio') navigateToHome();
                  }}
                  className={`flex-1 rounded border px-2 py-1 transition-colors ${
                    appStudioEnabled === opt.value
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="mb-1 text-gray-500">AI custom fields</p>
            <div className="flex gap-1">
              {([
                { label: 'On', value: true },
                { label: 'Off', value: false },
              ] as const).map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setAiFieldsEnabled(opt.value)}
                  className={`flex-1 rounded border px-2 py-1 transition-colors ${
                    aiFieldsEnabled === opt.value
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="mb-1 text-gray-500">Discounted price</p>
            <div className="flex gap-1">
              {([
                { label: 'On', value: true },
                { label: 'Off', value: false },
              ] as const).map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setShowDiscountedPrice(opt.value)}
                  className={`flex-1 rounded border px-2 py-1 transition-colors ${
                    showDiscountedPrice === opt.value
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
            </>
          )}
        </div>
      )}

      {/* First-run onboarding — modal over Home, blocks the app until completed */}
      {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}
    </div>
    </AIFieldsProvider>
  );
}

export default App;
