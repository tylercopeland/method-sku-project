import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { Sparkles, X, Wrench } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
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
  /** Id of the field added most recently (for a brief glow); null once it clears. */
  lastAddedId: string | null;
  /** Per-record values, keyed by entity + record id. */
  getValue: (entityType: string, recordId: string, fieldId: string) => string;
  setValue: (entityType: string, recordId: string, fieldId: string, value: string) => void;
  /** The surface currently on screen, used by the global header launcher. */
  activeSurface: FieldContext | null;
  registerSurface: (ctx: FieldContext | null) => void;
  /** Open the builder. Falls back to the active surface when no context given. */
  openAddField: (ctx?: FieldContext) => void;
  /** Open the full App Builder for deeper customization (undefined when not wired). */
  openAppBuilder?: () => void;
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
  onOpenAppBuilder,
  children,
}: {
  enabled: boolean;
  mode?: FieldLauncherMode;
  onOpenAppBuilder?: () => void;
  children: ReactNode;
}) {
  const [fieldsByEntity, setFieldsByEntity] = useState<Record<string, CustomField[]>>({});
  const [valuesByRecord, setValuesByRecord] = useState<Record<string, Record<string, string>>>({});
  const [activeSurface, setActiveSurface] = useState<FieldContext | null>(null);
  const [pending, setPending] = useState<FieldContext | null>(null);
  // The most recently added field id — drives a brief "just added" glow, then clears.
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const getFields = useCallback(
    (entityType: string) => fieldsByEntity[entityType] ?? [],
    [fieldsByEntity],
  );

  const addField = useCallback((entityType: string, field: CustomField) => {
    const id = field.id || nextId();
    setFieldsByEntity((prev) => ({
      ...prev,
      [entityType]: [...(prev[entityType] ?? []), { ...field, id }],
    }));
    setLastAddedId(id);
    // Clear after the glow animation so it only plays once on add.
    setTimeout(() => setLastAddedId((curr) => (curr === id ? null : curr)), 1800);
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
      lastAddedId,
      getValue,
      setValue,
      activeSurface,
      registerSurface,
      openAddField,
      openAppBuilder: onOpenAppBuilder,
      request: pending,
      closeRequest: () => setPending(null),
    }),
    [enabled, mode, getFields, addField, removeField, lastAddedId, getValue, setValue, activeSurface, registerSurface, openAddField, onOpenAppBuilder, pending],
  );

  return <AIFieldsContext.Provider value={api}>{children}</AIFieldsContext.Provider>;
}

/**
 * Mounts the Add-field chat panel. Render this inside the app layout (below the
 * top banner, beside the content) so the panel pushes content instead of
 * overlaying the whole viewport.
 */
export function AddFieldChatPanel({
  onOpenAppBuilder,
  appBuilderLocked = false,
  onUpgrade,
  onOpenHelpCenter,
  appState = 'normal',
}: {
  onOpenAppBuilder?: () => void;
  appBuilderLocked?: boolean;
  onUpgrade?: () => void;
  onOpenHelpCenter?: () => void;
  appState?: 'normal' | 'empty' | 'locked';
} = {}) {
  const { request, activeSurface, closeRequest, addField } = useAIFields();
  // The panel follows the screen you're on: `request` controls open/closed, while
  // the live `activeSurface` drives the context (pill, copy) and where fields land.
  const context = activeSurface ?? request ?? undefined;

  // Close the panel when you navigate to a screen with no field surface (e.g. Home).
  // App→app navigation keeps a surface registered, so it stays open there.
  useEffect(() => {
    if (request && !activeSurface) closeRequest();
  }, [request, activeSurface, closeRequest]);
  return (
    <AddFieldWithAIPanel
      isOpen={request !== null}
      context={context}
      onClose={closeRequest}
      onAddField={(field) => {
        // Keep the panel open so the user can keep chatting and add more fields.
        if (context) addField(context.entityType, { ...field, group: context.group });
      }}
      onOpenAppBuilder={
        onOpenAppBuilder
          ? () => {
              closeRequest();
              onOpenAppBuilder();
            }
          : undefined
      }
      appBuilderLocked={appBuilderLocked}
      appState={appState}
      onUpgrade={
        onUpgrade
          ? () => {
              closeRequest();
              onUpgrade();
            }
          : undefined
      }
      onOpenHelpCenter={
        onOpenHelpCenter
          ? () => {
              closeRequest();
              onOpenHelpCenter();
            }
          : undefined
      }
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
export function useFieldSurface(ctx: FieldContext, enabled = true) {
  const { registerSurface } = useAIFields();
  const { entityType, entityLabel, surface } = ctx;
  useEffect(() => {
    // An embedded mirror (e.g. the App Builder canvas) passes enabled=false so it
    // doesn't register/clear the global surface and steal it from the live screen.
    if (!enabled) return;
    registerSurface({ entityType, entityLabel, surface });
    return () => registerSurface(null);
  }, [registerSurface, entityType, entityLabel, surface, enabled]);
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
            <div
              key={field.id}
              className={`group ${field.id === api.lastAddedId ? 'field-added-glow' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-gray-900">{field.label}</div>
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
  const { enabled, mode, activeSurface, openAddField, openAppBuilder } = useAIFields();
  // The menu opens on hover (not just click). We control `open` ourselves so a short
  // close delay bridges the gap between the trigger and the menu content.
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  if (!enabled || mode !== 'global' || !activeSurface) return null;

  // On Essentials there is no "App Builder" option, so the menu has a single action and
  // the button doubles as a direct shortcut to the chat. On richer plans the button only
  // surfaces the menu — the action comes from picking an item.
  const buttonIsShortcut = !openAppBuilder;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        {/* The "Customize" CTA label is always shown so the call to action is never
            hidden. On hover — or while the menu is open — the background darkens
            slightly and the border picks up the icon/text color. */}
        <button
          aria-label="Customize the screen by adding a custom field using Method AI"
          onMouseEnter={() => {
            cancelClose();
            setOpen(true);
          }}
          onMouseLeave={scheduleClose}
          onClick={() => {
            if (buttonIsShortcut) {
              cancelClose();
              setOpen(false);
              openAddField();
            }
          }}
          className="group inline-flex h-6 flex-shrink-0 items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 text-xs font-semibold text-purple-600 transition-all hover:bg-purple-100 hover:border-purple-600 data-[state=open]:bg-purple-100 data-[state=open]:border-purple-600"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="ml-1 whitespace-nowrap">Customize</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-64"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <DropdownMenuItem onSelect={() => openAddField()} className="cursor-pointer gap-2 py-2">
          <Sparkles className="w-4 h-4 shrink-0 text-purple-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Quick Customize with AI</span>
            <span className="text-xs leading-snug text-gray-500">
              Describe a field and Method AI adds it to this screen.
            </span>
          </div>
        </DropdownMenuItem>
        {openAppBuilder && (
          <DropdownMenuItem onSelect={() => openAppBuilder()} className="cursor-pointer gap-2 py-2">
            <Wrench className="w-4 h-4 shrink-0 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">Customize in App Builder</span>
              <span className="text-xs leading-snug text-gray-500">
                Open the full builder for deeper changes.
              </span>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
