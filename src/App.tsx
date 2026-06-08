import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { AdminDashboard } from '@/components/AdminDashboard';
import { EstimatesPage } from '@/components/EstimatesPage';
import { CustomersPage } from '@/components/CustomersPage';
import { EmptyStatePage } from '@/components/EmptyStatePage';
import { GettingStartedPage } from '@/components/GettingStartedPage';
import { SubscriptionPage } from '@/components/SubscriptionPage';
import { IntercomBubble } from '@/components/IntercomBubble';
import { AppcuesChecklist } from '@/components/AppcuesChecklist';
import { FullscreenChecklist } from '@/components/FullscreenChecklist';
import { useState, useEffect } from 'react';
import { Agentation } from 'agentation';
import { X } from 'lucide-react';

function App() {
  // In a real app, this would come from authentication/user context
  const adminUserName = 'Paul';
  const [currentPage, setCurrentPage] = useState('home');
  const [estimatesFilter, setEstimatesFilter] = useState<string | undefined>(undefined);
  const [customersFilter, setCustomersFilter] = useState<string | undefined>(undefined);
  const [currentStyle, setCurrentStyle] = useState('appcues-direction');
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const trialDaysLeft = 7; // Demo value

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
    'getting-started': 'Getting Started',
    'onboarding': 'Onboarding',
    'subscription': 'Subscription',
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
    } else if (page === 'onboarding') {
      setCurrentPage('onboarding');
      setCurrentStyle('fullscreen');
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

  const handleStyleChange = (style: string) => {
    setCurrentStyle(style);
    if (style === 'fullscreen') {
      setCurrentPage('onboarding');
    } else if (currentPage === 'onboarding') {
      setCurrentPage('home');
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Trial Banner */}
      {showTrialBanner && !isSubscribed && (
        <div className="bg-blue-600 text-white px-4 sm:px-4 py-2 flex items-center justify-center relative flex-shrink-0">
          <span className="text-xs sm:text-sm font-medium text-center pr-6 sm:pr-0">
            <span className="hidden sm:inline">{trialDaysLeft} days left in your trial. </span>
            <span className="sm:hidden">{trialDaysLeft} days left. </span>
            <button
              onClick={() => setCurrentPage('subscription')}
              className="underline hover:no-underline font-semibold"
            >
              Subscribe now
            </button>
          </span>
          <button
            onClick={() => setShowTrialBanner(false)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handlePageNavigation}
          currentStyle={currentStyle}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <TopHeader
          currentPageLabel={pageLabels[currentPage] || 'Home'}
          onNavigate={handlePageNavigation}
          currentStyle={currentStyle}
          onStyleChange={handleStyleChange}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Render different pages based on current page */}
        {(currentPage === 'home' && currentStyle === 'fullscreen') || currentPage === 'onboarding' ? (
          <FullscreenChecklist />
        ) : currentPage === 'home' ? (
          <AdminDashboard
            userName={adminUserName}
            onNavigateToEstimates={navigateToEstimates}
            onNavigateToCustomers={navigateToCustomers}
            bannerStyle={currentStyle as 'appcues' | 'appcues-direction' | 'banner' | 'banner-demo' | 'todos' | 'recommendations-direction' | 'recommendations-direction-2' | 'recommendations-direction-3' | 'recommendations-direction-4'}
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
            onSubscribed={() => {
              setIsSubscribed(true);
              setShowTrialBanner(false);
            }}
          />
        ) : currentPage === 'getting-started' ? (
          <GettingStartedPage />
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

      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
    </div>
  );
}

export default App;
