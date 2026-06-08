import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play, Building2, Database, Clock, Users, Calendar, ArrowRight, ChevronRight } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  detailIcon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 'connect-quickbooks',
    title: 'Connect to QuickBooks',
    description: 'Start syncing your customers, estimates & invoices into Method so everything stays up to date automatically.',
    icon: <Database className="w-5 h-5" />,
    detailIcon: <Database className="w-8 h-8 text-green-600" />,
  },
  {
    id: 'book-setup-call',
    title: 'Book your free 1:1 setup call',
    description: 'Get expert help configuring Method to fit your business. Our team will walk you through the setup process.',
    icon: <Play className="w-5 h-5" />,
    detailIcon: <Play className="w-8 h-8 text-green-600" />,
  },
  {
    id: 'add-logo',
    title: 'Add your company logo',
    description: 'Brand your Method account for a polished client experience across estimates, invoices, and emails.',
    icon: <Building2 className="w-5 h-5" />,
    detailIcon: <Building2 className="w-8 h-8 text-green-600" />,
  },
  {
    id: 'send-estimate',
    title: 'Send your first estimate',
    description: 'Start quoting jobs faster using Method\'s built-in estimate tools. Create professional estimates in minutes.',
    icon: <Database className="w-5 h-5" />,
    detailIcon: <Calendar className="w-8 h-8 text-green-600" />,
  },
  {
    id: 'create-followup',
    title: 'Create a followup activity',
    description: 'Schedule a follow-up reminder for a customer so nothing falls through the cracks.',
    icon: <Clock className="w-5 h-5" />,
    detailIcon: <Clock className="w-8 h-8 text-green-600" />,
  },
  {
    id: 'invite-teammate',
    title: 'Invite your team',
    description: 'Add team members to collaborate in your Method workspace and keep everyone on the same page.',
    icon: <Users className="w-5 h-5" />,
    detailIcon: <Users className="w-8 h-8 text-green-600" />,
  },
];

export function GettingStartedPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0]));
  const [hidden, setHidden] = useState(false);

  if (hidden) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Getting started checklist is hidden.</p>
          <Button variant="outline" onClick={() => setHidden(false)}>
            Show Checklist
          </Button>
        </div>
      </div>
    );
  }

  const currentStep = steps[activeStep];

  const handleGetStarted = () => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(activeStep);
      return next;
    });
    // Auto-advance to next incomplete step
    const nextIncomplete = steps.findIndex((_, i) => i > activeStep && !completedSteps.has(i));
    if (nextIncomplete !== -1) {
      setActiveStep(nextIncomplete);
    }
  };

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex min-h-[340px]">
          {/* Left: Step list */}
          <div className="w-72 border-r border-gray-100 py-6 px-5 flex-shrink-0">
            <div className="space-y-1">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.has(index);
                const isActive = index === activeStep;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-900'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                          isActive
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-500'
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
          <div className="flex-1 flex items-center relative">
            <div className="px-12 py-8 max-w-lg">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-5">
                {currentStep.detailIcon}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {currentStep.title}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {currentStep.description}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleGetStarted}
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  Get Started
                </Button>
                {activeStep < steps.length - 1 && (
                  <Button
                    variant="outline"
                    onClick={handleNextStep}
                    className="gap-1"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Hide button */}
            <button
              onClick={() => setHidden(true)}
              className="absolute top-4 right-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Hide
            </button>

            {/* Decorative leaf accent */}
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 120C100 120 110 70 80 40C50 10 0 20 0 20C0 20 10 70 40 90C70 110 100 120 100 120Z"
                  fill="#22c55e"
                />
                <path
                  d="M120 100C120 100 90 60 50 50C10 40 0 80 0 80C0 80 40 90 70 95C100 100 120 100 120 100Z"
                  fill="#16a34a"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
