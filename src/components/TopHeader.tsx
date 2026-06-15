import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, Settings, Lightbulb, Menu, CircleUser, Share2, Contact, LogOut } from 'lucide-react';
import { HelpDrawer } from '@/components/HelpDrawer';
import { GlobalAddFieldButton } from '@/lib/ai-fields';
import { useState } from 'react';

interface TopHeaderProps {
  currentPageLabel?: string;
  onNavigate?: (page: string) => void;
  onMobileMenuToggle?: () => void;
}

export function TopHeader({ currentPageLabel = 'Home', onNavigate, onMobileMenuToggle }: TopHeaderProps) {
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-3">
          {/* Left side - Mobile menu + Page title + Search + Style selector */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </Button>

            {/* Page title */}
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {currentPageLabel}
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Universal "Add field with AI" launcher — context-aware, any screen */}
            <GlobalAddFieldButton />

            {/* Search */}
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="w-5 h-5 text-gray-600" />
            </Button>

            {/* Quick create */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative p-2 sm:p-2">
                <Plus className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Help - hidden on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHelpDrawerOpen(true)}
              className="hidden sm:flex p-2"
            >
              <Lightbulb className="w-5 h-5 text-gray-600" />
            </Button>

            {/* User Avatar + Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2">
                  <Avatar className="w-9 h-9 ring-2 ring-blue-400 cursor-pointer">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                      TC
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8} className="w-72 p-0">
                {/* Account header */}
                <div className="flex items-center gap-3 px-4 py-4">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      TC
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">Tylerr Copeland</p>
                    <p className="text-sm text-gray-500 truncate">m11GlicksmanGlickLa…</p>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-0" />

                {/* Menu items */}
                <div className="py-2">
                  <DropdownMenuItem className="px-4 py-2.5 text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer">
                    <CircleUser className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-base">User Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate?.('account-settings')}
                    className="px-4 py-2.5 text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer"
                  >
                    <Settings className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-base">Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer">
                    <Share2 className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-base">Integrations</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer">
                    <Contact className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-base">Switch Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer">
                    <LogOut className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-base">Sign Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Help Drawer */}
      <HelpDrawer
        isOpen={isHelpDrawerOpen}
        onClose={() => setIsHelpDrawerOpen(false)}
      />
    </>
  );
}
