import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Play, Search, MessageCircle, X, FileText, BookOpen } from 'lucide-react';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDrawer({ isOpen, onClose }: HelpDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0 overflow-y-auto shadow-xl border-l border-gray-200">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold text-gray-900">Help & Support</SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 px-6 py-6 space-y-6">
            {/* Search at the top */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search Help Center"
                className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Welcome Video */}
            <div className="space-y-3">
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              </div>
              
              {/* Video content outside thumbnail */}
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-gray-900">Welcome to Method</h3>
                <p className="text-sm text-gray-600">Get started with the basics</p>
                <p className="text-xs text-gray-500">Duration: 3:45</p>
              </div>
            </div>

            {/* Related Articles */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900">Related Articles</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      Get Started - Suggested Reading
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      Help Center
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <Separator className="my-6" />

            {/* Ask us a question button */}
            <Button
              variant="outline"
              className="w-full justify-start text-left p-4 h-auto border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
            >
              <MessageCircle className="w-5 h-5 mr-3 text-blue-600" />
              <div>
                <div className="font-medium">Ask us a Question</div>
                <div className="text-sm text-gray-500">Get help from our support team</div>
              </div>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}