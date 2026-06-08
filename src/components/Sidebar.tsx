import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  Users,
  FileText,
  Lightbulb,
  List,
  Receipt,
  ClipboardList,
  Lock,
  Layers,
  Store,
  ChevronLeft,
  ChevronDown,
  Rocket
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentStyle?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ currentPage, onNavigate, currentStyle = 'appcues', isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMoreAppsOpen, setIsMoreAppsOpen] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onMobileClose?.();
  };

  const allNavigationItems = [
    { icon: Rocket, label: 'Onboarding', page: 'onboarding', fullscreenOnly: true },
    { icon: LayoutGrid, label: 'Home', page: 'home' },
    { icon: Users, label: 'Customers & Leads', page: 'customers' },
    { icon: FileText, label: 'Activities', page: 'activities' },
    { icon: Users, label: 'Vendors', page: 'vendors' },
    { icon: Lightbulb, label: 'Opportunities', page: 'opportunities' },
    { icon: List, label: 'Web to Lead', page: 'web-to-lead' },
    { icon: Receipt, label: 'Invoices', page: 'invoices' },
    { icon: ClipboardList, label: 'Estimates', page: 'estimates' },
    { icon: List, label: 'Sales Receipts', page: 'sales-receipts' },
    { icon: Lock, label: 'Payments', page: 'payments' },
  ];

  const navigationItems = allNavigationItems.filter(item =>
    !item.fullscreenOnly || currentStyle === 'fullscreen'
  );

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <div className={`
        bg-[#1e3a8a] text-white transition-all duration-300 flex flex-col flex-shrink-0
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        fixed lg:relative inset-y-0 left-0 z-50
        w-64
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Header */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg">method</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isMobileOpen ? onMobileClose?.() : setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-blue-700 p-1 hidden lg:flex"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => handleNavigate(item.page)}
              className={`w-full justify-start text-left p-3 h-auto ${
                currentPage === item.page
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span className="ml-3">{item.label}</span>}
            </Button>
          ))}
        </div>

        {/* More Apps */}
        <div className="mt-4">
          {isCollapsed && !isMobileOpen ? (
            <Button
              variant="ghost"
              className="w-full justify-center text-left p-3 h-auto text-blue-100 hover:bg-blue-700 hover:text-white"
            >
              <Layers className="w-5 h-5 flex-shrink-0" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setIsMoreAppsOpen(!isMoreAppsOpen)}
                className="w-full justify-between text-left p-3 h-auto text-blue-100 hover:bg-blue-700 hover:text-white"
              >
                <div className="flex items-center">
                  <Layers className="w-5 h-5 flex-shrink-0" />
                  <span className="ml-3">More Apps</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isMoreAppsOpen ? 'rotate-180' : ''}`} />
              </Button>
              {isMoreAppsOpen && (
                <div className="ml-8 mt-2 space-y-1">
                  {/* Additional apps can be added here */}
                </div>
              )}
            </>
          )}
        </div>

        {/* App Marketplace */}
        <div className="mt-8 pt-8 border-t border-blue-700">
          <Button
            variant="ghost"
            onClick={() => handleNavigate('marketplace')}
            className="w-full justify-start text-left p-3 h-auto text-blue-100 hover:bg-blue-700 hover:text-white"
          >
            <Store className="w-5 h-5 flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span className="ml-3">App Marketplace</span>}
          </Button>
        </div>
      </nav>

      {/* Collapse indicator - desktop only */}
      {isCollapsed && !isMobileOpen && (
        <div className="p-2 text-center hidden lg:block">
          <span className="text-xs text-blue-300">collapse</span>
        </div>
      )}
    </div>
    </>
  );
}