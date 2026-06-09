import { Sparkles, Paperclip, MessageSquare, FileText, Utensils, Table } from 'lucide-react';

interface AppStudioPageProps {
  userName: string;
}

const aiApps = [
  { name: 'Invoice Manager', icon: FileText, updated: '5/6/2026, 11:22 AM' },
  { name: 'Lunch Order Tracker', icon: Utensils, updated: '4/14/2026, 12:29 PM' },
  { name: 'Super Duper Cat Walker Deluxe', icon: Table, updated: '2/25/2026, 12:13 PM' },
];

export function AppStudioPage({ userName }: AppStudioPageProps) {
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
          <div className="rounded-2xl border border-gray-300 p-4 focus-within:border-gray-400 transition-colors">
            <textarea
              placeholder="Explain how you work, and we'll build the tools for you…"
              className="w-full h-40 resize-none outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <div className="flex items-center justify-between">
              <button className="text-gray-400 hover:text-gray-600 p-1.5" aria-label="Attach a file">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 transition-opacity">
                <Sparkles className="w-4 h-4" />
                Start building
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Save up to 10 hours a week with building customized apps for your organization
          </p>
        </div>

        {/* My AI apps */}
        <div className="mt-10 rounded-2xl bg-purple-50/70 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-900">My AI apps</h2>
            <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-800">
              <MessageSquare className="w-4 h-4" />
              Need help bringing your app to life?
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {aiApps.map((app) => (
              <div key={app.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <app.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">{app.name}</h3>
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Complete
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Updated {app.updated}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
