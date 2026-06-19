import { useState } from 'react';
import { ChevronLeft, LayoutGrid, Lock, ArrowRight } from 'lucide-react';
import { ManagePackPermissionsPage } from '@/components/ManagePackPermissionsPage';
import { appTiles } from '@/components/AppsGrid';

type Icon = React.ComponentType<{ className?: string }>;

interface Pack {
  name: string;
  description?: string;
  icon: Icon;
  /** Build-tier app — locked for Essentials subscribers. */
  lockKey?: string;
}

// Only the apps you actually have installed — mirrors the home App tab + sidebar order.
const installedApps: Pack[] = appTiles.map((tile) => ({
  name: tile.name,
  description: tile.description,
  icon: tile.icon,
  lockKey: tile.lockKey,
}));

function PackCard({
  name,
  description,
  icon: Icon,
  locked = false,
  onClick,
  onUpgrade,
}: Pack & { locked?: boolean; onClick?: () => void; onUpgrade?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col h-44 bg-white border border-gray-200 rounded-md overflow-hidden text-left cursor-pointer transition-shadow ${
        locked ? 'hover:ring-2 hover:ring-blue-200' : 'hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      <div className={`h-0.5 flex-shrink-0 ${locked ? 'bg-gray-300' : 'bg-blue-600'}`} />
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className={`text-sm font-semibold ${locked ? 'text-gray-500' : 'text-gray-800'}`}>{name}</h3>
          {locked && <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
        </div>
        <div className={`flex gap-3 flex-1 min-h-0 ${locked ? 'opacity-60' : ''}`}>
          <Icon className={`w-7 h-7 flex-shrink-0 mt-0.5 ${locked ? 'text-gray-400' : 'text-blue-500'}`} />
          {description && (
            <p className="text-xs text-gray-500 leading-snug line-clamp-4">{description}</p>
          )}
        </div>
        {locked && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpgrade?.();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Lock className="w-3 h-3" />
              Upgrade to unlock
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface AppMarketplacePageProps {
  onBack?: () => void;
  /** Open a user's Applications Access screen, scrolled to the given app. */
  onOpenUserAccess?: (user: string, appName: string) => void;
  /** Build-tier apps locked for the current (Essentials) subscriber. */
  lockedApps?: string[];
  /** Open a locked app's empty/value state (the upgrade-required preview). */
  onOpenApp?: (lockKey: string) => void;
  /** Go to the full upgrade screen (not a modal). */
  onUpgrade?: () => void;
}

export function AppMarketplacePage({ onBack, onOpenUserAccess, lockedApps = [], onOpenApp, onUpgrade }: AppMarketplacePageProps) {
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
        <h1 className="text-2xl font-semibold text-gray-900">App Marketplace</h1>
      </div>

      {/* Your installed apps — same set + order as the home App tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Create Custom App — leading tile */}
        <button className="flex h-44 items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-50/40">
          Create Custom App
        </button>
        {installedApps.map((pack) => {
          const locked = !!pack.lockKey && lockedApps.includes(pack.lockKey);
          return (
            <PackCard
              key={pack.name}
              {...pack}
              locked={locked}
              onClick={() =>
                locked && pack.lockKey ? onOpenApp?.(pack.lockKey) : setSelectedPack(pack)
              }
              onUpgrade={onUpgrade}
            />
          );
        })}
      </div>
    </div>
  );
}
