import { ReactNode } from 'react';
import {
  ArrowLeft, ChevronDown, ChevronUp, Monitor, Tablet, Smartphone, EyeOff,
  Check, Sparkles, X, Paperclip, Wrench, ArrowUp, Plus, Layers,
} from 'lucide-react';

interface AppBuilderViewProps {
  /** App name shown in the breadcrumb (e.g. "Estimates"). */
  appName: string;
  /** Current screen name shown after the breadcrumb slash (e.g. "Estimate list"). */
  screenName: string;
  /** Exit the App Builder view (wired to the top-left back-arrow icon). */
  onExit: () => void;
  /** The runtime screen content rendered in the center canvas. */
  children: ReactNode;
}

/**
 * Immersive App Builder view, reproduced from the Figma "App Builder - Screen
 * management" frame. Renders as a full-screen overlay — which inherently hides
 * the app's Sidebar, TopHeader and value-prop banner. Only the center canvas is
 * dynamic: it shows the runtime screen the user was customizing. The left "Method
 * AI" panel and right "Screen properties" panel are static visual chrome; the
 * single way out is the back-arrow icon at the top-left of the nav bar.
 */
export function AppBuilderView({ appName, screenName, onExit, children }: AppBuilderViewProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-white"
      style={{ fontFamily: "'Source Sans Pro', 'Source Sans 3', Inter, sans-serif" }}
    >
      {/* ---- Nav bar (48px) ---- */}
      <div
        className="flex h-12 flex-shrink-0 items-center justify-between bg-white pl-[10px] pr-4"
        style={{ boxShadow: '0 2px 2px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-[18px]">
          <button onClick={onExit} aria-label="Exit App Builder" className="text-[#545F67] hover:text-[#0F1B31]">
            <ArrowLeft className="h-[22px] w-[22px]" />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center gap-2 rounded-full bg-[#FFFAF0] px-2">
              <span className="h-2 w-2 rounded-full bg-[#E05D2A]" />
              <span className="text-xs font-semibold text-[#0F1B31]">Draft</span>
            </span>
            <span className="text-base font-semibold text-[#0F1B31]">{appName}</span>
            <span className="text-base font-semibold text-[#2A394A]">/</span>
            <span className="flex items-center gap-0.5 text-base font-semibold text-[#545F67]">
              {screenName}
              <ChevronDown className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div
          className="flex gap-1 rounded-lg bg-[#DFE9ED] p-1"
          style={{ boxShadow: 'inset -1px 1px 6px 0 rgba(0,0,0,0.12)' }}
        >
          <span className="w-16 rounded px-2 text-center text-base font-semibold leading-6 text-[#545F67]">Plan</span>
          <span className="w-16 rounded bg-white px-2 text-center text-base font-semibold leading-6 text-[#0F1B31]">Build</span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 rounded-lg bg-[#F6FAFB] px-1 py-0.5"
            style={{ boxShadow: 'inset -1px 1px 6px 0 rgba(0,0,0,0.12)' }}
          >
            <Monitor className="h-5 w-5 text-[#0D71C8]" />
            <Tablet className="h-5 w-5 text-[#545F67]" />
            <Smartphone className="h-5 w-5 text-[#545F67]" />
          </div>
          <div
            className="flex w-14 rounded-full bg-[#F6FAFB] p-0.5"
            style={{ boxShadow: 'inset -1px 1px 6px 0 rgba(0,0,0,0.12)' }}
          >
            <span className="flex rounded-full bg-white p-1" style={{ boxShadow: '0 1px 1px rgba(0,0,0,0.15)' }}>
              <EyeOff className="h-4 w-4 text-[#545F67]" />
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 opacity-70">
            <Check className="h-4 w-4 text-[#0D71C8]" />
            <span className="text-sm font-semibold text-[#0D71C8]">Saved</span>
          </div>
          <button className="rounded-[38px] bg-[#0D71C8] px-4 py-2 text-sm font-semibold text-white">Publish</button>
        </div>
      </div>

      {/* ---- Body ---- */}
      <div className="flex min-h-0 flex-1">
        {/* Tool rail (48px) */}
        <div className="flex w-12 flex-shrink-0 flex-col items-center gap-4 border-r border-[#DFE9ED] pt-3 text-[#545F67]">
          <Plus className="h-5 w-5" />
          <Layers className="h-5 w-5" />
        </div>

        {/* AI assistant panel (320px) */}
        <div
          className="flex w-80 flex-shrink-0 flex-col border-l border-[#DFE9ED]"
          style={{ boxShadow: '0 1px 1px rgba(0,0,0,0.15)' }}
        >
          <div className="flex items-center justify-between border-b border-[#DFE9ED] p-2">
            <div className="flex items-center gap-1 py-1">
              <Sparkles className="h-3 w-3 text-[#7B2FF7]" />
              <span className="text-xs font-semibold text-[#7B2FF7]">Powered by Method AI</span>
            </div>
            <X className="h-5 w-5 text-[#545F67]" />
          </div>
          <div className="flex-1 px-4 pb-10 pt-4">
            <div className="mb-2 flex justify-end gap-2">
              <span className="text-sm font-semibold text-[#2A394A]">Method AI</span>
              <span className="text-sm text-[#545F67]">Just now</span>
            </div>
            <div className="rounded-2xl bg-[#EEF5F7] px-4 py-2 text-base leading-6 text-[#2A394A]">
              Hello! I'm your AI Assistant, here to help you design and modify your screens effortlessly. I can also guide you through how your screen is functioning today.
            </div>
          </div>
          <div className="border-t border-[#DFE9ED] p-4">
            <div className="rounded-lg border border-[#BACAD0] bg-white p-2">
              <div className="h-12 text-sm text-[#2A394A]/50">Enter your prompt</div>
              <div className="flex items-center justify-between">
                <Paperclip className="h-5 w-5 text-[#545F67]" />
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-[#EEF5F7] px-2 py-1">
                    <Wrench className="h-4 w-4 text-[#545F67]" />
                    <span className="text-sm font-semibold text-[#545F67]">Build</span>
                    <ChevronDown className="h-4 w-4 text-[#545F67]" />
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#9AACB4]">
                    <ArrowUp className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center canvas — the runtime screen the user came from */}
        <div className="min-w-0 flex-1 bg-[#F6FAFB] p-4">
          <div className="h-full overflow-y-auto rounded-lg border border-[#EEF5F7] bg-white">
            {children}
          </div>
        </div>

        {/* Screen properties panel (384px) — static chrome */}
        <div
          className="flex w-96 flex-shrink-0 flex-col bg-white"
          style={{ boxShadow: '0 10px 5px rgba(0,0,0,0.25)' }}
        >
          <div className="flex items-center gap-2 border-b border-[#EEF5F7] px-4 py-2">
            <Layers className="h-4 w-4 text-[#0F1B31]" />
            <span className="text-base font-semibold text-[#0F1B31]">Screen properties</span>
          </div>
          <div className="flex flex-col gap-6 overflow-y-auto p-4">
            <p className="text-sm text-[#2A394A]">Edit the screens overall properties</p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#0F1B31]">Table</span>
              <div className="flex h-8 w-[184px] items-center justify-between rounded border border-[#BACAD0] bg-white px-2 text-sm text-[#2A394A] opacity-50">
                Invoices <ChevronDown className="h-4 w-4 text-[#545F67]" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0F1B31]">
                Configuration <ChevronUp className="h-3 w-3" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#0F1B31]">Default control focus</span>
                <div className="flex h-8 w-[184px] items-center justify-between rounded border border-[#BACAD0] bg-white px-2 text-sm text-[#2A394A]">
                  None <ChevronDown className="h-4 w-4 text-[#545F67]" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="border-b border-dotted border-[#BACAD0] text-sm text-[#0F1B31]">App ribbon</span>
                <div className="flex w-[184px]">
                  <span className="flex-1 rounded-l border border-[#0D71C8] bg-[#E5F7FF] py-2 text-center text-xs text-[#0D71C8]">None</span>
                  <span className="-ml-px flex-1 border border-[#BACAD0] bg-white py-2 text-center text-xs text-[#2A394A]">1/3</span>
                  <span className="-ml-px flex-1 rounded-r border border-[#BACAD0] bg-white py-2 text-center text-xs text-[#2A394A]">2/3</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#EEF5F7]" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#0F1B31]">Events <ChevronUp className="h-3 w-3" /></span>
                <Plus className="h-4 w-4 text-[#545F67]" />
              </div>
              <div className="flex items-center justify-between rounded border border-[#EEF5F7] bg-white p-4">
                <span className="text-sm text-[#2A394A]">No events applied</span>
                <span className="text-sm font-semibold text-[#0D71C8]">+ Add</span>
              </div>
            </div>

            <div className="h-px bg-[#EEF5F7]" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#0F1B31]">Screen functions <ChevronUp className="h-3 w-3" /></span>
                <Plus className="h-4 w-4 text-[#545F67]" />
              </div>
              <p className="text-sm text-[#2A394A]">These are reusable sets of actions that can be used with components (Replaces hidden buttons)</p>
              <div className="flex items-center justify-between rounded border border-[#EEF5F7] bg-white p-4">
                <span className="text-sm text-[#2A394A]">No functions added</span>
                <span className="text-sm font-semibold text-[#0D71C8]">+ Add</span>
              </div>
            </div>

            <div className="h-px bg-[#EEF5F7]" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0F1B31]">Version note <ChevronUp className="h-3 w-3" /></div>
              <div className="h-16 w-full rounded border border-[#BACAD0] bg-white p-2 text-sm text-[#BACAD0]">
                Internal summary of changes or screen functionality...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
