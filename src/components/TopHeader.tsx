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
  ChevronDown, UserPlus, X, Check,
} from 'lucide-react';
import { HelpDrawer } from '@/components/HelpDrawer';
import { GlobalAddFieldButton } from '@/lib/ai-fields';
import { GlobalSearch } from '@/components/GlobalSearch';
import { useState } from 'react';

interface TopHeaderProps {
  currentPageLabel?: string;
  isAppScreen?: boolean;
  onNavigate?: (page: string) => void;
  onMobileMenuToggle?: () => void;
}

// ── Quick Invite Modal ─────────────────────────────────────────────────────────

const ROLES = ['Admin', 'Customizer', 'Regular', 'Field Crew', 'View-only'] as const;

function QuickInviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('Regular');
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!email.trim()) return;
    setSent(true);
    setTimeout(onClose, 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px]">
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Invite a team member</h2>
            <p className="text-sm text-gray-500 mt-0.5">They'll receive an email to join your account.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pb-7 space-y-4">
          {sent ? (
            <div className="flex flex-col items-center py-4 gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-800">Invite sent to <span className="text-blue-600">{email}</span></p>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  placeholder="colleague@company.com"
                  autoFocus
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {!sent && (
          <div className="bg-gray-50 border-t border-gray-100 px-7 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!email.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <UserPlus className="w-4 h-4" /> Send invite
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Top Header ─────────────────────────────────────────────────────────────────

export function TopHeader({ currentPageLabel = 'Home', isAppScreen = false, onNavigate, onMobileMenuToggle }: TopHeaderProps) {
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

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
                    <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate max-w-[160px]">
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
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate max-w-[200px]">
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

            {/* Invite user shortcut */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInviteOpen(true)}
              className="p-2"
              title="Invite team member"
            >
              <UserPlus className="w-5 h-5 text-gray-600" />
            </Button>

            {/* Help */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHelpDrawerOpen(true)}
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

      <HelpDrawer isOpen={isHelpDrawerOpen} onClose={() => setIsHelpDrawerOpen(false)} />
      {inviteOpen && <QuickInviteModal onClose={() => setInviteOpen(false)} />}
    </>
  );
}
