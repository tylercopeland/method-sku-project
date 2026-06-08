import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Play, Building2, Clock, Video, Users, Database, Calendar, ChevronLeft, ChevronRight, Activity, FileText, Target, Sparkles, Brain, TrendingUp, Settings } from 'lucide-react';
import { CreditCard } from 'lucide-react';
import { adminRecommendations } from '@/data/recommendations';
import { useState, useEffect } from 'react';
import { TodoModal } from '@/components/TodoModal';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  icon: React.ReactNode;
  primary?: boolean;
  recommended?: boolean;
}

interface ChecklistPanelProps {
  showTabs?: boolean;
  defaultFilter?: 'onboarding' | 'activities' | 'recommendations';
  variant?: 'default' | 'recommendations';
}

export function ChecklistPanel({ showTabs = false, defaultFilter, variant = 'default' }: ChecklistPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [visibleRecommendationsCount, setVisibleRecommendationsCount] = useState(6);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [dateRange, setDateRange] = useState('next-7-days');
  const [todoTypeSettings, setTodoTypeSettings] = useState({
    onboarding: variant !== 'recommendations',
    activities: true,
    recommendations: true
  });

  // Set initial category filter - always activities for admin
  const getInitialCategoryFilter = () => {
    return 'activities';
  };

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'onboarding' | 'activities' | 'recommendations'>(defaultFilter || 'activities');
  // Auto-select next available pill when current selection is disabled
  useEffect(() => {
    const availableTypes = [];
    if (todoTypeSettings.onboarding) availableTypes.push('onboarding');
    if (todoTypeSettings.activities) availableTypes.push('activities');
    if (todoTypeSettings.recommendations) availableTypes.push('recommendations');
    
    // If current filter is not available, select the first available one
    if (!availableTypes.includes(categoryFilter)) {
      if (availableTypes.length > 0) {
        setCategoryFilter(availableTypes[0] as 'onboarding' | 'activities' | 'recommendations');
      } else {
        setCategoryFilter('all'); // Fallback if no types are enabled
      }
    }
  }, [todoTypeSettings, categoryFilter]);
  
  // Auto-select pill when a todo type is turned back on
  useEffect(() => {
    const prevSettings = JSON.parse(localStorage.getItem('prevTodoTypeSettings') || '{}');
    
    // Check if any setting changed from false to true (was turned back on)
    if (prevSettings.onboarding === false && todoTypeSettings.onboarding === true) {
      setCategoryFilter('onboarding');
    } else if (prevSettings.activities === false && todoTypeSettings.activities === true) {
      setCategoryFilter('activities');
    } else if (prevSettings.recommendations === false && todoTypeSettings.recommendations === true) {
      setCategoryFilter('recommendations');
    }
    
    // Store current settings for next comparison
    localStorage.setItem('prevTodoTypeSettings', JSON.stringify(todoTypeSettings));
  }, [todoTypeSettings]);
  // Admin (Synced) - QuickBooks already connected
  const adminSyncedChecklist: ChecklistItem[] = [
    {
      id: 'sync-data',
      title: 'Sync your data',
      description: 'Your QuickBooks data is now syncing with Method. Customers, estimates, and invoices will stay up to date automatically.',
      dueDate: 'Completed',
      completed: true,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      primary: true
    },
    {
      id: 'add-lead',
      title: 'Add yourself as a lead',
      description: 'Start by adding yourself as a test lead to see how Method tracks your contacts and communications.',
      dueDate: 'Today',
      completed: false,
      icon: <Users className="w-5 h-5 text-blue-500" />,
      primary: true
    },
    {
      id: 'log-activity',
      title: 'Log an activity',
      description: 'Record a call, meeting, or note to keep track of all your customer interactions in one place.',
      dueDate: 'Jul 6',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'send-estimate',
      title: 'Send an estimate',
      description: 'Create and send a professional estimate to win more business faster.',
      dueDate: 'Jul 7',
      completed: false,
      icon: <FileText className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'convert-invoice',
      title: 'Convert to an invoice',
      description: 'Turn your approved estimate into an invoice with one click and get paid faster.',
      dueDate: 'Jul 9',
      completed: false,
      icon: <Calendar className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-1',
      title: 'Follow-up with a lead [Example]',
      description: 'Try using your activities to set follow-up reminders for new leads.',
      dueDate: 'Today at 05:00pm',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-2',
      title: 'Meet with a customer [Example]',
      description: 'Use the activities to track scheduled meetings with customers.',
      dueDate: 'Tomorrow at 05:00pm',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-3',
      title: 'Send a follow-up email [Example]',
      description: 'Practice logging a customer interaction — email a customer or lead from Method and watch it appear in the customer\'s activity log.',
      dueDate: 'Dec-13-2025 05:00 PM',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    }
  ];

  // Admin Not Synced - Needs to connect QuickBooks first
  const adminNotSyncedChecklist: ChecklistItem[] = [
    {
      id: 'connect-quickbooks',
      title: 'Connect to QuickBooks',
      description: 'Start syncing your customer, estimates & invoices into Method',
      dueDate: 'Completed',
      completed: false,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      id: 'book-setup-call',
      title: 'Book Your Free 1:1 Setup Call',
      description: 'Get expert help configuring Method to fit your business',
      dueDate: 'Today',
      completed: false,
      icon: <Play className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'add-company-logo',
      title: 'Add Your Company Logo',
      description: 'Brand your Method account for a polished client experience',
      dueDate: 'Jul 6',
      completed: false,
      icon: <Building2 className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'send-first-estimate',
      title: 'Send Your First Estimate',
      description: 'Start quoting jobs faster using Method\'s built-in estimate tools',
      dueDate: 'Jul 7',
      completed: false,
      icon: <FileText className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'create-followup-activity',
      title: 'Create a followup activity',
      description: 'Schedule a follow-up reminder for a customer',
      dueDate: 'Jul 9',
      completed: false,
      icon: <Clock className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'invite-teammate',
      title: 'Invite teammate',
      description: 'Add team members to collaborate in your Method workspace',
      dueDate: 'Jul 12',
      completed: false,
      icon: <Users className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-1',
      title: 'Log your first customer interaction',
      description: 'Record your first customer communication or meeting',
      dueDate: 'Jul 15',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-2',
      title: 'Create your first estimate',
      description: 'Set up an estimate to track project progress',
      dueDate: 'Jul 18',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-3',
      title: 'Convert your estimate to an invoice',
      description: 'Turn an accepted estimate into an invoice for payment',
      dueDate: 'Jul 20',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-4',
      title: 'Log your first customer case',
      description: 'Create a customer support case or issue tracking record',
      dueDate: 'Jul 22',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-5',
      title: 'Setup your first email campaign',
      description: 'Create and send your first marketing email campaign',
      dueDate: 'Jul 25',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-6',
      title: 'Create your first proposal',
      description: 'Build a detailed proposal for a potential client',
      dueDate: 'Jul 28',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    }
  ];

  // General User - Limited admin capabilities
  const generalUserChecklist: ChecklistItem[] = [
    {
      id: 'view-customer',
      title: 'View a customer',
      description: 'Explore customer details and contact information',
      dueDate: 'Today',
      completed: false,
      icon: <Users className="w-5 h-5 text-blue-500" />,
      primary: true
    },
    {
      id: 'create-estimate',
      title: 'Create first estimate',
      description: 'Build your first estimate using Method\'s estimate builder',
      dueDate: 'Jul 8',
      completed: false,
      icon: <Database className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'set-followup',
      title: 'Set follow-up',
      description: 'Schedule a follow-up reminder for a customer',
      dueDate: 'Jul 10',
      completed: false,
      icon: <Clock className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'complete-activity',
      title: 'Complete an activity',
      description: 'Log and complete your first customer activity',
      dueDate: 'Jul 12',
      completed: false,
      icon: <CheckCircle className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-1',
      title: 'Log your first customer interaction',
      description: 'Record your first customer communication or meeting',
      dueDate: 'Jul 14',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-2',
      title: 'Create your first estimate',
      description: 'Set up an estimate to track project progress',
      dueDate: 'Jul 16',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-3',
      title: 'Convert your estimate to an invoice',
      description: 'Turn an accepted estimate into an invoice for payment',
      dueDate: 'Jul 18',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-4',
      title: 'Log your first customer case',
      description: 'Create a customer support case or issue tracking record',
      dueDate: 'Jul 20',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-5',
      title: 'Setup your first email campaign',
      description: 'Create and send your first marketing email campaign',
      dueDate: 'Jul 22',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'activity-6',
      title: 'Create your first proposal',
      description: 'Build a detailed proposal for a potential client',
      dueDate: 'Jul 24',
      completed: false,
      icon: <Activity className="w-5 h-5 text-gray-400" />
    }
  ];

  // Admin Recommendations - Shows actual recommendation items
  const adminRecommendationsChecklist: ChecklistItem[] = adminRecommendations;

  // Recommendations Direction - onboarding activities + recommendations list
  const recommendationsDirectionChecklist: ChecklistItem[] = [
    ...adminSyncedChecklist.filter(item => item.id.startsWith('activity-')),
    ...adminRecommendationsChecklist
  ];

  // Always use admin synced checklist (Admin only)
  const getInitialChecklist = () => {
    if (variant === 'recommendations') {
      return recommendationsDirectionChecklist;
    }
    return adminSyncedChecklist;
  };

  const [checklist, setChecklist] = useState<ChecklistItem[]>(getInitialChecklist());

  // Initialize checklist
  useEffect(() => {
    setChecklist(getInitialChecklist());
    setCurrentPage(1);
    setTodoTypeSettings({
      onboarding: variant !== 'recommendations',
      activities: true,
      recommendations: true
    });
    if (!defaultFilter) {
      setCategoryFilter(variant === 'recommendations' ? 'recommendations' : 'activities');
    }
  }, [defaultFilter, variant]);

  // Sort checklist to show recommended items at the end
  const sortedChecklist = [...checklist].sort((a, b) => {
    if (a.recommended && !b.recommended) return 1;
    if (!a.recommended && b.recommended) return -1;
    return 0;
  });

  // Filter checklist based on category
  const filteredChecklist = sortedChecklist.filter(item => {
    // First apply completion filter - if showCompleted is false, hide completed items
    if (!showCompleted && item.completed) return false;
    
    // Then apply todo type settings filter
    const isOnboarding = !item.recommended && !item.id.startsWith('activity-');
    const isActivity = !item.recommended && item.id.startsWith('activity-');
    const isRecommendation = item.recommended;
    
    if (isOnboarding && !todoTypeSettings.onboarding) return false;
    if (isActivity && !todoTypeSettings.activities) return false;
    if (isRecommendation && !todoTypeSettings.recommendations) return false;
    
    // Finally apply category filter
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'onboarding') return isOnboarding;
    if (categoryFilter === 'activities') return isActivity;
    if (categoryFilter === 'recommendations') return isRecommendation;
    return true;
  });

  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercentage = (completedCount / checklist.length) * 100;
  
  // Load more logic for recommendations, pagination for others
  const currentItems = categoryFilter === 'recommendations' 
    ? filteredChecklist.slice(0, visibleRecommendationsCount)
    : (() => {
        const totalPages = Math.ceil(filteredChecklist.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredChecklist.slice(startIndex, endIndex);
      })();

  const hasMoreRecommendations = categoryFilter === 'recommendations' && visibleRecommendationsCount < filteredChecklist.length;
  const totalPages = Math.ceil(filteredChecklist.length / itemsPerPage);

  // Reset to page 1 when filter changes
  const handleCategoryFilterChange = (filter: 'all' | 'onboarding' | 'activities' | 'recommendations') => {
    setCategoryFilter(filter);
    setCurrentPage(1);
    setVisibleRecommendationsCount(6); // Reset visible count when changing filters
  };

  const handleItemClick = (id: string) => {
    // Toggle completion status
    setChecklist(prevChecklist => 
      prevChecklist.map(item => 
        item.id === id 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const handleCircleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering the row click
    handleItemClick(id);
  };

  const handleRowClick = (id: string) => {
    const item = checklist.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setIsModalOpen(true);
    }
  };

  const handleMarkComplete = (id: string) => {
    setChecklist(prevChecklist => 
      prevChecklist.map(item => 
        item.id === id 
          ? { ...item, completed: true }
          : item
      )
    );
  };

  const loadMoreRecommendations = () => {
    setVisibleRecommendationsCount(prev => prev + 6);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Count items by category
  const onboardingCount = sortedChecklist.filter(item => !item.recommended && !item.id.startsWith('activity-')).length;
  const activitiesCount = sortedChecklist.filter(item => !item.recommended && item.id.startsWith('activity-')).length;
  const totalRecommendationsCount = sortedChecklist.filter(item => item.recommended).length;
  const recommendationsCount = Math.min(visibleRecommendationsCount, totalRecommendationsCount);

  // Empty state component for recommendations (only show when no recommendations exist)
  const RecommendationsEmptyState = () => {
    // Only show empty state if there are no recommendations AND we're not in the recommendations experience
    if (recommendationsCount > 0) return null;
    
    return (
      <div className="text-center py-16 px-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Recommendations Are on Their Way</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Method is analyzing your business activity to deliver tailored insights that help you take action faster.
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-xs mx-auto">
          <p className="text-sm text-purple-700 font-medium">
            🕒 Check back in 14 days to see your personalized recommendations.
          </p>
        </div>
      </div>
    );
  };
  return (
    <Card className="h-fit shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Todo's</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600">
                <Settings className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-3">Todo Settings</h4>
                </div>
                
                {/* Show Completed Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-completed" className="text-sm font-medium">
                    Show completed todos
                  </Label>
                  <Switch
                    id="show-completed"
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                  />
                </div>
                
                <Separator />
                
                {/* Date Range Selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="next-7-days">Next 7 days</SelectItem>
                      <SelectItem value="next-14-days">Next 14 days</SelectItem>
                      <SelectItem value="next-30-days">Next 30 days</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                {/* Todo Type Toggles */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Show todo types</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="onboarding"
                        checked={todoTypeSettings.onboarding}
                        onCheckedChange={(checked) => 
                          setTodoTypeSettings(prev => ({ ...prev, onboarding: checked as boolean }))
                        }
                      />
                      <Label htmlFor="onboarding" className="text-sm">Onboarding</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="activities"
                        checked={todoTypeSettings.activities}
                        onCheckedChange={(checked) => 
                          setTodoTypeSettings(prev => ({ ...prev, activities: checked as boolean }))
                        }
                      />
                      <Label htmlFor="activities" className="text-sm">Activities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recommendations"
                        checked={todoTypeSettings.recommendations}
                        onCheckedChange={(checked) => 
                          setTodoTypeSettings(prev => ({ ...prev, recommendations: checked as boolean }))
                        }
                      />
                      <Label htmlFor="recommendations" className="text-sm">Recommendations</Label>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Filter Pills */}
        <div className={`flex items-center gap-2 mt-4 ${showTabs ? '' : 'hidden'}`}>
          {todoTypeSettings.onboarding && (
            <Button
              variant={categoryFilter === 'onboarding' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryFilterChange('onboarding')}
              className={`h-7 px-3 text-xs ${
                categoryFilter === 'onboarding' 
                  ? 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200' 
                  : ''
              }`}
            >
              Onboarding ({onboardingCount})
            </Button>
          )}
          {todoTypeSettings.activities && (
            <Button
              variant={categoryFilter === 'activities' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryFilterChange('activities')}
              className={`h-7 px-3 text-xs ${
                categoryFilter === 'activities' 
                  ? 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200' 
                  : ''
              }`}
            >
              Activities ({activitiesCount})
            </Button>
          )}
          {todoTypeSettings.recommendations && (
            <Button
              variant={categoryFilter === 'recommendations' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryFilterChange('recommendations')}
              className={`h-7 px-3 text-xs flex items-center gap-1 relative ${
                categoryFilter === 'recommendations' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent hover:from-purple-700 hover:to-pink-700' 
                  : 'border-gray-300 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 hover:from-purple-500/20 hover:to-pink-500/20 hover:border-gray-400'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Recommendations ({recommendationsCount})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={`space-y-2 ${categoryFilter === 'recommendations' ? 'max-h-[600px] overflow-y-auto' : ''}`}>
        {categoryFilter === 'recommendations' && recommendationsCount === 0 ? (
          <RecommendationsEmptyState />
        ) : (
          currentItems.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              item.completed 
                ? 'bg-green-50 border-green-200' 
                : item.primary
                  ? 'bg-white border-gray-300 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300'
                  : 'bg-white border-gray-300 cursor-pointer hover:bg-gray-50'
            }`}
            onClick={() => handleRowClick(item.id)}
          >
            <div className="flex items-start gap-2.5">
              <div 
                className="cursor-pointer hover:scale-110 transition-transform duration-200 flex-shrink-0 mt-0.5"
                onClick={(e) => handleCircleClick(e, item.id)}
              >
                {item.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`font-medium text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>
                    {item.title}
                  </span>
                  {!item.recommended && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.id.startsWith('activity-') ? (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200 px-1.5 py-0.5">
                          Not started
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200 px-1.5 py-0.5">
                          onboarding
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs gap-2">
                  <p className={`${item.completed ? 'text-gray-400' : 'text-gray-600'} text-xs mb-1 flex-1 min-w-0`}>
                    {item.description}
                  </p>
                  {!item.recommended && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs whitespace-nowrap flex-shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {item.dueDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          ))
        )}
        
        {/* Load More Button for Recommendations */}
        {categoryFilter === 'recommendations' && hasMoreRecommendations && (
          <div className="pt-4 border-t border-gray-200 text-center">
            <Button
              variant="outline"
              onClick={loadMoreRecommendations}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              Load More Recommendations
            </Button>
          </div>
        )}
        
        {/* Pagination Controls for non-recommendations */}
        {categoryFilter !== 'recommendations' && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Todo Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onMarkComplete={handleMarkComplete}
      />
    </Card>
  );
}