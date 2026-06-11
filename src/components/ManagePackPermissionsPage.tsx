import { useState } from 'react';
import { ChevronLeft, LayoutGrid } from 'lucide-react';

interface ManagePackPermissionsPageProps {
  name: string;
  description?: string;
  onBack?: () => void;
  /** Open a user's Applications Access screen, scrolled to this app. */
  onSelectUser?: (user: string) => void;
}

const users = ['Diego', 'Tyler Copeland', 'Tyler C', 'nirmithdalmeida', 'Elaine v1', 'tyler wc'];

export function ManagePackPermissionsPage({ name, description, onBack, onSelectUser }: ManagePackPermissionsPageProps) {
  const [usersCollapsed, setUsersCollapsed] = useState(false);
  const [permsExpanded, setPermsExpanded] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-8">
      {/* Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-200">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <LayoutGrid className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Manage {name} Permissions</h1>
      </div>

      {/* Pack name + description */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{name}</h2>
      {description && <p className="text-gray-600 max-w-2xl mb-8">{description}</p>}

      {/* User Summary */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-blue-700">User Summary</h3>
        <button
          onClick={() => setUsersCollapsed((v) => !v)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          {usersCollapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>
      {!usersCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {users.map((u) => (
            <button
              key={u}
              onClick={() => onSelectUser?.(u)}
              className="rounded-md border border-gray-200 overflow-hidden text-left hover:border-blue-300 hover:shadow-sm transition-shadow"
            >
              <div className="h-0.5 bg-blue-600" />
              <div className="px-4 py-4 text-gray-800">{u}</div>
            </button>
          ))}
          <button className="rounded-md border-2 border-dashed border-gray-300 py-4 text-sm font-semibold text-blue-600 hover:bg-gray-50">
            Add New User
          </button>
        </div>
      )}

      {/* Permissions */}
      <div className="flex items-center justify-between mb-3 border-t border-gray-100 pt-6">
        <h3 className="text-base font-semibold text-blue-700">Permissions</h3>
        <button
          onClick={() => setPermsExpanded((v) => !v)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          {permsExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {permsExpanded && (
        <p className="text-sm text-gray-500">
          Configure who can view, create, edit, and delete records in this app.
        </p>
      )}

      {/* Save */}
      <div className="flex justify-end mt-10">
        <button className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  );
}
