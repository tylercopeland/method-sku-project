import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, MessageCircle, FileText, Calendar, Database, ArrowRight } from 'lucide-react';

interface ChecklistStep {
  id: string;
  title: string;
  description: string;
  detailIcon: React.ReactNode;
  actionLabel: string;
}

const checklistSteps: ChecklistStep[] = [
  {
    id: 'sync-data',
    title: 'Sync your data',
    description: 'Your QuickBooks data is now syncing with Method. Customers, estimates, and invoices will stay up to date automatically.',
    detailIcon: <Database className="w-8 h-8 text-blue-600" />,
    actionLabel: 'View sync status',
  },
  {
    id: 'add-lead',
    title: 'Add yourself as a lead',
    description: 'Start by adding yourself as a test lead to see how Method tracks your contacts and communications.',
    detailIcon: <Users className="w-8 h-8 text-blue-600" />,
    actionLabel: 'Add a lead',
  },
  {
    id: 'log-activity',
    title: 'Log an activity',
    description: 'Record a call, meeting, or note to keep track of all your customer interactions in one place.',
    detailIcon: <MessageCircle className="w-8 h-8 text-blue-600" />,
    actionLabel: 'Log activity',
  },
  {
    id: 'send-estimate',
    title: 'Send an estimate',
    description: 'Create and send a professional estimate to win more business faster.',
    detailIcon: <FileText className="w-8 h-8 text-blue-600" />,
    actionLabel: 'Create estimate',
  },
  {
    id: 'convert-invoice',
    title: 'Convert to an invoice',
    description: 'Turn your approved estimate into an invoice with one click and get paid faster.',
    detailIcon: <Calendar className="w-8 h-8 text-blue-600" />,
    actionLabel: 'Create invoice',
  },
];

export function FullscreenChecklist() {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0]));

  const currentStep = checklistSteps[activeStep];
  const completedCount = completedSteps.size;
  const totalSteps = checklistSteps.length;

  const handleComplete = () => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(activeStep);
      return next;
    });
    // Auto-advance to next step
    if (activeStep < checklistSteps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-start justify-center p-8 pt-12">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome to Method</h1>
            <p className="text-gray-600">Let's get you set up in just a few steps</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{completedCount} of {totalSteps} complete</span>
            <div className="w-32 h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex min-h-[400px]">
            {/* Left: Step list */}
            <div className="w-72 border-r border-blue-100 py-6 px-5 flex-shrink-0 bg-blue-50/30">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-4 px-3">Getting Started</p>
              <div className="space-y-1">
                {checklistSteps.map((step, index) => {
                  const isCompleted = completedSteps.has(index);
                  const isActive = index === activeStep;

                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(index)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-white text-blue-900 shadow-sm'
                          : 'hover:bg-white/70 text-gray-700'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
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
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Step detail */}
            <div className="flex-1 flex items-center bg-gradient-to-br from-blue-50 to-blue-100 relative">
              <div className="px-12 py-10 w-full">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  {currentStep.detailIcon}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  {currentStep.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {currentStep.description}
                </p>
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentStep.actionLabel} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
