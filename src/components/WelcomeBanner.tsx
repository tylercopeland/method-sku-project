import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, FolderSync as Sync, TrendingUp, Play, CircleCheck as CheckCircle, MessageCircle, FileText, ChevronRight, ChevronLeft, Info, Database, Calendar, GraduationCap, Building2, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { useState } from 'react';
import { VideoModal } from '@/components/VideoModal';
import { ConnectAccountingModal } from '@/components/ConnectAccountingModal';
import { AddLeadModal } from '@/components/AddLeadModal';

interface WelcomeBannerProps {
  userName: string;
  onNavigateToEstimates?: (filter?: string) => void;
  onNavigateToCustomers?: (filter?: string) => void;
  appStudioEnabled?: boolean;
  appStudioEngaged?: boolean;
  onNavigateToAppStudio?: () => void;
}

interface ChecklistStep {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  detailIcon: React.ReactNode;
  image?: string; // optional illustration shown in place of the icon box
  actionLabel: string;
  videoId: string;
  videoTitle: string;
}

const checklistSteps: ChecklistStep[] = [
  {
    id: 'sync-data',
    title: 'Connect Method to QuickBooks',
    shortTitle: 'Sync your data',
    description: 'Sync your QuickBooks data to bring in your customers, transactions, and records so you can start working in Method right away.',
    detailIcon: <Database className="w-5 h-5 text-blue-600" />,
    actionLabel: 'Connect QuickBooks',
    videoId: 'understand-qb-sync',
    videoTitle: 'How QuickBooks Sync Works',
  },
  {
    id: 'add-lead',
    title: "Welcome to Method. Let's add your first lead",
    shortTitle: 'Add lead',
    description: 'Start by adding a lead so you can see how work flows through Method, from first contact to estimate and invoice.',
    detailIcon: <Users className="w-5 h-5 text-blue-600" />,
    image: '/lead-onboarding.jpg',
    actionLabel: 'Add lead',
    videoId: 'add-lead-video',
    videoTitle: 'Adding & Managing Leads',
  },
  {
    id: 'log-activity',
    title: 'Keep your lead moving with an activity',
    shortTitle: 'Log activity',
    description: 'Log a call, note, or meeting to see how Method helps you stay on top of follow-ups and next steps.',
    detailIcon: <MessageCircle className="w-5 h-5 text-blue-600" />,
    image: '/activity-onboarding.jpg',
    actionLabel: 'Log activity',
    videoId: 'log-activity-video',
    videoTitle: 'Tracking Customer Activities',
  },
  {
    id: 'send-estimate',
    title: 'Turn your new lead into an estimate',
    shortTitle: 'Create estimate',
    description: 'Create an estimate for your new lead and see how Method helps you move from customer conversations to real opportunities.',
    detailIcon: <FileText className="w-5 h-5 text-blue-600" />,
    image: '/estimate-onboarding.jpg',
    actionLabel: 'Create estimate',
    videoId: 'send-first-estimate',
    videoTitle: 'Creating & Sending Estimates',
  },
  {
    id: 'convert-invoice',
    title: 'Turn your estimate into an invoice',
    shortTitle: 'Create invoice',
    description: 'Convert your estimate into an invoice to see how Method helps you move from quote to payment.',
    detailIcon: <Calendar className="w-5 h-5 text-blue-600" />,
    image: '/invoice-onboarding.jpg',
    actionLabel: 'Create invoice',
    videoId: 'convert-invoice-video',
    videoTitle: 'Converting Estimates to Invoices',
  },
];

export function WelcomeBanner({ userName, onNavigateToEstimates, onNavigateToCustomers, appStudioEnabled = false, appStudioEngaged = false, onNavigateToAppStudio }: WelcomeBannerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showMethodPayBanner] = useState(true);
  const [activeChecklistStep, setActiveChecklistStep] = useState(1);
  const [completedChecklistSteps, setCompletedChecklistSteps] = useState<Set<number>>(new Set([0]));
  const [isChecklistHidden, setIsChecklistHidden] = useState(false);
  // Prototype: the onboarding banner advances on each CTA, then dismisses on the last step.
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; title: string; videoId: string }>({
    isOpen: false,
    title: '',
    videoId: ''
  });
  const [isAccountingModalOpen, setIsAccountingModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [insightsLastUpdated] = useState<Date>(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)); // 2 days ago for demo

  // Define video sequences for next video suggestions
  const getNextVideo = (currentVideoId: string) => {
    const videoSequences: Record<string, { title: string; id: string }> = {
      'welcome-method': { title: 'Send First Estimate', id: 'send-first-estimate' },
      'send-first-estimate': { title: 'Connect Email', id: 'connect-email' },
      'connect-email': { title: 'Understand QB Sync', id: 'understand-qb-sync' },
      'understand-qb-sync': { title: 'Add Company Info', id: 'add-company-info' },
      'add-company-info': { title: 'Set Follow-Up', id: 'set-follow-up' },
      'set-follow-up': { title: 'Invite Team Member', id: 'invite-team-member' },
      // General user sequences
      'view-customer-log-followup': { title: 'Track Your Tasks & Follow-Ups', id: 'track-tasks-followups' },
    };

    return videoSequences[currentVideoId];
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const openVideoModal = (title: string, videoId: string) => {
    setVideoModal({ isOpen: true, title, videoId });
  };

  const handleNextVideo = (title: string, videoId: string) => {
    setVideoModal({ isOpen: true, title, videoId });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, title: '', videoId: '' });
  };

  const handleInsightClick = (insight: any) => {
    if (insight.title === 'Revenue distribution' && onNavigateToCustomers) {
      onNavigateToCustomers('lifetime-value');
    } else if (insight.title === 'Pending estimates' && onNavigateToEstimates) {
      onNavigateToEstimates('pending');
    } else if (insight.title === 'Inactive customers' && onNavigateToCustomers) {
      onNavigateToCustomers('inactive');
    } else if (insight.title === 'Active leads') {
      if (insight.value === '0') {
        setIsAddLeadModalOpen(true);
      } else if (onNavigateToCustomers) {
        onNavigateToCustomers('leads');
      }
    }
  };

  const insights = [
    {
      icon: <Users className="w-4 h-4 text-gray-500" />,
      title: 'Revenue distribution',
      value: '60%',
      description: 'View customers →',
      tooltip: 'Your top 10 customers represent 60% of your revenue',
      showInfoIcon: true,
    },
    {
      icon: <FileText className="w-4 h-4 text-gray-500" />,
      title: 'Pending estimates',
      value: '$45,000.00',
      description: 'View estimates →',
      tooltip: 'How much money is on the table at this moment?',
      showInfoIcon: false,
    },
    {
      icon: <Users className="w-4 h-4 text-gray-500" />,
      title: 'Inactive customers',
      value: '23',
      description: 'View customers →',
      tooltip: 'Number of customers with no purchases in last 6 months - How many customers need to be re-engaged?',
      showInfoIcon: false,
    },
    {
      icon: <Users className="w-4 h-4 text-gray-500" />,
      title: 'Active leads',
      value: '0',
      description: 'Add a lead →',
      tooltip: 'Start tracking leads and communications in Method to grow your business',
      showInfoIcon: false,
    }
  ];

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getLastUpdatedText = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };
    // Format as "October 9,2025" (no space before year)
    const dateStr = insightsLastUpdated.toLocaleDateString('en-US', options);
    return dateStr.replace(', ', ','); // Remove space before year
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">{getCurrentDate()}</p>
            <h1 className="text-xl sm:text-2xl font-medium text-gray-900">{getGreeting()}, {userName}</h1>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 flex items-center gap-1.5 cursor-pointer hover:bg-green-100 transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Sync Status: Connected
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs bg-white border border-gray-200 shadow-lg">
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-gray-900">Sync Status</div>
                  <div className="text-xs space-y-1 text-gray-700">
                    <div className="flex justify-between">
                      <span>Last sync:</span>
                      <span className="text-green-600">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customers:</span>
                      <span className="text-gray-900">247 synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Invoices:</span>
                      <span className="text-gray-900">1,432 synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span className="text-gray-900">89 synced</span>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-gray-200">
                    <div className="text-xs text-green-600 font-medium">✓ All data synchronized</div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {onboardingDismissed ? null : appStudioEnabled && !appStudioEngaged ? (
          /* App Studio card — same structure as the blue onboarding card, purple palette */
          <div className="mb-6 rounded-xl overflow-hidden border border-purple-100 bg-white">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-5 py-6">
              <div className="flex items-stretch gap-5">
                <div className="w-[160px] min-h-[120px] bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-14 h-14 text-purple-400" />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-xs text-purple-500 mb-1">App Studio</span>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Build a custom app with App Studio
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed flex-1">
                    Describe what you want and Method builds it for you — no code required.
                  </p>
                  <Button
                    onClick={() => onNavigateToAppStudio?.()}
                    className="bg-purple-600 hover:bg-purple-700 text-white w-fit"
                  >
                    Open App Studio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : showMethodPayBanner && isChecklistHidden ? (
          /* Collapsed blue banner */
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Get Started</span>
              <span className="text-sm text-gray-500">{completedChecklistSteps.size} of {checklistSteps.length} complete</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChecklistHidden(false)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Continue
            </Button>
          </div>
        ) : showMethodPayBanner ? (
          /* Single Step Banner - One step at a time */
          (() => {
            const singleBannerSteps = checklistSteps.slice(1);
            const singleBannerIndex = Math.max(0, activeChecklistStep - 1);
            const currentStep = singleBannerSteps[singleBannerIndex] || singleBannerSteps[0];
            const totalSteps = singleBannerSteps.length;
            const currentStepNum = Math.min(singleBannerIndex + 1, totalSteps);

            return (
              <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-white">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-6">
                  <div className="flex items-stretch gap-5">
                    {currentStep.image ? (
                      <div className="w-[160px] min-h-[120px] rounded-lg overflow-hidden flex-shrink-0 bg-white">
                        <img src={currentStep.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-[160px] min-h-[120px] bg-blue-200/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="scale-[2.5]">{currentStep.detailIcon}</div>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">Onboarding Step {currentStepNum} of {totalSteps}</span>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">{currentStep.title}</h2>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed flex-1">{currentStep.description}</p>
                      <Button
                        onClick={() => {
                          setCompletedChecklistSteps(prev => {
                            const next = new Set(prev);
                            next.add(activeChecklistStep);
                            return next;
                          });
                          if (singleBannerIndex < totalSteps - 1) {
                            setActiveChecklistStep(activeChecklistStep + 1);
                          } else {
                            setOnboardingDismissed(true);
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-fit"
                      >
                        {currentStep.actionLabel}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : null}

        <Tabs defaultValue="insights" className="w-full">
          <TabsList>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="mt-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-base font-semibold text-gray-900">Your weekly insights</h3>
                <p className="text-sm text-gray-500">Last updated {getLastUpdatedText()}</p>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm group"
                  onClick={() => handleInsightClick(insight)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {insight.icon}
                      <span className="font-medium text-sm text-gray-700">{insight.title}</span>
                    </div>
                    {insight.showInfoIcon && (
                      <Info className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">
                    {insight.value}
                  </div>
                  <p className="text-xs text-blue-600 group-hover:text-blue-800 group-hover:underline transition-colors">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started Video Series</h3>
              <p className="text-sm text-gray-600">
                Follow our video series to get to know Method CRM. Each video builds on the previous one to help you get the most out of your business management system.
              </p>
            </div>

            <div className="relative group">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
              >
                {/* Welcome to Method - Completed for all admin experiences */}
                <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20"></div>
                    <div className="absolute inset-4 bg-white/90 rounded border border-gray-200 flex items-center justify-center">
                      <Play className="w-12 h-12 text-green-600" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-6 h-6 text-green-600 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Welcome to Method</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">3:45</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Get started with Method and learn the basics of managing your business.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideoModal('Welcome to Method', 'welcome-method');
                      }}
                    >
                      Watch Again
                    </Button>
                  </div>
                </div>

                {/* Send First Estimate */}
                <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20"></div>
                    <div className="absolute inset-4 bg-white/90 rounded border border-gray-200 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Send First Estimate</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">5:32</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Learn how to create and send professional estimates to your customers.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideoModal('Send First Estimate', 'send-first-estimate');
                      }}
                    >
                      Watch Video
                    </Button>
                  </div>
                </div>

                {/* Connect Email */}
                <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20"></div>
                    <div className="absolute inset-4 bg-white/90 rounded border border-gray-200 flex items-center justify-center">
                      <MessageCircle className="w-12 h-12 text-purple-600" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Connect Email</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">2:15</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Connect your email to send estimates and invoices directly from Method.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideoModal('Connect Email', 'connect-email');
                      }}
                    >
                      Watch Video
                    </Button>
                  </div>
                </div>

                {/* Understand QB Sync */}
                <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20"></div>
                    <div className="absolute inset-4 bg-white/90 rounded border border-gray-200 flex items-center justify-center">
                      <Sync className="w-12 h-12 text-orange-600" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Understand QB Sync</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">4:20</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Learn how Method syncs with QuickBooks to keep your data up to date.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideoModal('Understand QB Sync', 'understand-qb-sync');
                      }}
                    >
                      Watch Video
                    </Button>
                  </div>
                </div>

                {/* Add Company Info */}
                <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-teal-100 to-cyan-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-cyan-400/20"></div>
                    <div className="absolute inset-4 bg-white/90 rounded border border-gray-200 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-teal-600" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Add Company Info</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">3:10</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Set up your company information for professional estimates and invoices.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-teal-600 border-teal-200 hover:bg-teal-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideoModal('Add Company Info', 'add-company-info');
                      }}
                    >
                      Watch Video
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg border border-gray-200 rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={scrollRight}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg border border-gray-200 rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {(() => {
          const nextVideo = getNextVideo(videoModal.videoId);
          return (
            <VideoModal
              isOpen={videoModal.isOpen}
              onClose={closeVideoModal}
              title={videoModal.title}
              videoId={videoModal.videoId}
              nextVideoTitle={nextVideo?.title}
              nextVideoId={nextVideo?.id}
              onNextVideo={handleNextVideo}
            />
          );
        })()}

        <ConnectAccountingModal
          isOpen={isAccountingModalOpen}
          onClose={() => setIsAccountingModalOpen(false)}
        />

        <AddLeadModal
          isOpen={isAddLeadModalOpen}
          onClose={() => setIsAddLeadModalOpen(false)}
        />
      </div>
    </Card>
  );
}
