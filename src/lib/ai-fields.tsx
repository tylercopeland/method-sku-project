import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { type CustomField, type FieldContext } from '@/components/AddFieldWithAIModal';
import { AddFieldWithAIPanel } from '@/components/AddFieldWithAIPanel';

/**
 * Universal "Add field with AI" layer.
 *
 * Fields are stored per entity type (e.g. all `customer` fields), so a field
 * created on a list surfaces as a column AND on every detail record as a
 * control — one definition, two render targets. Values are stored per record.
 *
 * Any screen participates by:
 *   1. calling `useFieldSurface(...)` so the global launcher knows the context, and
 *   2. dropping in `<AIFieldGroup>` (detail) and/or the list helpers below.
 */

// ---------------------------------------------------------------------------
// Context + provider
// ---------------------------------------------------------------------------

type FieldLauncherMode = 'inline' | 'global';

interface AIFieldsApi {
  enabled: boolean;
  /** Where the launcher lives: inline per-section, or one global top-nav button. */
  mode: FieldLauncherMode;
  /** Field definitions for an entity (shared across its list + details). */
  getFields: (entityType: string) => CustomField[];
  addField: (entityType: string, field: CustomField) => void;
  removeField: (entityType: string, fieldId: string) => void;
  /** Per-record values, keyed by entity + record id. */
  getValue: (entityType: string, recordId: string, fieldId: string) => string;
  setValue: (entityType: string, recordId: string, fieldId: string, value: string) => void;
  /** The surface currently on screen, used by the global header launcher. */
  activeSurface: FieldContext | null;
  registerSurface: (ctx: FieldContext | null) => void;
  /** Open the builder. Falls back to the active surface when no context given. */
  openAddField: (ctx?: FieldContext) => void;
  /** The open chat request (null when the panel is closed). */
  request: FieldContext | null;
  /** Close the chat panel. */
  closeRequest: () => void;
}

const AIFieldsContext = createContext<AIFieldsApi | null>(null);

let fieldSeq = 0;
const nextId = () => `cf-${++fieldSeq}-${fieldSeq * 31 + 7}`;

export function AIFieldsProvider({
  enabled,
  mode = 'global',
  children,
}: {
  enabled: boolean;
  mode?: FieldLauncherMode;
  children: ReactNode;
}) {
  const [fieldsByEntity, setFieldsByEntity] = useState<Record<string, CustomField[]>>({});
  const [valuesByRecord, setValuesByRecord] = useState<Record<string, Record<string, string>>>({});
  const [activeSurface, setActiveSurface] = useState<FieldContext | null>(null);
  const [pending, setPending] = useState<FieldContext | null>(null);

  const getFields = useCallback(
    (entityType: string) => fieldsByEntity[entityType] ?? [],
    [fieldsByEntity],
  );

  const addField = useCallback((entityType: string, field: CustomField) => {
    setFieldsByEntity((prev) => ({
      ...prev,
      [entityType]: [...(prev[entityType] ?? []), { ...field, id: field.id || nextId() }],
    }));
  }, []);

  const removeField = useCallback((entityType: string, fieldId: string) => {
    setFieldsByEntity((prev) => ({
      ...prev,
      [entityType]: (prev[entityType] ?? []).filter((f) => f.id !== fieldId),
    }));
  }, []);

  const getValue = useCallback(
    (entityType: string, recordId: string, fieldId: string) =>
      valuesByRecord[`${entityType}:${recordId}`]?.[fieldId] ?? '',
    [valuesByRecord],
  );

  const setValue = useCallback(
    (entityType: string, recordId: string, fieldId: string, value: string) => {
      const key = `${entityType}:${recordId}`;
      setValuesByRecord((prev) => ({
        ...prev,
        [key]: { ...(prev[key] ?? {}), [fieldId]: value },
      }));
    },
    [],
  );

  const registerSurface = useCallback((ctx: FieldContext | null) => setActiveSurface(ctx), []);

  const openAddField = useCallback(
    (ctx?: FieldContext) => {
      const target = ctx ?? activeSurface;
      if (target) setPending(target);
    },
    [activeSurface],
  );

  const api = useMemo<AIFieldsApi>(
    () => ({
      enabled,
      mode,
      getFields,
      addField,
      removeField,
      getValue,
      setValue,
      activeSurface,
      registerSurface,
      openAddField,
      request: pending,
      closeRequest: () => setPending(null),
    }),
    [enabled, mode, getFields, addField, removeField, getValue, setValue, activeSurface, registerSurface, openAddField, pending],
  );

  return <AIFieldsContext.Provider value={api}>{children}</AIFieldsContext.Provider>;
}

/**
 * Mounts the Add-field chat panel. Render this inside the app layout (below the
 * top banner, beside the content) so the panel pushes content instead of
 * overlaying the whole viewport.
 */
export function AddFieldChatPanel() {
  const { request, activeSurface, closeRequest, addField } = useAIFields();
  // The panel follows the screen you're on: `request` controls open/closed, while
  // the live `activeSurface` drives the context (pill, copy) and where fields land.
  const context = activeSurface ?? request ?? undefined;
  return (
    <AddFieldWithAIPanel
      isOpen={request !== null}
      context={context}
      onClose={closeRequest}
      onAddField={(field) => {
        // Keep the panel open so the user can keep chatting and add more fields.
        if (context) addField(context.entityType, { ...field, group: context.group });
      }}
    />
  );
}

export function useAIFields(): AIFieldsApi {
  const ctx = useContext(AIFieldsContext);
  if (!ctx) throw new Error('useAIFields must be used within <AIFieldsProvider>');
  return ctx;
}

/**
 * Convenience hook for a screen working with one entity's fields. Also registers
 * the current surface so the global header launcher targets the right place.
 */
export function useEntityFields(entityType: string, entityLabel: string, surface: 'list' | 'detail') {
  const api = useAIFields();
  useFieldSurface({ entityType, entityLabel, surface });
  return {
    enabled: api.enabled,
    fields: api.getFields(entityType),
    addField: (field: CustomField) => api.addField(entityType, field),
    removeField: (fieldId: string) => api.removeField(entityType, fieldId),
    getValue: (recordId: string, fieldId: string) => api.getValue(entityType, recordId, fieldId),
    setValue: (recordId: string, fieldId: string, value: string) =>
      api.setValue(entityType, recordId, fieldId, value),
    open: () => api.openAddField({ entityType, entityLabel, surface }),
  };
}

/**
 * Drop-in registrar so a screen that doesn't manage its own fields still exposes
 * the global Customize launcher. Renders nothing.
 */
export function FieldSurfaceRegistrar({
  entityType,
  entityLabel,
  surface = 'detail',
}: {
  entityType: string;
  entityLabel: string;
  surface?: 'list' | 'detail';
}) {
  useFieldSurface({ entityType, entityLabel, surface });
  return null;
}

/** Register the on-screen surface so the global launcher knows where to add. */
export function useFieldSurface(ctx: FieldContext) {
  const { registerSurface } = useAIFields();
  const { entityType, entityLabel, surface } = ctx;
  useEffect(() => {
    registerSurface({ entityType, entityLabel, surface });
    return () => registerSurface(null);
  }, [registerSurface, entityType, entityLabel, surface]);
}

// ---------------------------------------------------------------------------
// Shared rendering
// ---------------------------------------------------------------------------

/** Read-only display of a field value, for list cells. */
export function formatFieldValue(field: CustomField, value: string): string {
  if (!value) return '—';
  if (field.type === 'checkbox') return value === 'true' ? 'Yes' : 'No';
  return value;
}

/** Editable control for a custom field, used on detail screens. */
export function CustomFieldControl({
  field,
  value,
  onChange,
}: {
  field: CustomField;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select…</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={value === 'true'}
          onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
          className="accent-blue-600 w-4 h-4"
        />
        Yes
      </label>
    );
  }

  return (
    <Input
      type={field.type}
      value={value}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm"
    />
  );
}

/**
 * Renders AI-added fields for an entity (optionally limited to one sub-section
 * via `group`) as editable controls, plus an inline launcher to add more. Drop
 * it inside any detail section. Pass `heading={null}` to blend into a section
 * that already has its own title. Renders nothing when the experience is off.
 */
export function AIFieldGroup({
  entityType,
  entityLabel,
  recordId,
  group,
  heading = 'Custom Fields',
  launcherLabel = 'Add field with AI',
}: {
  entityType: string;
  entityLabel: string;
  recordId: string;
  group?: string;
  heading?: string | null;
  launcherLabel?: string;
}) {
  const api = useAIFields();
  if (!api.enabled) return null;
  // A group renders its own fields; an ungrouped instance (no `group`) collects
  // fields added without a section — i.e. those added via the global launcher.
  const fields = api.getFields(entityType).filter((f) => (group ? f.group === group : !f.group));
  // The inline launcher only belongs to the inline mode; in global mode the
  // single top-nav launcher replaces it.
  const showLauncher = api.mode === 'inline';

  if (!showLauncher && fields.length === 0) return null;

  return (
    <div className={heading ? '' : 'mt-4'}>
      {heading && fields.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{heading}</h3>
        </div>
      )}

      {fields.length > 0 && (
        <div className="space-y-4 mb-4">
          {fields.map((field) => (
            <div key={field.id} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  {field.label}
                </div>
                <button
                  onClick={() => api.removeField(entityType, field.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                  aria-label={`Remove ${field.label}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <CustomFieldControl
                field={field}
                value={api.getValue(entityType, recordId, field.id)}
                onChange={(v) => api.setValue(entityType, recordId, field.id, v)}
              />
            </div>
          ))}
        </div>
      )}

      {showLauncher && (
        <AddFieldLauncher
          onClick={() => api.openAddField({ entityType, entityLabel, surface: 'detail', group })}
          label={launcherLabel}
          variant="link"
        />
      )}
    </div>
  );
}

/**
 * Inline launcher, reused on lists and details. `variant="dashed"` renders the
 * boxed dashed button; `variant="link"` renders a lightweight text link.
 */
export function AddFieldLauncher({
  onClick,
  label,
  className = '',
  variant = 'dashed',
}: {
  onClick: () => void;
  label: string;
  className?: string;
  variant?: 'dashed' | 'link';
}) {
  if (variant === 'link') {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {label}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-purple-300 bg-purple-50/40 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors ${className}`}
    >
      <Sparkles className="w-4 h-4" />
      {label}
    </button>
  );
}

/**
 * Global launcher for the top header — available on every screen. Opens the
 * builder against whatever surface is currently registered. Renders nothing
 * until the experience is enabled and a surface is in view.
 */
export function GlobalAddFieldButton() {
  const { enabled, mode, activeSurface, openAddField } = useAIFields();
  if (!enabled || mode !== 'global' || !activeSurface) return null;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => openAddField()}
            aria-label="Customize the screen by adding a custom field using Method AI"
            className="group inline-flex h-6 min-w-[24px] items-center justify-center rounded-full border border-purple-200 bg-purple-50 px-1 text-xs font-semibold text-purple-600 hover:bg-purple-100 hover:px-2.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:ml-1 group-hover:max-w-[80px] group-hover:opacity-100">
              Customize
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="max-w-[15rem] p-3 bg-white text-left border border-gray-200 shadow-lg"
        >
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            Customize with Method AI
          </div>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            Customize this screen by adding a custom field — just describe it and Method AI builds it.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
