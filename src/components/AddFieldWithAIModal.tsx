import { useState } from 'react';
import { Sparkles, X, Loader2, ArrowLeft, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type FieldType = 'text' | 'number' | 'date' | 'email' | 'tel' | 'select' | 'checkbox';

export interface CustomField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  /** Optional sub-section the field belongs to within its entity, e.g. 'contact'. */
  group?: string;
}

/** Which kind of screen the launcher was invoked from. */
export type FieldSurface = 'list' | 'detail';

/** Describes where in the app a field is being added, so the AI can adapt its copy. */
export interface FieldContext {
  /** Stable key for the object type, e.g. 'customer'. Fields are stored per entity. */
  entityType: string;
  /** Human label for the object type, e.g. 'Customers'. */
  entityLabel: string;
  surface: FieldSurface;
  /** Optional sub-section within the screen the field is being added to. */
  group?: string;
}

export const TYPE_LABELS: Record<FieldType, string> = {
  text: 'Short text',
  number: 'Number',
  date: 'Date',
  email: 'Email',
  tel: 'Phone',
  select: 'Dropdown',
  checkbox: 'Checkbox',
};

export const EXAMPLES = [
  'A dropdown for preferred contact method',
  'A dropdown for company size',
  'A date field for next follow-up',
  'A checkbox for newsletter opt-in',
];

// --- Lightweight "AI" that infers a field from a natural-language description ---
export function inferOptions(p: string): string[] {
  if (/\bpriorit/.test(p)) return ['Low', 'Medium', 'High'];
  if (/\brating|temperature\b/.test(p)) return ['Cold', 'Warm', 'Hot'];
  if (/\bstatus|stage\b/.test(p)) return ['New', 'In progress', 'Closed'];
  if (/\bsource\b/.test(p)) return ['Referral', 'Website', 'Ad', 'Event'];
  if (/\bmethod|contact\b/.test(p)) return ['Email', 'Phone', 'Text', 'In person'];
  if (/\btier|plan\b/.test(p)) return ['Bronze', 'Silver', 'Gold'];
  if (/\bregion|territory\b/.test(p)) return ['North', 'South', 'East', 'West'];
  return ['Option 1', 'Option 2', 'Option 3'];
}

export function inferType(p: string): FieldType {
  if (/\b(date|follow.?up|birthday|due|deadline|renewal|anniversary|when)\b/.test(p)) return 'date';
  if (/\b(dropdown|drop down|select|status|stage|category|type|priority|rating|tier|source|method|region|territory|plan)\b/.test(p))
    return 'select';
  if (/\bemail\b/.test(p)) return 'email';
  if (/\b(phone|mobile|cell|telephone)\b/.test(p)) return 'tel';
  if (/\b(number|amount|count|score|quantity|qty|price|budget|revenue|size|total|deal)\b/.test(p)) return 'number';
  if (/\b(checkbox|check box|yes\/?no|toggle|opt.?in|consent|subscribed?|newsletter|agree)\b/.test(p))
    return 'checkbox';
  return 'text';
}

// Rough singularization for entity labels, e.g. "Customers" -> "customer".
function singular(label: string): string {
  const s = label.trim().toLowerCase();
  if (s.endsWith('ies')) return s.slice(0, -3) + 'y';
  if (s.endsWith('ses')) return s.slice(0, -2);
  if (s.endsWith('s')) return s.slice(0, -1);
  return s;
}

export function inferLabel(prompt: string): string {
  let s = prompt
    .trim()
    .replace(/^(can you |could you |please |i (?:want|need) |let'?s )+/gi, '')
    .replace(/^(add|create|insert|make|build)\s+/gi, '')
    .replace(/^(a|an|the)\s+/gi, '')
    .replace(/\b(field|input|dropdown|drop down|column|box|control)\b/gi, ' ')
    .replace(/^(for|to track|to capture|to store|that tracks|that captures)\s+/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/[.?!]+$/, '')
    .trim();
  if (!s) return 'New field';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Quick-fill option sets Method AI suggests when it has to ask for dropdown options.
export const OPTION_SET_SUGGESTIONS = ['Low, Medium, High', 'Small, Medium, Large', 'Yes, No'];

// The field types offered when the AI can't tell what kind of data a field holds.
export const TYPE_CHOICES = (Object.keys(TYPE_LABELS) as FieldType[]).map((t) => ({
  value: t,
  label: TYPE_LABELS[t],
}));

export type Clarification =
  | { kind: 'options'; label: string; question: string }
  | { kind: 'type'; label: string; question: string };

/**
 * Decide whether Method AI should ask a follow-up before building the field.
 * Returns the question to ask, or null when the request is clear enough.
 */
export function getClarification(prompt: string): Clarification | null {
  const p = prompt.toLowerCase();
  const label = inferLabel(prompt);
  const type = inferType(p);

  // A dropdown whose options we couldn't infer — ask what they should be.
  if (type === 'select') {
    const opts = inferOptions(p);
    const optionsUnknown = opts[0] === 'Option 1';
    const optionsListed = /[:,]/.test(prompt) || /\boptions?\b/.test(p);
    if (optionsUnknown && !optionsListed) {
      return { kind: 'options', label, question: `What options should the “${label}” dropdown include?` };
    }
  }

  // A vague, short request that fell back to plain text — ask what data it holds.
  const words = label.split(' ').filter(Boolean);
  const textIsExplicit = /\b(name|note|comment|description|address|title|summary|message|text)\b/.test(p);
  if (type === 'text' && !textIsExplicit && words.length <= 2 && !/\d/.test(p)) {
    return { kind: 'type', label, question: `What kind of information will “${label}” hold?` };
  }

  return null;
}

interface AddFieldWithAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (field: CustomField) => void;
  /** Where the field is being added. Drives the modal's wording. */
  context?: FieldContext;
}

type Stage = 'prompt' | 'clarify' | 'generating' | 'review';

export function AddFieldWithAIModal({ isOpen, onClose, onAddField, context }: AddFieldWithAIModalProps) {
  const [prompt, setPrompt] = useState('');
  const [stage, setStage] = useState<Stage>('prompt');
  const [draft, setDraft] = useState<CustomField | null>(null);
  const [optionsText, setOptionsText] = useState('');
  // The follow-up question Method AI is asking, and the user's answer to it.
  const [clarify, setClarify] = useState<Clarification | null>(null);
  const [answer, setAnswer] = useState('');

  if (!isOpen) return null;

  // Adapt wording to the surface: a list gets "columns", a detail gets "fields".
  const isList = context?.surface === 'list';
  const noun = isList ? 'column' : 'field';
  const where = isList
    ? `the ${context?.entityLabel ?? 'this'} list`
    : context
    ? `each ${singular(context.entityLabel)}`
    : 'this screen';
  const copy = {
    title: `Add a ${noun} with Method AI`,
    prompt: `Describe the ${noun} you want to add to ${where}, and Method AI will build it.`,
    placeholder: isList
      ? 'e.g. Add a column for lead source'
      : 'e.g. Add a dropdown for preferred contact method',
    generate: `Generate ${noun}`,
    review: `Here's the ${noun} Method AI created — tweak it if you'd like.`,
    submit: isList ? 'Add column' : 'Add field',
  };

  const reset = () => {
    setPrompt('');
    setStage('prompt');
    setDraft(null);
    setOptionsText('');
    setClarify(null);
    setAnswer('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Build a field draft from the prompt, with optional answers from a follow-up.
  const buildDraft = (typeOverride?: FieldType, optionsOverride?: string[]): CustomField => {
    const p = prompt.toLowerCase();
    const type = typeOverride ?? inferType(p);
    const label = inferLabel(prompt);
    const options = type === 'select' ? optionsOverride ?? inferOptions(p) : undefined;
    return {
      id: `cf-${Date.now()}`,
      label,
      type,
      options,
      placeholder: type === 'text' ? `Enter ${label.toLowerCase()}` : undefined,
    };
  };

  // Run the (simulated) AI round-trip and land on the review step.
  const finalize = (field: CustomField) => {
    setStage('generating');
    setTimeout(() => {
      setDraft(field);
      setOptionsText(field.options ? field.options.join(', ') : '');
      setStage('review');
    }, 1100);
  };

  const generate = () => {
    if (!prompt.trim()) return;
    // If the request is ambiguous, ask a follow-up before building anything.
    const question = getClarification(prompt);
    if (question) {
      setClarify(question);
      setAnswer('');
      setStage('clarify');
      return;
    }
    finalize(buildDraft());
  };

  const submitClarification = () => {
    if (!clarify || !answer) return;
    if (clarify.kind === 'type') {
      const chosen = answer as FieldType;
      // Picking a dropdown raises a second question: which options?
      if (chosen === 'select') {
        setClarify({
          kind: 'options',
          label: clarify.label,
          question: `What options should the “${clarify.label}” dropdown include?`,
        });
        setAnswer('');
        return;
      }
      finalize(buildDraft(chosen));
      return;
    }
    const options = answer.split(',').map((o) => o.trim()).filter(Boolean);
    finalize(buildDraft('select', options.length ? options : undefined));
  };

  const handleAdd = () => {
    if (!draft) return;
    const options =
      draft.type === 'select'
        ? optionsText
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean)
        : undefined;
    onAddField({ ...draft, options });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900">{copy.title}</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {stage === 'prompt' && (
            <>
              <p className="text-sm text-gray-600 mb-3">{copy.prompt}</p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={copy.placeholder}
                rows={3}
                autoFocus
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setPrompt(ex)}
                    className="text-xs rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={generate}
                  disabled={!prompt.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  <Wand2 className="w-4 h-4 mr-1.5" />
                  {copy.generate}
                </Button>
              </div>
            </>
          )}

          {stage === 'clarify' && clarify && (
            <>
              <div className="flex items-start gap-2 text-sm text-purple-700 bg-purple-50 rounded-lg px-3 py-2.5 mb-5">
                <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{clarify.question}</span>
              </div>

              {clarify.kind === 'type' ? (
                <div className="flex flex-wrap gap-2">
                  {TYPE_CHOICES.map((choice) => (
                    <button
                      key={choice.value}
                      onClick={() => setAnswer(choice.value)}
                      className={`text-sm rounded-full border px-3 py-1.5 transition-colors ${
                        answer === choice.value
                          ? 'border-purple-400 bg-purple-50 text-purple-700'
                          : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="e.g. Low, Medium, High"
                    autoFocus
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {OPTION_SET_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setAnswer(s)}
                        className="text-xs rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setStage('prompt')}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <Button
                  onClick={submitClarification}
                  disabled={!answer}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {stage === 'generating' && (
            <div className="py-10 text-center">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900">Method AI is building your field…</p>
              <p className="text-sm text-gray-500 mt-1">Interpreting "{prompt}"</p>
            </div>
          )}

          {stage === 'review' && draft && (
            <>
              <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 rounded-lg px-3 py-2 mb-5">
                <Sparkles className="w-4 h-4" />
                {copy.review}
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="field-label">Field label</Label>
                  <Input
                    id="field-label"
                    value={draft.label}
                    onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="field-type">Field type</Label>
                  <select
                    id="field-type"
                    value={draft.type}
                    onChange={(e) =>
                      setDraft({ ...draft, type: e.target.value as FieldType })
                    }
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    {(Object.keys(TYPE_LABELS) as FieldType[]).map((t) => (
                      <option key={t} value={t}>
                        {TYPE_LABELS[t]}
                      </option>
                    ))}
                  </select>
                </div>

                {draft.type === 'select' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="field-options">Options (comma separated)</Label>
                    <Input
                      id="field-options"
                      value={optionsText}
                      onChange={(e) => setOptionsText(e.target.value)}
                      placeholder="Low, Medium, High"
                    />
                  </div>
                )}

                {/* Live preview */}
                <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                    Preview
                  </p>
                  <FieldPreview
                    field={{
                      ...draft,
                      options: optionsText
                        ? optionsText.split(',').map((o) => o.trim()).filter(Boolean)
                        : draft.options,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setStage('prompt')}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Start over
                </button>
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {copy.submit}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Renders a disabled control representing the field, for the modal preview.
function FieldPreview({ field }: { field: CustomField }) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-900 mb-1">{field.label || 'Untitled field'}</div>
      {field.type === 'select' ? (
        <select
          disabled
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-500 bg-white"
        >
          <option>{field.options?.[0] ?? 'Select…'}</option>
        </select>
      ) : field.type === 'checkbox' ? (
        <label className="inline-flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" disabled className="accent-blue-600" />
          {field.label}
        </label>
      ) : (
        <input
          disabled
          type={field.type}
          placeholder={field.placeholder ?? ''}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-500 bg-white"
        />
      )}
    </div>
  );
}
