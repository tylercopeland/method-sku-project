import { WelcomeBanner } from '@/components/WelcomeBanner';
import { ChecklistPanel } from '@/components/ChecklistPanel';
import { QuickLinksBar } from '@/components/QuickLinksBar';

interface GeneralUserDashboardProps {
  userName: string;
}

export function GeneralUserDashboard({ userName }: GeneralUserDashboardProps) {
  return (
    <main className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 overflow-y-auto">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Banner with Integrated Insights and Videos */}
        <div className="mb-8">
          <WelcomeBanner userName={userName} />
        </div>

        {/* Main Content Grid - My Tasks and Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* My Tasks - 2/3 width */}
          <div className="lg:col-span-3">
            <ChecklistPanel />
          </div>

          {/* Quick Links - 1/3 width */}
          <div className="lg:col-span-1">
            <QuickLinksBar />
          </div>
        </div>
      </div>
    </main>
  );
}