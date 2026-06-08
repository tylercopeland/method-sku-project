import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ChecklistTask {
  id: string;
  title: string;
  completed: boolean;
}

const tasks: ChecklistTask[] = [
  { id: 'sync-data', title: 'Sync your data', completed: true },
  { id: 'add-lead', title: 'Add yourself as a lead', completed: false },
  { id: 'log-activity', title: 'Log an activity', completed: false },
  { id: 'send-estimate', title: 'Send an estimate', completed: false },
  { id: 'convert-invoice', title: 'Convert to an invoice', completed: false },
];

export function AppcuesChecklist() {
  const [isOpen, setIsOpen] = useState(true);
  const completedCount = tasks.filter(task => task.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <div className={`fixed bottom-6 z-50 ${isOpen ? 'right-24 w-80' : 'right-28'}`}>
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Get Started Tasks</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 bg-white">
            <p className="text-sm text-gray-600 mb-4">
              Welcome! Here are a few important tasks to get you started with Method.
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm flex-1 ${
                      task.completed
                        ? 'line-through text-gray-400'
                        : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 px-4 h-14 relative"
          aria-label="Open Appcues checklist"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-semibold whitespace-nowrap">Get started</span>
          {completedCount < tasks.length && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-purple-600 rounded-full text-xs font-semibold flex items-center justify-center border-2 border-purple-600">
              {tasks.length - completedCount}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}

