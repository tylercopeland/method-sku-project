import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, ExternalLink, X } from 'lucide-react';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  icon: React.ReactNode;
  primary?: boolean;
  recommended?: boolean;
}

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TodoItem | null;
  onMarkComplete: (id: string) => void;
}

export function TodoModal({ isOpen, onClose, item, onMarkComplete }: TodoModalProps) {
  if (!item) return null;

  const getVideoContent = (itemId: string) => {
    const videoMap: Record<string, { videoId: string; duration: string; ctaText: string; ctaAction: string }> = {
      'demo': {
        videoId: 'demo-walkthrough',
        duration: '8:45',
        ctaText: 'Book Demo Now',
        ctaAction: 'Schedule your personalized Method demo'
      },
      'logo': {
        videoId: 'add-company-logo',
        duration: '3:20',
        ctaText: 'Add Your Logo',
        ctaAction: 'Upload your company logo to customize Method'
      },
      'estimate': {
        videoId: 'create-first-estimate',
        duration: '6:15',
        ctaText: 'Create Estimate',
        ctaAction: 'Build your first professional estimate'
      },
      'followup': {
        videoId: 'setup-followups',
        duration: '4:30',
        ctaText: 'Set Up Follow-ups',
        ctaAction: 'Configure automated customer reminders'
      },
      'teammate': {
        videoId: 'invite-team-members',
        duration: '3:45',
        ctaText: 'Invite Team',
        ctaAction: 'Add team members to your workspace'
      },
      'view-customer': {
        videoId: 'explore-customers',
        duration: '5:20',
        ctaText: 'View Customers',
        ctaAction: 'Explore your customer database'
      },
      'create-estimate': {
        videoId: 'estimate-builder',
        duration: '7:10',
        ctaText: 'Create Estimate',
        ctaAction: 'Use the estimate builder tool'
      },
      'set-followup': {
        videoId: 'schedule-followup',
        duration: '3:55',
        ctaText: 'Schedule Follow-up',
        ctaAction: 'Set customer follow-up reminders'
      },
      'complete-activity': {
        videoId: 'log-activities',
        duration: '4:40',
        ctaText: 'Log Activity',
        ctaAction: 'Record customer interactions'
      },
      'activity-1': {
        videoId: 'customer-communication',
        duration: '5:30',
        ctaText: 'Make the Call',
        ctaAction: 'Contact John Smith about the project'
      },
      'activity-2': {
        videoId: 'send-proposals',
        duration: '4:15',
        ctaText: 'Send Proposal',
        ctaAction: 'Email proposal to Acme Corp'
      },
      'activity-3': {
        videoId: 'customer-feedback',
        duration: '3:50',
        ctaText: 'Review Feedback',
        ctaAction: 'Analyze customer survey responses'
      },
      'activity-4': {
        videoId: 'project-updates',
        duration: '4:25',
        ctaText: 'Update Status',
        ctaAction: 'Log project progress updates'
      }
    };

    return videoMap[itemId] || {
      videoId: 'default-help',
      duration: '5:00',
      ctaText: 'Take Action',
      ctaAction: 'Complete this task'
    };
  };

  const videoContent = getVideoContent(item.id);
  const isActivity = item.id.startsWith('activity-');
  const isRecommendation = item.recommended;
  const showVideo = !isActivity && !isRecommendation;

  const handleMarkComplete = () => {
    onMarkComplete(item.id);
    onClose();
  };

  const getDetailedDescription = (itemId: string) => {
    const descriptions: Record<string, string> = {
      'follow-up-inactive': 'Your business has 23 customers who haven\'t made a purchase in over 6 months. These customers represent significant revenue potential that could be re-activated with proper follow-up. Reach out to understand their current needs and offer solutions.',
      'review-pending-estimates': 'You currently have $45,000 worth of pending estimates that haven\'t been accepted or declined. Following up on these estimates could significantly boost your revenue. Review each estimate and create a follow-up strategy.',
      'diversify-revenue': 'Your top 10 customers represent 60% of your total revenue, which creates business risk. Focus on acquiring new customers and growing relationships with existing smaller accounts to create a more balanced revenue stream.',
      'follow-up-customers': 'Maintaining regular contact with your highest-value customers is crucial for retention and growth. Schedule check-ins to understand their evolving needs and identify opportunities for additional services.',
      'optimize-pricing': 'Your current pricing may not reflect the true value you provide or market rates. Conduct a comprehensive pricing analysis to ensure you\'re maximizing profitability while remaining competitive. Consider value-based pricing for premium services.',
      'automate-workflows': 'Manual processes are consuming valuable time that could be spent on revenue-generating activities. Implement automation for routine tasks like invoice reminders, follow-up emails, and appointment scheduling to improve efficiency.',
      'expand-service-offerings': 'Your existing customers trust your expertise and may need additional services you could provide. Analyze customer needs and market opportunities to identify complementary services that could increase revenue per customer.',
      'improve-cash-flow': 'Better cash flow management can significantly impact your business stability and growth potential. Review your payment terms, implement automated reminders, and consider offering early payment incentives to improve cash flow.',
      'setup-method-pay': 'Method Pay integrates seamlessly with your existing workflow to accept online payments directly through estimates and invoices. Customers can pay instantly with credit cards, bank transfers, or digital wallets. Studies show businesses get paid 2x faster and reduce late payments by 65% when offering online payment options.',
      'create-first-estimate': 'Creating professional estimates is essential for winning new business. Learn to use Method\'s estimate builder to create compelling proposals that showcase your services and pricing clearly.',
      'track-activities': 'Consistent activity tracking helps you build stronger customer relationships and ensures no opportunities fall through the cracks. Log all customer interactions to maintain a complete history.',
      'demo': 'Schedule a personalized walkthrough of Method CRM with one of our experts. Learn how to set up your workspace, manage customers, create estimates, and streamline your business processes.',
      'logo': 'Personalize your Method account by uploading your company logo. This will appear on all your estimates, invoices, and customer communications, giving your business a professional appearance.',
      'estimate': 'Learn to create professional estimates using Method\'s powerful estimate builder. Add line items, set pricing, include terms and conditions, and send directly to customers.',
      'followup': 'Set up automated follow-up reminders to stay on top of customer communications. Never miss an important follow-up call or email again.',
      'teammate': 'Collaborate more effectively by inviting team members to your Method workspace. Set permissions and roles to control access to different features.',
      'view-customer': 'Explore your customer database and learn how to view detailed customer information, contact history, and transaction records.',
      'create-estimate': 'Master the estimate creation process from start to finish. Learn best practices for pricing, formatting, and sending estimates to customers.',
      'set-followup': 'Schedule follow-up activities and reminders to maintain consistent customer communication and improve your sales process.',
      'complete-activity': 'Learn how to log and track customer activities, meetings, calls, and other interactions to maintain a complete customer history.',
      'activity-1': 'Contact John Smith to discuss the upcoming project requirements and establish a clear timeline for deliverables.',
      'activity-1-log': 'Log your first customer interaction by recording a phone call, meeting, or email exchange in Method to start building a complete customer history.',
      'activity-2': 'Create your first work order to track project progress, assign tasks, and manage deliverables for a customer project.',
      'activity-3': 'Convert an accepted estimate into an invoice to begin the payment process and complete the sales cycle.',
      'activity-4': 'Log your first customer case to track support issues, service requests, or problem resolution for better customer service.',
      'activity-5': 'Setup your first email campaign to reach out to customers with newsletters, promotions, or important updates.',
      'activity-6': 'Create your first proposal with detailed project scope, timeline, and pricing to win new business opportunities.'
    };

    return descriptions[itemId] || item.description;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
        <div className="space-y-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0 mt-1">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    {item.recommended && (
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                        recommended
                      </Badge>
                    )}
                    {!item.recommended && isActivity ? (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                        activity
                      </Badge>
                    ) : !item.recommended && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                        onboarding
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">Due: {item.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Video Section - Only show for onboarding items */}
          {showVideo && (
            <div className="px-6">
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg overflow-hidden relative mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {videoContent.duration}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {getDetailedDescription(item.id)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                {!item.completed && (
                  <Button 
                    variant="outline" 
                    onClick={handleMarkComplete}
                    className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </Button>
                )}
                
                {item.completed && (
                  <Button 
                    variant="outline" 
                    disabled
                    className="flex items-center gap-2 border-green-200 text-green-700 bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </Button>
                )}
              </div>
              
              {showVideo && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  onClick={() => {
                    // In a real app, this would trigger the specific action
                    console.log(`Taking action: ${videoContent.ctaAction}`);
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  {videoContent.ctaText}
                </Button>
              )}
              
              {/* Go-to buttons for activities and recommendations */}
              {isActivity && (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  onClick={() => {
                    // In a real app, this would navigate to the activity
                    console.log(`Viewing activity: ${item.id}`);
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Activity
                </Button>
              )}
              
              {isRecommendation && (
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  onClick={() => {
                    // In a real app, this would navigate to the recommendation
                    console.log(`Viewing recommendation: ${item.id}`);
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Recommendation
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}