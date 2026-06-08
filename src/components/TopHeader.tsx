import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Bell, Settings, Lightbulb, Menu } from 'lucide-react';
import { HelpDrawer } from '@/components/HelpDrawer';
import { useState } from 'react';

interface TopHeaderProps {
  currentPageLabel?: string;
  onNavigate?: (page: string) => void;
  currentStyle?: string;
  onStyleChange?: (style: string) => void;
  onMobileMenuToggle?: () => void;
}

export function TopHeader({ currentPageLabel = 'Home', onNavigate, currentStyle = 'appcues', onStyleChange, onMobileMenuToggle }: TopHeaderProps) {
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

            {/* Search - hidden on mobile */}
            <div className="hidden md:block max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>

            {/* Style Selector - hidden on mobile */}
            <div className="hidden lg:block">
              <Select value={currentStyle} onValueChange={onStyleChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-xs text-gray-400 font-normal">Direction</SelectLabel>
                    <SelectItem value="banner-demo">Banner + Demo CTA</SelectItem>
                    <SelectItem value="appcues-direction">Single Banner</SelectItem>
                    <SelectItem value="recommendations-direction">Recommendations - Option 1</SelectItem>
                    <SelectItem value="recommendations-direction-2">Recommendations - Option 2</SelectItem>
                    <SelectItem value="recommendations-direction-3">Recommendations - Option 3</SelectItem>
                    <SelectItem value="recommendations-direction-4">Recommendations - Option 4</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel className="text-xs text-gray-400 font-normal">Sandbox</SelectLabel>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="single-banner">Single Banner Steps</SelectItem>
                    <SelectItem value="fullscreen">Fullscreen</SelectItem>
                    <SelectItem value="recommendations">Recommendations</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative p-2 sm:p-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  4
                </Badge>
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

            {/* Settings - hidden on mobile */}
            <Button variant="ghost" size="sm" className="hidden sm:flex p-2">
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>

            {/* User Avatar */}
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
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
