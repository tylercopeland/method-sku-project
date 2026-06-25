import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { AdminDashboard } from '@/components/AdminDashboard';
import { EstimatesPage } from '@/components/EstimatesPage';
import { CustomersPage } from '@/components/CustomersPage';
import { EmptyStatePage } from '@/components/EmptyStatePage';
import { AppBuilderView } from '@/components/AppBuilderView';
import { SubscriptionPage } from '@/components/SubscriptionPage';
import type { ActiveSubscription } from '@/components/SubscriptionPage';
import { AccountSettingsPage } from '@/components/AccountSettingsPage';
import { UpgradeRequiredPage } from '@/components/UpgradeRequiredPage';
import { AppStudioPage, aiApps } from '@/components/AppStudioPage';
import { AppMarketplacePage } from '@/components/AppMarketplacePage';
import { ApplicationsAccessPage } from '@/components/ApplicationsAccessPage';
import { UserManagementPage, InviteModal, PLAN_SEATS, ROLE_SEAT_TYPE, ALL_MOCK_USERS } from '@/components/UserManagementPage';
import { MultiEntityPage } from '@/components/MultiEntityPage';
import { MultiEntitySetupPage } from '@/components/MultiEntitySetupPage';
import { OnboardingModal } from '@/components/OnboardingModal';
import { HelpDrawer } from '@/components/HelpDrawer';
import { IntegrationsPage } from '@/components/IntegrationsPage';
import { QuickUpgradeModal } from '@/components/QuickUpgradeModal';
import { AIFieldsProvider, AddFieldChatPanel, FieldSurfaceRegistrar } from '@/lib/ai-fields';
import { PLAN_ORDER, nextPlanId as getNextPlanId } from '@/lib/plans';
import { getEntitlements, type PlanTier } from '@/lib/entitlements';
import { Switch } from '@/components/ui/switch';
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
  const [showNavbarInvite, setShowNavbarInvite] = useState(false);
  // First-run onboarding modal — shows over Home until the user completes it.
  const [showOnboarding, setShowOnboarding] = useState(true);
  // When entering the subscription page from an upgrade prompt, open on the change-plan grid.
  const [openToChangePlan, setOpenToChangePlan] = useState(false);
  // Demo: render checkout (payment + order summary) inline as a page or in a modal.
  const [checkoutMode, setCheckoutMode] = useState<'inline' | 'modal'>('modal');
  // Demo: whether App Studio is accessible (shown in the sidebar). Off by default;
  // toggled on via demo controls. While off, the sidebar shows no App Studio menu item.
  const [appStudioEnabled, setAppStudioEnabled] = useState(false);
  const [appStudioEngaged, setAppStudioEngaged] = useState(false);
  // Delivery phase being demoed (P1 = MVP → P4). Gates feature availability; see selectPhase.
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  // The page being customized in the immersive App Builder view (null = closed).
  const [appBuilderPage, setAppBuilderPage] = useState<string | null>(null);
  // Tracks the open contact on the live Customers page so the App Builder canvas can mirror it.
  const [customersSelectedId, setCustomersSelectedId] = useState<string | null>(null);
  // Demo: enables the "Add field with AI" custom-fields experience on detail screens.
  const [aiFieldsEnabled, setAiFieldsEnabled] = useState(false);
  // Demo: emphasize the annual discount with the discounted monthly price on plan cards.
  const [showDiscountedPrice, setShowDiscountedPrice] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState<{ name: string; pct: number } | null>(null);

  const PROMO_DISCOUNTS = [
    { name: 'WELCOME10', pct: 0.10 },
    { name: 'SAVE15', pct: 0.15 },
    { name: 'PARTNER20', pct: 0.20 },
    { name: 'LAUNCH25', pct: 0.25 },
  ];

  const handleDiscountToggle = (on: boolean) => {
    setShowDiscountedPrice(on);
    if (on) {
      const pick = PROMO_DISCOUNTS[Math.floor(Math.random() * PROMO_DISCOUNTS.length)];
      setPromoDiscount(pick);
    } else {
      setPromoDiscount(null);
    }
  };
  // Applications Access deep-link: which user, scrolled to which app they came from.
  const [accessUser, setAccessUser] = useState<string | null>(null);
  const [accessScrollApp, setAccessScrollApp] = useState<string | undefined>(undefined);
  // Draggable position + collapsed state of the demo-controls panel.
  const [demoPos, setDemoPos] = useState<{ x: number; y: number } | null>(null);
  const [demoCollapsed, setDemoCollapsed] = useState(false);
  // Upgrade modal: open from any page without navigating away.
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeTargetPlanId, setUpgradeTargetPlanId] = useState<string | null>(null);
  // Feature flag: folder-based sidebar navigation.
  const [navFoldersEnabled, setNavFoldersEnabled] = useState(false);
  // Help Center (help drawer) — opened from the header or the AI chat panel.
  const [helpOpen, setHelpOpen] = useState(false);
  // Multi-entity: when enabled, account is locked to Scale plan permanently.
  const [multiEntityEnabled, setMultiEntityEnabled] = useState(false);
  const [meFirstRun, setMeFirstRun] = useState(false);

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
  // Shift+/ skips onboarding straight to the home screen.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === '?') setShowOnboarding(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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

  // The active plan tier drives every feature gate via the entitlements matrix.
  // No subscription = trial tier.
  const planTier: PlanTier = (subscription?.planId as PlanTier) ?? 'trial';
  const ent = getEntitlements(planTier);

  // Build-tier ("Your Team, Your Way") multi-user apps. Locked when the active plan
  // doesn't include multi-user apps (Essentials) — clicking routes to the upgrade value moment.
  const premiumApps = ['work-orders', 'time-tracking', 'field-crew', 'jobs', 'schedules', 'inventory'];
  const premiumLocked = !ent.appCustomization;
  const multiEntityLocked = !ent.multiEntity;
  const lockedApps = ent.multiUserApps ? [] : premiumApps;

  // Plan-derived feature defaults with manual override: switching the plan resets each
  // demo toggle to the new tier's default, but the presenter can still flip a toggle
  // afterward (it persists until the next plan switch).
  useEffect(() => {
    // Phase gates feature availability (does it exist yet); plan entitlements gate
    // access within a phase. A feature is on only when its phase is unlocked AND the
    // plan entitles it.
    setAppStudioEnabled(phase >= 2 && ent.appStudioAccess);
    setAiFieldsEnabled(phase >= 1 && ent.aiCustomFields);
    setNavFoldersEnabled(phase >= 2);
    if (phase < 4 || !ent.multiEntity) setMultiEntityEnabled(false);
    // Discounted price is trial-only on every phase (and picks a promo); off on paid plans.
    handleDiscountToggle(planTier === 'trial');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planTier, phase]);

  const nextPlanId = subscription ? getNextPlanId(subscription.planId) : null;

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
    'marketplace': 'App Library',
    'applications-access': 'Account Settings',
    'subscription': 'Subscription',
    'account-settings': 'Account Settings',
    'users': 'Users',
    'multi-entity': 'Multi-entity Management',
    'app-routines': 'App Routines',
    'integrations': 'Integrations',
    'integrations-api': 'API & Integrations',
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
    'home', 'subscription', 'account-settings', 'users', 'marketplace', 'applications-access', 'app-studio', 'multi-entity', 'app-routines', 'integrations', 'integrations-api',
  ];

  const handlePageNavigation = (page: string) => {
    if (page === 'home') {
      navigateToHome();
    } else if (page === 'customers') {
      navigateToCustomers();
    } else if (page === 'estimates') {
      navigateToEstimates();
    } else if (page === 'subscription-upgrade') {
      openUpgradeModal();
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

  // Switch the demoed delivery phase. The entitlements effect (keyed on `phase`)
  // turns AI fields / App Studio / nav folders / discounting on or off per phase;
  // here we handle the side effects that the effect can't express on its own.
  const selectPhase = (n: 1 | 2 | 3 | 4) => {
    setPhase(n);
    if (n >= 4) {
      // Multi-entity requires Scale, so entering P4 forces the Scale plan + enables it.
      setMultiEntityEnabled(true);
      setSubscription({ planId: 'scale', billingCycle: 'annual', cardLast4: subscription?.cardLast4 ?? '4242' });
    } else {
      setMultiEntityEnabled(false);
    }
    // App Studio / App Builder don't exist below P2 — close them if open.
    if (n < 2) {
      setAppBuilderPage(null);
      if (currentPage === 'app-studio') navigateToHome();
    }
  };

  const [upgradeModalView, setUpgradeModalView] = useState<'quick' | 'full'>('quick');
  const [upgradeOpenToBilling, setUpgradeOpenToBilling] = useState(false);

  const openUpgradeModal = (planId?: string) => {
    setUpgradeTargetPlanId(planId ?? null);
    setUpgradeModalView(planId ? 'quick' : 'full');
    setUpgradeOpenToBilling(false);
    setUpgradeModalOpen(true);
  };

  // If demo controls advance the plan past the stored upgrade target, auto-advance
  // the target so the modal always shows the next meaningful upgrade step.
  const effectiveUpgradeTarget = (() => {
    if (!upgradeTargetPlanId) return null;
    if (!subscription) return upgradeTargetPlanId;
    const currentIdx = PLAN_ORDER.indexOf(subscription.planId as typeof PLAN_ORDER[number]);
    const targetIdx = PLAN_ORDER.indexOf(upgradeTargetPlanId as typeof PLAN_ORDER[number]);
    if (targetIdx <= currentIdx) return getNextPlanId(subscription.planId);
    return upgradeTargetPlanId;
  })();

  return (
    <AIFieldsProvider
      enabled={aiFieldsEnabled}
      // "Customize in App Builder" is hidden on Essentials (App Builder is a premium tier).
      // On other plans it opens the immersive App Builder view for the current screen.
      onOpenAppBuilder={premiumLocked ? undefined : () => setAppBuilderPage(currentPage)}
    >
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
          navFoldersEnabled={navFoldersEnabled}
        />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          currentPageLabel={isLocked ? 'Subscription' : pageLabels[currentPage] || 'Home'}
          isAppScreen={!isLocked && !nonAppScreens.includes(currentPage)}
          onNavigate={handlePageNavigation}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onInviteUser={() => setShowNavbarInvite(true)}
          onOpenHelp={() => setHelpOpen(true)}
          isLocked={isLocked}
        />

        {/* Page + chat panel share a row below the top bar */}
        <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">

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
            discountName={promoDiscount?.name}
            discountPct={promoDiscount?.pct}
            multiEntityEnabled={multiEntityEnabled}
            onUpgrade={openUpgradeModal}
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
            onScheduleDowngrade={(planId, effectiveDate) => {
              // Keep the current plan active; record the scheduled downgrade for the banner.
              if (subscription) {
                setSubscription({ ...subscription, scheduledDowngrade: { planId, effectiveDate } });
              }
            }}
            onCancelDowngrade={() => {
              if (subscription) {
                setSubscription({ ...subscription, scheduledDowngrade: undefined });
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
            onUpgrade={() => openUpgradeModal(nextPlanId ?? undefined)}
          />
        ) : currentPage === 'app-studio' && appStudioEnabled ? (
          <AppStudioPage
            userName={adminUserName}
            locked={premiumLocked}
            onUpgrade={() => openUpgradeModal(nextPlanId ?? undefined)}
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
            lockedApps={lockedApps}
            onOpenApp={(lockKey) => setCurrentPage(lockKey)}
            onUpgrade={() => openUpgradeModal(nextPlanId ?? undefined)}
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
            appStudioEnabled={appStudioEnabled}
            appStudioEngaged={appStudioEngaged}
            onOpenApp={(page) => setCurrentPage(page)}
            onUpgrade={openUpgradeModal}
            onNavigateToAppStudio={() => { setAppStudioEngaged(true); setCurrentPage('app-studio'); }}
          />
        ) : currentPage === 'customers' || currentPage === 'contacts' ? (
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <CustomersPage initialFilter={customersFilter} onSelectedCustomerChange={setCustomersSelectedId} />
          </div>
        ) : currentPage === 'estimates' ? (
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <EstimatesPage initialFilter={estimatesFilter} />
          </div>
        ) : currentPage === 'users' ? (
          <UserManagementPage
            subscription={subscription}
            teamSize={teamSize}
            onNavigate={handlePageNavigation}
            onBack={() => setCurrentPage('account-settings')}
            isTrial={isInTrial && !subscription}
            onUpgrade={(planId) => openUpgradeModal(planId ?? undefined)}
            multiEntityEnabled={multiEntityEnabled}
          />
        ) : currentPage === 'multi-entity' ? (
          multiEntityEnabled ? (
            <MultiEntityPage
              onBack={() => setCurrentPage('account-settings')}
              onNavigate={handlePageNavigation}
              firstRun={meFirstRun}
              onFirstRunDismissed={() => setMeFirstRun(false)}
            />
          ) : (
            <MultiEntitySetupPage
              subscription={subscription}
              onBack={() => setCurrentPage('account-settings')}
              onUpgrade={(planId) => openUpgradeModal(planId)}
              onEnableMultiEntity={() => {
                setMultiEntityEnabled(true);
                setMeFirstRun(true);
                setSubscription({ planId: 'scale', billingCycle: 'annual', cardLast4: subscription?.cardLast4 ?? '4242' });
              }}
            />
          )
        ) : currentPage === 'app-routines' ? (
          <UpgradeRequiredPage
            page="app-routines"
            onUpgrade={() => openUpgradeModal(nextPlanId ?? undefined)}
            onBack={() => setCurrentPage('account-settings')}
          />
        ) : currentPage === 'integrations' ? (
          <IntegrationsPage
            onBack={navigateToHome}
            upgradeRequired={!ent.apiAccess}
            onNavigate={handlePageNavigation}
          />
        ) : currentPage === 'integrations-api' ? (
          <UpgradeRequiredPage
            page="integrations-api"
            onUpgrade={() => openUpgradeModal(nextPlanId ?? undefined)}
            onBack={() => setCurrentPage('integrations')}
          />
        ) : currentPage === 'account-settings' ? (
          <AccountSettingsPage
            onBack={navigateToHome}
            onNavigate={handlePageNavigation}
            upgradeRequired={premiumLocked}
            multiEntityUpgradeRequired={multiEntityLocked && !multiEntityEnabled}
            multiEntityEnabled={multiEntityEnabled}
            onUpgrade={() => {
              setOpenToChangePlan(true);
              setCurrentPage('subscription');
            }}
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

        {/* Make the Customize launcher available on app screens — including locked premium
            apps (shows upsell) and empty-state apps (shows create-first prompt). */}
        {!isLocked &&
          !nonAppScreens.includes(currentPage) &&
          !['customers', 'contacts'].includes(currentPage) && (
            <FieldSurfaceRegistrar
              entityType={currentPage}
              entityLabel={pageLabels[currentPage] || 'Records'}
            />
          )}

        {/* Add-field chat panel — sits below the top bar, beside the page */}
        <AddFieldChatPanel
          onOpenAppBuilder={() => setAppBuilderPage(currentPage)}
          appBuilderLocked={premiumLocked}
          appState={
            premiumLocked && premiumApps.includes(currentPage)
              ? 'locked'
              : shouldShowEmptyState
              ? 'empty'
              : 'normal'
          }
          onUpgrade={() => {
            setOpenToChangePlan(true);
            setCurrentPage('subscription');
          }}
          onOpenHelpCenter={() => setHelpOpen(true)}
        />
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
          {/* Delivery phase — gates which features exist. P1 = MVP → P4 = everything.
              Selecting a phase enables its features and locks later-phase toggles. */}
          <div>
            <p className="mb-1 text-gray-500">Phase (feature set)</p>
            <div className="grid grid-cols-4 gap-1">
              {([
                { label: 'P1', n: 1 as const },
                { label: 'P2', n: 2 as const },
                { label: 'P3', n: 3 as const },
                { label: 'P4', n: 4 as const },
              ]).map((opt) => (
                <button
                  key={opt.n}
                  onClick={() => selectPhase(opt.n)}
                  title={opt.n === 1 ? 'MVP' : `Phase ${opt.n}`}
                  className={`rounded border px-2 py-1 transition-colors ${
                    phase === opt.n
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="mt-1 text-[10px] text-gray-400">P1 = MVP. Later phases unlock more features.</p>
          </div>
          {/* Unified plan switch — drives every feature gate via the entitlements matrix.
              Selecting Trial drops the subscription back to the trial-active state. */}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="mb-1 text-gray-500">Plan (drives features)</p>
            <div className="grid grid-cols-2 gap-1">
              {([
                { label: 'Trial', id: 'trial' },
                { label: 'Essentials', id: 'essentials' },
                { label: 'Build', id: 'build' },
                { label: 'Scale', id: 'scale' },
              ] as const).map((opt) => {
                const active = planTier === opt.id;
                // Multi-entity permanently locks the account to Scale until disabled.
                const meLocked = multiEntityEnabled && opt.id !== 'scale';
                return (
                  <div key={opt.id} className="relative group">
                    <button
                      onClick={() => {
                        if (meLocked) return;
                        if (opt.id === 'trial') {
                          setSubscription(null);
                          if (trialDaysLeft === 0) setTrialDaysLeft(10);
                          setShowTrialBanner(true);
                          setTrialCanceled(false);
                        } else {
                          setSubscription({ planId: opt.id, billingCycle: 'annual', cardLast4: subscription?.cardLast4 ?? '4242' });
                          setShowTrialBanner(false);
                        }
                      }}
                      disabled={meLocked}
                      className={`w-full rounded border px-2 py-1 transition-colors ${
                        active
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : meLocked
                          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                    {meLocked && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Multi-entity locks your account to Scale. Disable multi-entity first to switch plans.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Trial length is only relevant while on the trial tier */}
          {planTier === 'trial' && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="mb-1 text-gray-500">Trial length</p>
              <div className="flex gap-1">
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
          {/* Checkout mode toggle hidden from demo — defaulting to modal.
              To restore: uncomment this block and remove the useState default above.
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
          */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
            <span className={phase < 2 ? 'text-gray-300' : 'text-gray-500'}>
              App Studio access
              <span className="ml-1 rounded bg-gray-100 px-1 text-[9px] font-medium text-gray-400">P2</span>
            </span>
            <Switch
              disabled={phase < 2}
              checked={appStudioEnabled}
              onCheckedChange={(v) => {
                setAppStudioEnabled(v);
                // If we're turning it off while viewing it, step back to Home.
                if (!v && currentPage === 'app-studio') navigateToHome();
              }}
            />
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
            <span className="text-gray-500">
              AI custom fields
              <span className="ml-1 rounded bg-gray-100 px-1 text-[9px] font-medium text-gray-400">P1</span>
            </span>
            <Switch checked={aiFieldsEnabled} onCheckedChange={setAiFieldsEnabled} />
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
            <span className={planTier !== 'trial' ? 'text-gray-300' : 'text-gray-500'}>
              Discounted price
              <span className="ml-1 rounded bg-gray-100 px-1 text-[9px] font-medium text-gray-400">Trial</span>
            </span>
            <Switch disabled={planTier !== 'trial'} checked={showDiscountedPrice} onCheckedChange={handleDiscountToggle} />
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
            <span className={phase < 2 ? 'text-gray-300' : 'text-gray-500'}>
              Nav folders
              <span className="ml-1 rounded bg-gray-100 px-1 text-[9px] font-medium text-gray-400">P2</span>
            </span>
            <Switch disabled={phase < 2} checked={navFoldersEnabled} onCheckedChange={setNavFoldersEnabled} />
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
            <span className={phase < 4 ? 'text-gray-300' : 'text-gray-500'}>
              Multi-entity
              <span className="ml-1 rounded bg-gray-100 px-1 text-[9px] font-medium text-gray-400">P4</span>
            </span>
            <Switch
              disabled={phase < 4}
              checked={multiEntityEnabled}
              onCheckedChange={(v) => {
                setMultiEntityEnabled(v);
                if (v) {
                  setSubscription({ planId: 'scale', billingCycle: 'annual', cardLast4: subscription?.cardLast4 ?? '4242' });
                }
              }}
            />
          </div>
          <div className="border-t border-gray-100 pt-2 mt-2">
            <button
              onClick={() => window.location.reload()}
              className="font-medium text-blue-600 hover:underline"
            >
              Reset prototype
            </button>
          </div>
            </>
          )}
        </div>
      )}

      {/* Upgrade modal — opens on top of any page without navigating away */}
      {upgradeModalOpen && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-8"
          onClick={(e) => { if (e.target === e.currentTarget) setUpgradeModalOpen(false); }}
        >
          {upgradeModalView === 'quick' && effectiveUpgradeTarget ? (
            <QuickUpgradeModal
              targetPlanId={effectiveUpgradeTarget}
              isChangingPlan={!!subscription}
              currentCardLast4={subscription?.cardLast4}
              onClose={() => setUpgradeModalOpen(false)}
              onViewAllPlans={() => setUpgradeModalView('full')}
              onUpdateBilling={() => {
                setUpgradeOpenToBilling(true);
                setUpgradeModalView('full');
              }}
              onSubscribed={(sub) => {
                setSubscription(sub);
                setShowTrialBanner(false);
                setUpgradeModalOpen(false);
              }}
            />
          ) : (
            <div className="bg-gray-50 rounded-2xl overflow-hidden flex flex-col w-full max-w-4xl shadow-2xl" style={{ maxHeight: '90vh' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                <h2 className="text-sm font-semibold text-gray-700">
                  {effectiveUpgradeTarget ? 'Upgrade your plan' : 'Change your plan'}
                </h2>
                <button onClick={() => setUpgradeModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                <SubscriptionPage
                  key={`${subscription?.planId ?? 'trial'}-${effectiveUpgradeTarget ?? 'none'}`}
                  activeSubscription={subscription}
                  isInTrial={isInTrial}
                  trialEndLabel={trialEndLabel}
                  teamSize={teamSize}
                  checkoutMode="inline"
                  upgradeFromPlanId={effectiveUpgradeTarget ?? undefined}
                  initialStep={upgradeOpenToBilling ? 'billing' : !effectiveUpgradeTarget && subscription ? 'plans' : undefined}
                  hasAppStudioAccess={appStudioEnabled}
                  showDiscountedPrice={showDiscountedPrice}
                  discountName={promoDiscount?.name}
                  discountPct={promoDiscount?.pct}
                  multiEntityEnabled={multiEntityEnabled}
                  onBack={() => setUpgradeModalOpen(false)}
                  onSubscribed={(sub) => {
                    setSubscription(sub);
                    setShowTrialBanner(false);
                    setUpgradeModalOpen(false);
                  }}
                  onCancel={() => {
                    if (subscription) setSubscription({ ...subscription, cancelAtPeriodEnd: true });
                    else setTrialCanceled(true);
                  }}
                  onScheduleDowngrade={(planId, effectiveDate) => {
                    if (subscription) setSubscription({ ...subscription, scheduledDowngrade: { planId, effectiveDate } });
                  }}
                  onCancelDowngrade={() => {
                    if (subscription) setSubscription({ ...subscription, scheduledDowngrade: undefined });
                  }}
                  onResume={() => {
                    if (subscription) setSubscription({ ...subscription, cancelAtPeriodEnd: false });
                    else setTrialCanceled(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navbar invite modal — same as the full InviteModal on the Users page */}
      {showNavbarInvite && (() => {
        const navTeamUsers = ALL_MOCK_USERS.slice(0, Math.min(teamSize, ALL_MOCK_USERS.length));
        const navFullSeatsUsed = navTeamUsers.filter(u => ROLE_SEAT_TYPE[u.role] === 'full').length;
        const navFieldCrew = navTeamUsers.filter(u => ROLE_SEAT_TYPE[u.role] === 'field-crew').length;
        const navIncludedSeats = subscription ? (PLAN_SEATS[subscription.planId] ?? 1) : 999;
        const navSeatsAvailable = (isInTrial && !subscription) ? 999 : Math.max(0, navIncludedSeats - navFullSeatsUsed - navFieldCrew);
        return (
          <InviteModal
            subscription={subscription}
            isTrial={isInTrial && !subscription}
            seatsAvailable={navSeatsAvailable}
            onNavigate={handlePageNavigation}
            onClose={() => setShowNavbarInvite(false)}
          />
        );
      })()}

      {/* First-run onboarding — modal over Home, blocks the app until completed */}
      {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}

      {/* Help Center drawer — opened from the header or the AI chat panel */}
      <HelpDrawer isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Immersive App Builder view — opened from "Customize in App Builder".
          Full-screen overlay (hides the sidebar, top header and value-prop banner);
          the center canvas renders the runtime screen the user was customizing. */}
      {appBuilderPage && (
        <AppBuilderView
          appName={pageLabels[appBuilderPage] || 'App'}
          screenName="List view"
          onExit={() => setAppBuilderPage(null)}
        >
          <div className="p-3 sm:p-6">
            {appBuilderPage === 'estimates' ? (
              <EstimatesPage hideBanner />
            ) : appBuilderPage === 'customers' || appBuilderPage === 'contacts' ? (
              // Mirror the live page's view (list or a specific contact's detail). No
              // onSelectedCustomerChange here — the canvas is a read-only mirror.
              <CustomersPage embedded hideBanner initialSelectedCustomerId={customersSelectedId ?? undefined} />
            ) : (
              <EmptyStatePage page={appBuilderPage} showBanner={false} showSampleData />
            )}
          </div>
        </AppBuilderView>
      )}
    </div>
    </AIFieldsProvider>
  );
}

export default App;
