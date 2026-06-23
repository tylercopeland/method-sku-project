import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus, Settings, Lightbulb, Menu, CircleUser, Share2, Contact, LogOut,
  ChevronDown, UserPlus,
} from 'lucide-react';
import { GlobalAddFieldButton } from '@/lib/ai-fields';
import { GlobalSearch } from '@/components/GlobalSearch';

interface TopHeaderProps {
  currentPageLabel?: string;
  isAppScreen?: boolean;
  onNavigate?: (page: string) => void;
  onMobileMenuToggle?: () => void;
  onInviteUser?: () => void;
  /** Open the Help Center (help drawer), now owned by App. */
  onOpenHelp?: () => void;
  isLocked?: boolean;
}

export function TopHeader({ currentPageLabel = 'Home', isAppScreen = false, onNavigate, onMobileMenuToggle, onInviteUser, onOpenHelp, isLocked = false }: TopHeaderProps) {
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-3 sm:px-5 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">

          {/* Left: mobile menu + page title */}
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </Button>

            {isAppScreen ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group flex items-center gap-1.5 focus:outline-none">
                    <h1 className="text-base sm:text-lg font-semibold text-gray-900 whitespace-nowrap">
                      {currentPageLabel}
                    </h1>
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={8} className="w-56 py-1.5">
                  <DropdownMenuItem className="px-4 py-2.5 text-base text-gray-900 cursor-pointer">
                    Manage App
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 text-base text-gray-900 cursor-pointer">
                    Customize Screen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 whitespace-nowrap">
                {currentPageLabel}
              </h1>
            )}

            <GlobalAddFieldButton />
          </div>

          {/* Center: global search — hidden on small screens */}
          <div className="flex-1 hidden md:flex justify-center min-w-0 px-2">
            <GlobalSearch onNavigate={onNavigate} />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* Quick add */}
            <Button variant="ghost" size="sm" className="p-2">
              <Plus className="w-5 h-5 text-gray-600" />
            </Button>

            {/* Invite user shortcut — hidden when trial has expired */}
            {!isLocked && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onInviteUser?.()}
                className="p-2"
                title="Invite team member"
              >
                <UserPlus className="w-5 h-5 text-gray-600" />
              </Button>
            )}

            {/* Help */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenHelp?.()}
              className="hidden sm:flex p-2"
            >
              <Lightbulb className="w-5 h-5 text-gray-600" />
            </Button>

            {/* Avatar */}
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
                  <DropdownMenuItem
                    onClick={() => onNavigate?.('integrations')}
                    className="px-4 py-2.5 text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer"
                  >
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
    </>
  );
}
