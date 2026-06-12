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
}

const TYPE_LABELS: Record<FieldType, string> = {
  text: 'Short text',
  number: 'Number',
  date: 'Date',
  email: 'Email',
  tel: 'Phone',
  select: 'Dropdown',
  checkbox: 'Checkbox',
};

const EXAMPLES = [
  'A dropdown for preferred contact method',
  'A date field for next follow-up',
  'A number field for deal size',
  'A checkbox for newsletter opt-in',
];

// --- Lightweight "AI" that infers a field from a natural-language description ---
function inferOptions(p: string): string[] {
  if (/\bpriorit/.test(p)) return ['Low', 'Medium', 'High'];
  if (/\brating|temperature\b/.test(p)) return ['Cold', 'Warm', 'Hot'];
  if (/\bstatus|stage\b/.test(p)) return ['New', 'In progress', 'Closed'];
  if (/\bsource\b/.test(p)) return ['Referral', 'Website', 'Ad', 'Event'];
  if (/\bmethod|contact\b/.test(p)) return ['Email', 'Phone', 'Text', 'In person'];
  if (/\btier|plan\b/.test(p)) return ['Bronze', 'Silver', 'Gold'];
  if (/\bregion|territory\b/.test(p)) return ['North', 'South', 'East', 'West'];
  return ['Option 1', 'Option 2', 'Option 3'];
}

function inferType(p: string): FieldType {
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

function inferLabel(prompt: string): string {
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

interface AddFieldWithAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (field: CustomField) => void;
}

type Stage = 'prompt' | 'generating' | 'review';

export function AddFieldWithAIModal({ isOpen, onClose, onAddField }: AddFieldWithAIModalProps) {
  const [prompt, setPrompt] = useState('');
  const [stage, setStage] = useState<Stage>('prompt');
  const [draft, setDraft] = useState<CustomField | null>(null);
  const [optionsText, setOptionsText] = useState('');

  if (!isOpen) return null;

  const reset = () => {
    setPrompt('');
    setStage('prompt');
    setDraft(null);
    setOptionsText('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const generate = () => {
    if (!prompt.trim()) return;
    setStage('generating');
    // Simulate a Method AI round-trip.
    setTimeout(() => {
      const p = prompt.toLowerCase();
      const type = inferType(p);
      const options = type === 'select' ? inferOptions(p) : undefined;
      const field: CustomField = {
        id: `cf-${Date.now()}`,
        label: inferLabel(prompt),
        type,
        options,
        placeholder: type === 'text' ? `Enter ${inferLabel(prompt).toLowerCase()}` : undefined,
      };
      setDraft(field);
      setOptionsText(options ? options.join(', ') : '');
      setStage('review');
    }, 1100);
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
            <h2 className="text-lg font-semibold text-gray-900">Add a field with Method AI</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {stage === 'prompt' && (
            <>
              <p className="text-sm text-gray-600 mb-3">
                Describe the field you want to add to this screen, and Method AI will build it.
              </p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Add a dropdown for preferred contact method"
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
                  Generate field
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
                Here's the field Method AI created — tweak it if you'd like.
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
                  Add to screen
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
