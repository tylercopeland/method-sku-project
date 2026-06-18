import { useState } from 'react';
import { ChevronLeft, LayoutGrid } from 'lucide-react';
import { ManagePackPermissionsPage } from '@/components/ManagePackPermissionsPage';
import { appTiles } from '@/components/AppsGrid';

type Icon = React.ComponentType<{ className?: string }>;

interface Pack {
  name: string;
  description?: string;
  icon: Icon;
}

// Only the apps you actually have installed — mirrors the home App tab + sidebar order.
const installedApps: Pack[] = appTiles.map((tile) => ({
  name: tile.name,
  description: tile.description,
  icon: tile.icon,
}));

function PackCard({ name, description, icon: Icon, onClick }: Pack & { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col h-44 bg-white border border-gray-200 rounded-md overflow-hidden text-left hover:border-blue-300 hover:shadow-sm transition-shadow"
    >
      <div className="h-0.5 bg-blue-600 flex-shrink-0" />
      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">{name}</h3>
        <div className="flex gap-3 flex-1 min-h-0">
          <Icon className="w-7 h-7 text-blue-500 flex-shrink-0 mt-0.5" />
          {description && (
            <p className="text-xs text-gray-500 leading-snug line-clamp-5">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
}

interface AppMarketplacePageProps {
  onBack?: () => void;
  /** Open a user's Applications Access screen, scrolled to the given app. */
  onOpenUserAccess?: (user: string, appName: string) => void;
}

export function AppMarketplacePage({ onBack, onOpenUserAccess }: AppMarketplacePageProps) {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  // Clicking a pack opens its permissions screen.
  if (selectedPack) {
    return (
      <ManagePackPermissionsPage
        name={selectedPack.name}
        description={selectedPack.description}
        onBack={() => setSelectedPack(null)}
        onSelectUser={(user) => onOpenUserAccess?.(user, selectedPack.name)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
      {/* Back + title */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-3"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-200">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <LayoutGrid className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">App Launchpad</h1>
      </div>

      {/* Your installed apps — same set + order as the home App tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Create Custom App — leading tile */}
        <button className="flex h-44 items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-50/40">
          Create Custom App
        </button>
        {installedApps.map((pack) => (
          <PackCard key={pack.name} {...pack} onClick={() => setSelectedPack(pack)} />
        ))}
      </div>
    </div>
  );
}
