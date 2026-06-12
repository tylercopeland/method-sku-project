import { useState } from 'react';
import { Sparkles, Paperclip, MessageSquare, FileText, Utensils, Lock } from 'lucide-react';

interface AppStudioPageProps {
  userName: string;
  /** Building is gated (e.g. on Essentials) — input disabled, CTA becomes Upgrade. */
  locked?: boolean;
  onUpgrade?: () => void;
}

export interface AiApp {
  name: string;
  icon: typeof Sparkles;
  updated: string;
  status: 'published' | 'draft';
}

// Apps built during the trial — one published, one still in draft.
export const aiApps: AiApp[] = [
  { name: 'Invoice Manager', icon: FileText, updated: '5/6/2026, 11:22 AM', status: 'published' },
  { name: 'Lunch Order Tracker', icon: Utensils, updated: '4/14/2026, 12:29 PM', status: 'draft' },
];

export function AppStudioPage({ userName, locked = false, onUpgrade }: AppStudioPageProps) {
  // Once the user engages the prompt, preview where their new app will live.
  const [promptActive, setPromptActive] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {userName}, bring your business ideas to life!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Build apps that streamline your workflows, powered by{' '}
            <span className="font-semibold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Method AI
            </span>
            <Sparkles className="inline w-4 h-4 text-purple-500 -mt-2 ml-0.5" /> and designed around
            the way you work.
          </p>
        </div>

        {/* Prompt box */}
        <div className="max-w-3xl mx-auto">
          <div
            className={`rounded-2xl border p-4 transition-colors ${
              locked
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-300 focus-within:border-gray-400'
            }`}
          >
            <textarea
              disabled={locked}
              onFocus={() => !locked && setPromptActive(true)}
              placeholder={
                locked
                  ? 'Building apps is part of Build — upgrade to start building.'
                  : "Explain how you work, and we'll build the tools for you…"
              }
              className="w-full h-20 resize-none outline-none text-gray-700 placeholder-gray-400 bg-transparent disabled:cursor-not-allowed"
            />
            <div className="flex items-center justify-between">
              <button
                disabled={locked}
                className="text-gray-400 hover:text-gray-600 p-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                aria-label="Attach a file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              {locked ? (
                <button
                  onClick={onUpgrade}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Upgrade to build apps
                </button>
              ) : (
                <button className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 transition-opacity">
                  <Sparkles className="w-4 h-4" />
                  Start building
                </button>
              )}
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            {locked
              ? 'App Studio is part of Build. Your apps are saved — upgrade to keep building and editing.'
              : 'Save up to 10 hours a week with building customized apps for your organization'}
          </p>
        </div>

        {/* My apps */}
        <div className="mt-10 rounded-2xl bg-purple-50/70 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-900">My apps</h2>
            <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-800">
              <MessageSquare className="w-4 h-4" />
              Need help bringing your app to life?
            </button>
          </div>

          {/* Apps only surface once the user has engaged the builder (or is a returning
              Essentials subscriber who built apps during the trial). */}
          {promptActive || locked ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {aiApps.map((app) => (
                <div
                  key={app.name}
                  className={`relative bg-white rounded-xl border shadow-sm p-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    locked ? 'border-gray-200' : 'border-gray-100'
                  }`}
                >
                  <div className={`flex items-start gap-3 ${locked ? 'opacity-60' : ''}`}>
                    <div className="relative w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <app.icon className="w-5 h-5 text-gray-500" />
                      {locked && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-700 border-2 border-white flex items-center justify-center">
                          <Lock className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{app.name}</h3>
                        {app.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-3">Updated {app.updated}</p>
                    </div>
                  </div>
                  {locked && (
                    <button
                      onClick={onUpgrade}
                      className="mt-3 pt-3 border-t border-gray-100 w-full flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Upgrade to open
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-purple-200 bg-white/60 py-10 px-6 text-center">
              <div className="mx-auto w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900">No apps yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Describe how you work above and Method AI will build your first app here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
