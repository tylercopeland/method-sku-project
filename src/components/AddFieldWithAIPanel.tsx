import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Plus, Check, ArrowUp, ArrowRight, ChevronDown, MessageSquare, Wand2, Info, AppWindow, Wrench, LifeBuoy, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  type CustomField,
  type FieldType,
  type FieldContext,
  type Clarification,
  TYPE_LABELS,
  TYPE_CHOICES,
  OPTION_SET_SUGGESTIONS,
  EXAMPLES,
  inferType,
  inferLabel,
  inferOptions,
  getClarification,
} from '@/components/AddFieldWithAIModal';

interface AddFieldWithAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Commits a field; the panel stays open so the user can keep chatting. */
  onAddField: (field: CustomField) => void;
  context?: FieldContext;
  /** Open the App Builder (App Studio) to edit the full screen/app. */
  onOpenAppBuilder?: () => void;
  /** App Builder isn't available on the current plan (e.g. Essentials). */
  appBuilderLocked?: boolean;
  /** Open the upgrade flow when App Builder is locked. */
  onUpgrade?: () => void;
  /** Open the Help Center for support questions. */
  onOpenHelpCenter?: () => void;
  /**
   * 'empty'  — app has no records yet; prompt to create the first one.
   * 'locked' — app requires a plan upgrade; show upsell content.
   * 'normal' — default field-adding experience.
   */
  appState?: 'normal' | 'empty' | 'locked';
}

type Message =
  | { id: number; role: 'ai' | 'user'; kind: 'text'; text: string }
  | { id: number; role: 'ai'; kind: 'field'; field: CustomField; added: boolean }
  | { id: number; role: 'ai'; kind: 'app-builder' }
  | { id: number; role: 'ai'; kind: 'help-center' };

let seq = 0;
const nextId = () => ++seq;

// Detect a support/help question (vs. a field request) — route those to the Help Center.
function isSupportQuestion(prompt: string): boolean {
  const p = prompt.toLowerCase().trim();
  const fieldRequest =
    /\b(field|column|dropdown|drop ?down|checkbox|date field|number field|text field|text box|select|picklist)\b/;
  // Explicit help/support asks.
  if (/\b(help|support|contact|customer service|talk to|speak to|agent|representative)\b/.test(p)) return true;
  // Something is broken / not working.
  if (/\b(not working|doesn'?t work|isn'?t working|broken|error|bug|issue|problem|trouble|stuck|can'?t|cannot|won'?t|unable to)\b/.test(p))
    return true;
  // Account/billing support topics.
  if (/\b(refund|charged|billing|password|log ?in|sign ?in|reset|locked out)\b/.test(p)) return true;
  // General "how/why/where" guidance questions that aren't field-building requests.
  if (/^(how|why|where|what|when|who)\b/.test(p) && !fieldRequest.test(p)) return true;
  return false;
}

// Detect a request to build/customize a full screen or app (vs. adding a field) —
// that's an App Builder job, not something this runtime field-adder can do.
function isScreenBuildRequest(prompt: string): boolean {
  const p = prompt.toLowerCase();
  const target = /\b(screen|page|app|application|layout|workflow|dashboard|view|module|report)\b/;
  const buildVerb =
    /\b(build|create|make|design|redesign|customi[sz]e|edit|rearrange|restructure|configure|modify|set up|revamp)\b/;
  // A clear field request with no screen/app target is always allowed through.
  const fieldRequest =
    /\b(field|column|dropdown|drop ?down|checkbox|date field|number field|text field|text box|select|picklist)\b/;
  if (fieldRequest.test(p) && !target.test(p)) return false;
  return buildVerb.test(p) && target.test(p);
}

function singular(label: string): string {
  const s = label.trim().toLowerCase();
  if (s.endsWith('ies')) return s.slice(0, -3) + 'y';
  if (s.endsWith('s')) return s.slice(0, -1);
  return s;
}

// Map a free-text answer to a field type (chips pass the value directly).
function resolveType(text: string): FieldType {
  const t = text.toLowerCase();
  const byLabel = TYPE_CHOICES.find((c) => c.label.toLowerCase() === t || c.value === t);
  if (byLabel) return byLabel.value;
  if (/drop|select|choice|option/.test(t)) return 'select';
  if (/number|amount|count|#/.test(t)) return 'number';
  if (/date|day|when/.test(t)) return 'date';
  if (/email/.test(t)) return 'email';
  if (/phone|tel|mobile/.test(t)) return 'tel';
  if (/check|yes|bool|toggle|opt/.test(t)) return 'checkbox';
  return 'text';
}

export function AddFieldWithAIPanel({ isOpen, onClose, onAddField, context, onOpenAppBuilder, appBuilderLocked = false, onUpgrade, onOpenHelpCenter, appState = 'normal' }: AddFieldWithAIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [pendingClarify, setPendingClarify] = useState<Clarification | null>(null);
  const [composerMode, setComposerMode] = useState<'Ask' | 'Build'>('Build');
  const scrollRef = useRef<HTMLDivElement>(null);

  const isList = context?.surface === 'list';
  const noun = isList ? 'column' : 'field';
  const target = isList
    ? `the ${context?.entityLabel ?? 'this'} list`
    : context
    ? `each ${singular(context.entityLabel)}`
    : 'this screen';

  // Seed the conversation each time the panel opens.
  useEffect(() => {
    if (isOpen) {
      seq = 0;
      const greeting =
        appState === 'empty'
          ? `Looks like you haven't started with ${context?.entityLabel ?? 'this app'} yet. Create your first record to get going — or I can help you customize this screen in the meantime.`
          : appState === 'locked'
          ? `${context?.entityLabel ?? 'This app'} is available on Build and Scale plans. Upgrade to unlock it for your team.`
          : `Hi! Tell me what ${noun} you'd like to add to ${target}, and I'll build it for you.`;
      setMessages([{ id: nextId(), role: 'ai', kind: 'text', text: greeting }]);
      setInput('');
      setBusy(false);
      setCurrentPrompt('');
      setPendingClarify(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, appState]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  if (!isOpen) return null;

  const pushAI = (text: string) =>
    setMessages((m) => [...m, { id: nextId(), role: 'ai', kind: 'text', text }]);
  const pushUser = (text: string) =>
    setMessages((m) => [...m, { id: nextId(), role: 'user', kind: 'text', text }]);
  const pushField = (field: CustomField) =>
    setMessages((m) => [...m, { id: nextId(), role: 'ai', kind: 'field', field, added: false }]);
  const pushAppBuilderNotice = () =>
    setMessages((m) => [...m, { id: nextId(), role: 'ai', kind: 'app-builder' }]);
  const pushHelpCenterNotice = () =>
    setMessages((m) => [...m, { id: nextId(), role: 'ai', kind: 'help-center' }]);

  const buildDraft = (typeOverride?: FieldType, optionsOverride?: string[]): CustomField => {
    const p = currentPrompt.toLowerCase();
    const type = typeOverride ?? inferType(p);
    const label = inferLabel(currentPrompt);
    const options = type === 'select' ? optionsOverride ?? inferOptions(p) : undefined;
    return {
      id: `cf-${Date.now()}`,
      label,
      type,
      options,
      placeholder: type === 'text' ? `Enter ${label.toLowerCase()}` : undefined,
    };
  };

  // Simulate a build, then drop the field card into the thread.
  const generate = (field: CustomField) => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      pushAI(`Here's what I built — review it and add it when you're ready.`);
      pushField(field);
    }, 850);
  };

  const askOptions = (label: string) => {
    const question = `What options should the “${label}” dropdown include?`;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      pushAI(question);
      setPendingClarify({ kind: 'options', label, question });
    }, 500);
  };

  // A brand-new field request from the prompt.
  const handleRequest = (prompt: string, fromExample = false) => {
    // A support/help question belongs in the Help Center, not the field builder.
    // Example prompt chips are pre-validated field requests — skip the check for them.
    if (!fromExample && isSupportQuestion(prompt)) {
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        pushHelpCenterNotice();
      }, 650);
      return;
    }
    // Building/customizing a full screen or app is an App Builder job, not something
    // this runtime field-adder supports — reply inline and point to the App Builder.
    if (isScreenBuildRequest(prompt)) {
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        pushAppBuilderNotice();
      }, 650);
      return;
    }
    setCurrentPrompt(prompt);
    setBusy(true);
    setTimeout(() => {
      const clarify = getClarification(prompt);
      if (clarify) {
        setBusy(false);
        pushAI(clarify.question);
        setPendingClarify(clarify);
      } else {
        // currentPrompt state may not have flushed yet — build from the value directly.
        const p = prompt.toLowerCase();
        const type = inferType(p);
        const label = inferLabel(prompt);
        const options = type === 'select' ? inferOptions(p) : undefined;
        generate({
          id: `cf-${Date.now()}`,
          label,
          type,
          options,
          placeholder: type === 'text' ? `Enter ${label.toLowerCase()}` : undefined,
        });
      }
    }, 650);
  };

  // The user answered an outstanding follow-up question.
  const handleAnswer = (clarify: Clarification, text: string) => {
    if (clarify.kind === 'type') {
      const chosen = resolveType(text);
      if (chosen === 'select') {
        askOptions(clarify.label);
        return;
      }
      generate(buildDraft(chosen));
    } else {
      const options = text.split(',').map((o) => o.trim()).filter(Boolean);
      generate(buildDraft('select', options.length ? options : undefined));
    }
  };

  const send = (raw: string, fromExample = false) => {
    const text = raw.trim();
    if (!text || busy) return;
    setInput('');
    pushUser(text);
    if (pendingClarify) {
      const c = pendingClarify;
      setPendingClarify(null);
      handleAnswer(c, text);
    } else {
      handleRequest(text, fromExample);
    }
  };

  // Type chips bypass text parsing so the user bubble reads as a friendly label.
  const answerType = (choice: { value: FieldType; label: string }) => {
    if (busy || !pendingClarify) return;
    pushUser(choice.label);
    setPendingClarify(null);
    if (choice.value === 'select') {
      askOptions(pendingClarify.label);
    } else {
      generate(buildDraft(choice.value));
    }
  };

  const commit = (messageId: number, field: CustomField) => {
    onAddField(field);
    setMessages((m) =>
      m.map((msg) => (msg.id === messageId && msg.kind === 'field' ? { ...msg, added: true } : msg)),
    );
    pushAI(`Done — “${field.label}” is on the screen now. Want to add another ${noun}?`);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="h-full w-full sm:w-[380px] flex-shrink-0 bg-white border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-semibold text-purple-600">Method AI</span>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Capability banner — sets expectations on what's possible today */}
      <div className="flex items-start gap-2 border-b border-purple-100 bg-purple-50 px-4 py-2.5">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-purple-500" />
        <p className="text-xs leading-relaxed text-purple-900">
          <span className="font-semibold">Today you can add custom fields.</span> Method AI adds a
          custom field to this runtime screen.{' '}
          {appBuilderLocked ? (
            <>
              Editing the full screen or app needs the App Builder, which isn't on your plan —{' '}
              {onUpgrade ? (
                <button
                  onClick={onUpgrade}
                  className="font-semibold text-purple-700 underline hover:text-purple-900"
                >
                  upgrade to Build
                </button>
              ) : (
                'upgrade to Build'
              )}{' '}
              to unlock it.
            </>
          ) : (
            <>
              To edit the full screen or app, use the{' '}
              {onOpenAppBuilder ? (
                <button
                  onClick={onOpenAppBuilder}
                  className="font-semibold text-purple-700 underline hover:text-purple-900"
                >
                  App Builder
                </button>
              ) : (
                'App Builder'
              )}
              .
            </>
          )}
        </p>
      </div>

      {/* Thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          if (msg.kind === 'app-builder') {
            return (
              <AppBuilderNotice
                key={msg.id}
                locked={appBuilderLocked}
                onOpenAppBuilder={onOpenAppBuilder}
                onUpgrade={onUpgrade}
              />
            );
          }
          if (msg.kind === 'help-center') {
            return <HelpCenterNotice key={msg.id} onOpenHelpCenter={onOpenHelpCenter} />;
          }
          if (msg.kind === 'field') {
            return <FieldCard key={msg.id} message={msg} onAdd={() => commit(msg.id, msg.field)} />;
          }
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-baseline gap-2 mb-1 px-1">
                <span className="text-sm font-semibold text-gray-900">
                  {msg.role === 'user' ? 'You' : 'Method AI'}
                </span>
                <span className="text-xs text-gray-400">Just now</span>
              </div>
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-50 text-blue-900'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Follow-up quick replies appear directly under the AI's question */}
        {!busy && pendingClarify && (
          <div className="flex flex-wrap gap-2 pl-1">
            {pendingClarify.kind === 'type'
              ? TYPE_CHOICES.map((choice) => (
                  <button
                    key={choice.value}
                    onClick={() => answerType(choice)}
                    className="text-sm rounded-full border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    {choice.label}
                  </button>
                ))
              : OPTION_SET_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-sm rounded-full border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    {s}
                  </button>
                ))}
          </div>
        )}

        {/* Starter suggestions — vary by app state */}
        {!busy && !pendingClarify && messages.length <= 1 && (
          appState === 'locked' ? (
            /* Locked: upgrade CTA + feature bullets */
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Lock className="w-4 h-4 text-gray-400" />
                Requires an upgrade
              </div>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />Access for your whole team</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />Unlimited records &amp; history</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />Custom fields &amp; workflows</li>
              </ul>
              {onUpgrade && (
                <button
                  onClick={onUpgrade}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Upgrade to unlock <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : appState === 'empty' ? (
            /* Empty state: create-first CTA, then field chips as secondary */
            <div className="space-y-3 w-full">
              <button
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                onClick={onClose}
              >
                Create your first {context ? singular(context.entityLabel) : 'record'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-400 text-center">or customize this screen first:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.slice(0, 3).map((ex) => (
                  <button
                    key={ex}
                    onClick={() => send(ex, true)}
                    className="text-sm rounded-full border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Normal: field suggestion chips */
            <div className="flex flex-wrap gap-2 pl-1">
              {EXAMPLES.slice(0, 3).map((ex) => (
                <button
                  key={ex}
                  onClick={() => send(ex, true)}
                  className="text-sm rounded-full border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          )
        )}

        {busy && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer — hidden when the app is locked (no fields to add without access) */}
      <div className={`border-t border-gray-200 p-3 ${appState === 'locked' ? 'hidden' : ''}`}>
        <div className="rounded-2xl border border-gray-200 focus-within:border-blue-400 px-3 pt-2.5 pb-2">
          {/* Screen context — always applied, can't be removed */}
          <div className="mb-2">
            <span
              title="Method AI is working on this screen"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600"
            >
              <AppWindow className="w-3.5 h-3.5 text-gray-400" />
              {context?.entityLabel ?? 'This screen'}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={2}
            placeholder={pendingClarify ? 'Type your answer…' : 'Enter your prompt…'}
            className="w-full resize-none outline-none text-sm text-gray-900 placeholder:text-gray-400 max-h-28"
          />
          <div className="flex items-center justify-end mt-1">
            <div className="flex items-center gap-2">
              {/* Ask / Build mode selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    {composerMode === 'Ask' ? (
                      <MessageSquare className="w-3.5 h-3.5" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                    {composerMode}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top" sideOffset={6} className="w-52">
                  <DropdownMenuItem
                    disabled
                    className="items-start gap-2 py-2"
                  >
                    <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-500">Ask</span>
                        <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-purple-600">
                          Coming soon
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">Answer and explain</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setComposerMode('Build')}
                    className="cursor-pointer items-start gap-2 py-2"
                  >
                    <Wand2 className="w-4 h-4 mt-0.5 text-gray-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Build</div>
                      <div className="text-xs text-gray-500">Create and edit</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Send */}
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || busy}
                aria-label="Send"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-gray-700 transition-colors"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline reply when the user asks to build/customize a full screen or app —
// that's not supported here; point them to the App Builder (or an upgrade).
function AppBuilderNotice({
  locked = false,
  onOpenAppBuilder,
  onUpgrade,
}: {
  locked?: boolean;
  onOpenAppBuilder?: () => void;
  onUpgrade?: () => void;
}) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-baseline gap-2 mb-1 px-1">
        <span className="text-sm font-semibold text-gray-900">Method AI</span>
        <span className="text-xs text-gray-400">Just now</span>
      </div>
      <div className="max-w-[88%] rounded-2xl bg-gray-100 px-4 py-3 text-sm leading-relaxed text-gray-800">
        <div className="flex items-center gap-1.5 font-semibold text-gray-900 mb-1">
          <Wrench className="w-4 h-4 text-gray-500" />
          That's an App Builder job
        </div>
        <p>
          I can only add custom fields to this runtime screen — building or customizing the full
          screen or app isn't something I can do here.{' '}
          {locked
            ? 'The App Builder, where you can do that, is available on Build.'
            : 'Head to the App Builder to make those changes.'}
        </p>
        <div className="mt-3">
          {locked
            ? onUpgrade && (
                <button
                  onClick={onUpgrade}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Upgrade to Build
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )
            : onOpenAppBuilder && (
                <button
                  onClick={onOpenAppBuilder}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Open the App Builder
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
        </div>
      </div>
    </div>
  );
}

// Inline reply when the user asks a support/help question — point them to the Help Center.
function HelpCenterNotice({ onOpenHelpCenter }: { onOpenHelpCenter?: () => void }) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-baseline gap-2 mb-1 px-1">
        <span className="text-sm font-semibold text-gray-900">Method AI</span>
        <span className="text-xs text-gray-400">Just now</span>
      </div>
      <div className="max-w-[88%] rounded-2xl bg-gray-100 px-4 py-3 text-sm leading-relaxed text-gray-800">
        <div className="flex items-center gap-1.5 font-semibold text-gray-900 mb-1">
          <LifeBuoy className="w-4 h-4 text-gray-500" />
          That sounds like a support question
        </div>
        <p>
          I'm here to add custom fields to this screen, so I can't help with that one. The Help
          Center has guides and a way to reach our support team.
        </p>
        {onOpenHelpCenter && (
          <div className="mt-3">
            <button
              onClick={onOpenHelpCenter}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Go to the Help Center
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// A generated field, shown inline in the chat with an Add action.
function FieldCard({
  message,
  onAdd,
}: {
  message: { field: CustomField; added: boolean };
  onAdd: () => void;
}) {
  const { field, added } = message;
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] w-full rounded-2xl rounded-bl-sm border border-gray-200 bg-white p-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-purple-500 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          New field
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Label</span>
            <span className="font-medium text-gray-900 text-right">{field.label}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Type</span>
            <span className="font-medium text-gray-900 text-right">{TYPE_LABELS[field.type]}</span>
          </div>
          {field.type === 'select' && field.options && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {field.options.map((o) => (
                <span
                  key={o}
                  className="text-xs rounded-full bg-white border border-purple-200 px-2 py-0.5 text-purple-700"
                >
                  {o}
                </span>
              ))}
            </div>
          )}
        </div>
        {added ? (
          <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-green-600">
            <Check className="w-4 h-4" />
            Added to screen
          </div>
        ) : (
          <Button
            onClick={onAdd}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add to screen
          </Button>
        )}
      </div>
    </div>
  );
}
