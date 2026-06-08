import { WelcomeBanner } from '@/components/WelcomeBanner';
import { ChecklistPanel } from '@/components/ChecklistPanel';
import { QuickLinksBar } from '@/components/QuickLinksBar';

interface AdminDashboardProps {
  userName: string;
  onNavigateToEstimates: (filter?: string) => void;
  onNavigateToCustomers: (filter?: string) => void;
}

export function AdminDashboard({ userName, onNavigateToEstimates, onNavigateToCustomers }: AdminDashboardProps) {
  return (
    <main className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 overflow-y-auto">
      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Welcome Banner with Integrated Insights and Videos */}
        <div className="mb-4 sm:mb-8">
          <WelcomeBanner
            userName={userName}
            onNavigateToEstimates={onNavigateToEstimates}
            onNavigateToCustomers={onNavigateToCustomers}
          />
        </div>

        {/* Main Content Grid - My Tasks and Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mb-4 sm:mb-8">
          {/* My Tasks / Todos - 3/4 width */}
          <div className="lg:col-span-3">
            <ChecklistPanel defaultFilter="activities" />
          </div>

          {/* Quick Links - 1/4 width */}
          <div className="lg:col-span-1">
            <QuickLinksBar />
          </div>
        </div>
      </div>
    </main>
  );
}
