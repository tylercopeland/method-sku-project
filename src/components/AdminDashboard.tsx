import { WelcomeBanner } from '@/components/WelcomeBanner';
import { ChecklistPanel } from '@/components/ChecklistPanel';
import { QuickLinksBar } from '@/components/QuickLinksBar';
import { AppsGrid } from '@/components/AppsGrid';
import { useState } from 'react';
import { TrendingUp, BarChart2, PieChart } from 'lucide-react';

interface AdminDashboardProps {
  userName: string;
  onNavigateToEstimates: (filter?: string) => void;
  onNavigateToCustomers: (filter?: string) => void;
  lockedApps?: string[];
  onOpenApp?: (lockKey: string) => void;
  onUpgrade?: () => void;
  appStudioEnabled?: boolean;
}

const dashboardTabs = [
  { id: 'home', label: 'Home' },
  { id: 'apps', label: 'Apps' },
  { id: 'insights', label: 'Insights', beta: true },
];

export function AdminDashboard({ userName, onNavigateToEstimates, onNavigateToCustomers, lockedApps = [], onOpenApp, onUpgrade, appStudioEnabled = false }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <main className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 overflow-y-auto">
      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
          {dashboardTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 pb-2 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.beta && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  beta
                </span>
              )}
              {activeTab === tab.id && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'apps' ? (
          <AppsGrid lockedApps={lockedApps} onOpenApp={onOpenApp} onUpgrade={onUpgrade} appStudioEnabled={appStudioEnabled} />
        ) : activeTab === 'insights' ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-blue-500" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <PieChart className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Insights coming soon</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Revenue trends, activity summaries, and pipeline analytics — all in one place. You're in the early access group.
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </main>
  );
}
