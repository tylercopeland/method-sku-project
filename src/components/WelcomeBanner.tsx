import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, Users, DollarSign, Activity, Link, Info, FolderSync as Sync, TrendingUp, Play, CircleCheck as CheckCircle, Video, Target, MessageCircle, FileText, ChevronRight, ChevronLeft, CreditCard, Zap, Shield, ArrowRight, Building2, Database, Calendar, GraduationCap, Sparkles } from 'lucide-react';
import { adminRecommendations } from '@/data/recommendations';
import { useRef } from 'react';
import { useState } from 'react';
import { VideoModal } from '@/components/VideoModal';
import { ConnectAccountingModal } from '@/components/ConnectAccountingModal';
import { Skeleton } from '@/components/ui/skeleton';
import { AddLeadModal } from '@/components/AddLeadModal';
import { formatDistanceToNow } from 'date-fns';

interface WelcomeBannerProps {
  userName: string;
  onNavigateToEstimates?: (filter?: string) => void;
  onNavigateToCustomers?: (filter?: string) => void;
  bannerStyle?: 'appcues' | 'appcues-direction' | 'banner' | 'banner-demo' | 'todos' | 'single-banner' | 'recommendations-direction' | 'recommendations-direction-2' | 'recommendations-direction-3' | 'recommendations-direction-4';
}

interface ChecklistStep {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  detailIcon: React.ReactNode;
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
    actionLabel: 'Create invoice',
    videoId: 'convert-invoice-video',
    videoTitle: 'Converting Estimates to Invoices',
  },
];

export function WelcomeBanner({ userName, onNavigateToEstimates, onNavigateToCustomers, bannerStyle = 'appcues' }: WelcomeBannerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showMethodPayBanner, setShowMethodPayBanner] = useState(true);
  const [activeChecklistStep, setActiveChecklistStep] = useState(1);
  const [activeRecommendationIndex, setActiveRecommendationIndex] = useState(0);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<Set<string>>(new Set());
  const [completedChecklistSteps, setCompletedChecklistSteps] = useState<Set<number>>(new Set([0]));
  const [isChecklistHidden, setIsChecklistHidden] = useState(false);
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; title: string; videoId: string }>({
    isOpen: false,
    title: '',
    videoId: ''
  });
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
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
    // Legacy support for old titles
    else if (insight.title === 'Top Customer Reliance' && onNavigateToCustomers) {
      onNavigateToCustomers('lifetime-value');
    } else if (insight.title === 'Pending Estimates Total' && onNavigateToEstimates) {
      onNavigateToEstimates('pending');
    } else if (insight.title === 'Inactive Customers' && onNavigateToCustomers) {
      onNavigateToCustomers('inactive');
    } else if (insight.title === 'Active Leads') {
      if (insight.value === '0') {
        setIsAddLeadModalOpen(true);
      } else if (onNavigateToCustomers) {
        onNavigateToCustomers('leads');
      }
    }
  };

  const adminInsights = [
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

  const generalUserInsights = [
    {
      icon: <Activity className="w-4 h-4 text-gray-500" />,
      title: 'Customer Inactivity',
      value: '23',
      description: 'Go to customer list →',
      tooltip: 'Number of customers with no purchases in last 6 months - How many customers need to be re-engaged?',
    },
    {
      icon: <Target className="w-4 h-4 text-gray-500" />,
      title: 'Active Leads Count',
      value: '8',
      description: 'View active leads list →',
      tooltip: 'Who should I get in touch with?',
    },
    {
      icon: <Target className="w-4 h-4 text-gray-500" />,
      title: 'Activities This Week',
      value: '12',
      description: 'View activities →',
      tooltip: 'Total customer activities logged this week',
    },
    {
      icon: <FileText className="w-4 h-4 text-gray-500" />,
      title: 'My Pending Estimates',
      value: '3',
      description: 'Follow up / View list →',
      tooltip: 'How many estimates are pending?',
    }
  ];

  const insights = adminInsights;

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
          {(
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
          )}
        </div>

        {showMethodPayBanner && (bannerStyle === 'appcues-direction' || bannerStyle === 'single-banner') && isChecklistHidden ? (
          /* Collapsed Single Banner */
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
        ) : showMethodPayBanner && (bannerStyle === 'appcues-direction' || bannerStyle === 'single-banner') ? (
          /* Single Step Banner - One step at a time with next teaser */
          (() => {
            // Single banner uses 4 steps (skip first "Sync your data" step)
            const singleBannerSteps = checklistSteps.slice(1);
            // Adjust index since we skip the first step (activeChecklistStep 1 = singleBanner index 0)
            const singleBannerIndex = Math.max(0, activeChecklistStep - 1);
            const currentStep = singleBannerSteps[singleBannerIndex] || singleBannerSteps[0];
            const nextStep = singleBannerSteps[singleBannerIndex + 1];
            const totalSteps = singleBannerSteps.length;
            const currentStepNum = Math.min(singleBannerIndex + 1, totalSteps);

            return (
              <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-white">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-6">
                  <div className="flex items-stretch gap-5">
                    <div className="w-[160px] min-h-[120px] bg-blue-200/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="scale-[2.5]">
                        {currentStep.detailIcon}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Onboarding Step {currentStepNum} of {totalSteps}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {currentStep.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed flex-1">
                        {currentStep.description}
                      </p>
                      <Button
                        onClick={() => {
                          // Navigate based on step type
                          if (currentStep.id === 'add-lead' && onNavigateToCustomers) {
                            onNavigateToCustomers('add-lead');
                          }
                          setCompletedChecklistSteps(prev => {
                            const next = new Set(prev);
                            next.add(activeChecklistStep);
                            return next;
                          });
                          if (activeChecklistStep < totalSteps - 1) {
                            setActiveChecklistStep(activeChecklistStep + 1);
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
        ) : showMethodPayBanner && bannerStyle === 'banner' && isChecklistHidden ? (
          /* Collapsed Checklist Banner */
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
              Show checklist
            </Button>
          </div>
        ) : showMethodPayBanner && bannerStyle === 'banner' ? (
          /* Checklist Banner */
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-white">
            <div className="flex min-h-[200px]">
              {/* Left: Step list */}
              <div className="w-56 border-r border-blue-100 pt-5 pb-3 px-3 flex-shrink-0 bg-blue-50/50">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 px-2">Get Started</p>
                <div className="space-y-0.5">
                  {checklistSteps.map((step, index) => {
                    const isCompleted = completedChecklistSteps.has(index);
                    const isActive = index === activeChecklistStep;

                    return (
                      <button
                        key={step.id}
                        onClick={() => setActiveChecklistStep(index)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                          isActive
                            ? 'bg-white text-blue-900 shadow-sm'
                            : 'hover:bg-white/70 text-gray-700'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-200 text-blue-700'
                            }`}
                          >
                            {index + 1}
                          </span>
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isCompleted ? 'line-through text-gray-400' : ''
                          }`}
                        >
                          {step.shortTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Step detail */}
              <div className="flex-1 flex items-center bg-gradient-to-r from-blue-50 to-blue-100 relative">
                <button
                  onClick={() => setIsChecklistHidden(true)}
                  className="absolute top-3 right-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Hide
                </button>
                <div className="px-8 py-6 w-full">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center mb-3">
                    {checklistSteps[activeChecklistStep].detailIcon}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {checklistSteps[activeChecklistStep].title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {checklistSteps[activeChecklistStep].description}
                  </p>
                  <div className="flex items-center gap-3">
                  <Button
                    onClick={() => {
                      setCompletedChecklistSteps(prev => {
                        const next = new Set(prev);
                        next.add(activeChecklistStep);
                        return next;
                      });
                      // Auto-advance to next step
                      if (activeChecklistStep < checklistSteps.length - 1) {
                        setActiveChecklistStep(activeChecklistStep + 1);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {checklistSteps[activeChecklistStep].actionLabel} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openVideoModal(
                      checklistSteps[activeChecklistStep].videoTitle,
                      checklistSteps[activeChecklistStep].videoId
                    )}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Play className="w-4 h-4 mr-2" /> Watch walkthrough
                  </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showMethodPayBanner && bannerStyle === 'banner-demo' && isChecklistHidden ? (
          /* Collapsed Checklist Banner with Demo CTA attached */
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-200">
            {/* Collapsed Checklist */}
            <div className="bg-gray-50 px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Circular Progress */}
                <div className="relative w-10 h-10 flex-shrink-0">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="#dbeafe"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="#2563eb"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(completedChecklistSteps.size / checklistSteps.length) * 100.53} 100.53`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-blue-600">
                    {completedChecklistSteps.size}/{checklistSteps.length}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Get Started</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {completedChecklistSteps.size} of {checklistSteps.length} completed
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChecklistHidden(false)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 whitespace-nowrap text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Show checklist</span>
                <span className="sm:hidden">Show</span>
              </Button>
            </div>

            {/* Demo Session CTA - Attached bottom section */}
            <div className="bg-blue-50 border-t border-blue-100 px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600 text-xs sm:text-sm">Need help getting started?</span>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline whitespace-nowrap">
                Book a free demo →
              </button>
            </div>
          </div>
        ) : showMethodPayBanner && bannerStyle === 'banner-demo' ? (
          /* Checklist Banner with Demo CTA attached */
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-white">
            {/* Checklist Section */}
            <div className="flex flex-col md:flex-row md:min-h-[200px]">
              {/* Left: Step list - hidden on mobile */}
              <div className="hidden md:block w-56 border-r border-gray-100 pt-5 pb-3 px-3 flex-shrink-0 bg-gray-50/50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">Get Started</p>
                <div className="space-y-0.5">
                  {checklistSteps.map((step, index) => {
                    const isCompleted = completedChecklistSteps.has(index);
                    const isActive = index === activeChecklistStep;

                    return (
                      <button
                        key={step.id}
                        onClick={() => setActiveChecklistStep(index)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                          isActive
                            ? 'bg-white text-blue-900 border border-gray-200'
                            : 'hover:bg-white/70 text-gray-700'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-200 text-blue-700'
                            }`}
                          >
                            {index + 1}
                          </span>
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isCompleted ? 'line-through text-gray-400' : ''
                          }`}
                        >
                          {step.shortTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Step detail */}
              <div className="flex-1 flex items-center bg-gray-50/50 relative">
                <button
                  onClick={() => setIsChecklistHidden(true)}
                  className="absolute top-3 right-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Hide
                </button>
                <div className="px-4 sm:px-8 py-5 sm:py-6 w-full">
                  {/* Mobile step indicator */}
                  <p className="text-xs text-gray-500 mb-2 md:hidden">
                    Step {activeChecklistStep + 1} of {checklistSteps.length}
                  </p>
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    {checklistSteps[activeChecklistStep].detailIcon}
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {checklistSteps[activeChecklistStep].title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {checklistSteps[activeChecklistStep].description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Button
                      onClick={() => {
                        // Navigate based on step type
                        const currentStepId = checklistSteps[activeChecklistStep].id;
                        if (currentStepId === 'add-lead' && onNavigateToCustomers) {
                          onNavigateToCustomers('add-lead');
                        }
                        setCompletedChecklistSteps(prev => {
                          const next = new Set(prev);
                          next.add(activeChecklistStep);
                          return next;
                        });
                        // Auto-advance to next step
                        if (activeChecklistStep < checklistSteps.length - 1) {
                          setActiveChecklistStep(activeChecklistStep + 1);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    >
                      {checklistSteps[activeChecklistStep].actionLabel}
                    </Button>
                    {/* Mobile navigation */}
                    <div className="flex gap-2 md:hidden">
                      <button
                        onClick={() => setActiveChecklistStep(Math.max(0, activeChecklistStep - 1))}
                        disabled={activeChecklistStep === 0}
                        className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => setActiveChecklistStep(Math.min(checklistSteps.length - 1, activeChecklistStep + 1))}
                        disabled={activeChecklistStep === checklistSteps.length - 1}
                        className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Session CTA - Attached bottom section */}
            <div className="bg-blue-50 border-t border-blue-100 px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Need help getting started? Our team is here to help you get the most out of Method.</span>
                  <span className="sm:hidden">Need help getting started?</span>
                </span>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline whitespace-nowrap">
                Book a free demo →
              </button>
            </div>
          </div>
        ) : showMethodPayBanner && bannerStyle === 'todos' ? (
          /* Todos Welcome Banner */
          <div className="mb-6 rounded-xl p-6 text-gray-900 relative overflow-hidden flex items-center gap-6 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="relative z-10 flex-shrink-0">
              <div className="w-[140px] h-[90px] rounded-lg flex items-center justify-center relative overflow-hidden bg-blue-200/30">
                <Play className="w-8 h-8 text-gray-600" />
              </div>
            </div>

            <div className="relative z-10 flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Welcome to Method
              </h3>
              <p className="text-gray-600 text-sm mb-4 max-w-2xl">
                In just a few minutes, you'll learn how Method can help you save time, stay organized, and win more work — all from one place.
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={() => openVideoModal('Get Started', 'welcome-method')}
                  className="text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4" />
                  Watch Get Started Video
                </Button>
              </div>
            </div>
          </div>
        ) : showMethodPayBanner && bannerStyle === 'recommendations-direction-4' ? (
          /* Single Recommendation Banner - One recommendation at a time */
          (() => {
            const visibleRecommendations = adminRecommendations.filter(r => !dismissedRecommendations.has(r.id));
            if (visibleRecommendations.length === 0) return null;
            const safeIndex = Math.min(activeRecommendationIndex, visibleRecommendations.length - 1);
            const current = visibleRecommendations[safeIndex];
            const totalSteps = visibleRecommendations.length;
            const currentStepNum = safeIndex + 1;

            const goNext = () => {
              if (safeIndex < totalSteps - 1) {
                setActiveRecommendationIndex(safeIndex + 1);
              } else {
                setActiveRecommendationIndex(0);
              }
            };

            const goPrev = () => {
              if (safeIndex > 0) {
                setActiveRecommendationIndex(safeIndex - 1);
              }
            };

            return (
              <div className="mb-6 rounded-xl overflow-hidden border border-purple-200 bg-white">
                <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 px-5 py-6">
                  <div className="flex items-stretch gap-5">
                    <div className="w-[160px] min-h-[120px] rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500">
                      <div className="scale-[2.5] [&_svg]:text-white">
                        {current.icon}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          <span className="text-xs font-medium text-purple-700">Recommendation {currentStepNum} of {totalSteps}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={goPrev}
                            disabled={safeIndex === 0}
                            className="p-1 rounded hover:bg-purple-100 disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <ChevronLeft className="w-4 h-4 text-purple-700" />
                          </button>
                          <button
                            onClick={goNext}
                            className="p-1 rounded hover:bg-purple-100"
                          >
                            <ChevronRight className="w-4 h-4 text-purple-700" />
                          </button>
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {current.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed flex-1">
                        {current.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={goNext}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-fit"
                        >
                          Get started
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setDismissedRecommendations(prev => {
                              const next = new Set(prev);
                              next.add(current.id);
                              return next;
                            });
                            setActiveRecommendationIndex(0);
                          }}
                          className="border-purple-200 text-purple-700 hover:bg-purple-50 w-fit"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : showMethodPayBanner && bannerStyle === 'appcues' ? (
          /* Original Blue Banner */
          <div className="mb-6 rounded-xl p-6 text-gray-900 relative overflow-hidden flex items-center gap-6 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 border rounded-full border-blue-200/30"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 border rounded-full border-blue-200/30"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border rounded-full border-blue-200/20"></div>
            </div>

            <div className="relative z-10 flex-shrink-0">
              <div className="w-[200px] h-[114px] rounded-lg flex items-center justify-center relative overflow-hidden bg-blue-200/30">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="relative z-10 flex-1 pr-12">
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Let's set up your first workflow
              </h3>
              <p className="text-gray-600 text-sm mb-4 max-w-2xl">
                We'll walk you through the basics — add a lead, log an activity, send an estimate, and convert it to an invoice. Start with adding yourself as a test lead.
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={() => setIsAddLeadModalOpen(true)}
                  className="text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                      <ArrowRight className="w-4 h-4" />
                      Add yourself as a lead
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <Tabs key={bannerStyle} defaultValue="insights" className="w-full">
          <TabsList>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Insights
            </TabsTrigger>
            {bannerStyle === 'recommendations-direction-2' && (
              <TabsTrigger
                value="recommendations"
                className="flex items-center gap-2 text-purple-700 data-[state=active]:text-purple-700"
              >
                <Sparkles className="w-4 h-4" />
                Recommendations ({adminRecommendations.length})
              </TabsTrigger>
            )}
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

            {bannerStyle === 'recommendations-direction-3' && (
              <div className="mt-6 rounded-xl p-5 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Recommendations ({adminRecommendations.length})</h3>
                    <p className="text-xs text-gray-500">Personalized next steps based on your activity</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {adminRecommendations.map((item) => (
                    <div
                      key={item.id}
                      className="py-2 px-3 rounded-lg border bg-white/80 border-purple-200 cursor-pointer hover:bg-white transition-all duration-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex-shrink-0 [&_svg]:w-4 [&_svg]:h-4">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0 flex items-baseline gap-2">
                          <span className="font-medium text-sm whitespace-nowrap">{item.title}</span>
                          <span className="text-gray-500 text-xs truncate">{item.description}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {bannerStyle === 'recommendations-direction-2' && (
            <TabsContent value="recommendations" className="mt-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Your recommendations</h3>
                  <p className="text-sm text-gray-500">Personalized next steps based on your activity</p>
                </div>
              </div>

              <div className="space-y-2">
                {adminRecommendations.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border bg-white border-gray-300 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-0.5">
                          <span className="font-medium text-sm">{item.title}</span>
                        </div>
                        <p className="text-gray-600 text-xs">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

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
                      className={`${
                        'text-green-600 border-green-200 hover:bg-green-50'
                      }`}
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