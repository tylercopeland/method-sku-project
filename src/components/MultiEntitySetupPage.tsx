import { ChevronLeft, Building2, ArrowRight, AlertCircle, Lock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { ActiveSubscription } from '@/components/SubscriptionPage';

interface MultiEntitySetupPageProps {
  subscription: ActiveSubscription | null;
  onBack: () => void;
  onEnableMultiEntity: () => void;
  onUpgrade?: (planId: string) => void;
}

const FEATURES = [
  {
    title: 'Manage multiple QuickBooks companies',
    description: 'Connect and manage multiple QuickBooks accounts from a single Method login.',
  },
  {
    title: 'Centralized user access',
    description: 'Control which team members can access which sub-entities with role-based permissions.',
  },
  {
    title: 'Consolidated reporting',
    description: 'View performance metrics and activity across all your entities in one dashboard.',
  },
  {
    title: 'Global settings overrides',
    description: 'Push shared preferences like branding and workflows across all sub-entities at once.',
  },
];

export function MultiEntitySetupPage({
  subscription,
  onBack,
  onEnableMultiEntity,
  onUpgrade,
}: MultiEntitySetupPageProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  const isOnScale = subscription?.planId === 'scale';
  const canEnable = isOnScale;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Account Settings
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Multi-entity setup</h1>
            <p className="text-sm text-gray-500 mt-0.5">Scale plan add-on · $40 / sub-entity / month</p>
          </div>
        </div>

        {/* Requires Scale banner (SKU1 / SKU2) */}
        {!canEnable && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900">Scale plan required</p>
              <p className="text-sm text-amber-800 mt-0.5">
                Multi-entity management is only available on the Scale plan (SKU3). Upgrade to unlock
                this feature for your account.
              </p>
            </div>
            {onUpgrade && (
              <button
                onClick={() => onUpgrade('scale')}
                className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap flex-shrink-0"
              >
                Upgrade to Scale
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Feature highlights */}
        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 mb-6">
          <div className="px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">What you get with multi-entity</h2>
            <p className="text-sm text-gray-500 mt-1">
              Designed for businesses managing multiple franchises, locations, or QuickBooks accounts.
            </p>
          </div>
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3 px-5 py-4">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{f.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enable section */}
        <div className={`rounded-xl border ${canEnable ? 'border-gray-200' : 'border-gray-100 opacity-60'} bg-white px-5 py-5`}>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Enable multi-entity</h2>
          <p className="text-sm text-gray-500 mb-4">
            Read and acknowledge the terms before enabling.
          </p>

          {/* Permanent lock warning */}
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 mb-4">
            <Lock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">
              <span className="font-semibold">This action is permanent and cannot be undone.</span>{' '}
              Enabling multi-entity locks your account to the Scale plan. You will no longer be able to
              downgrade or switch to a different plan. Each sub-entity costs an additional $40/month
              as an add-on to your Scale subscription.
            </p>
          </div>

          {/* Acknowledge checkbox */}
          <label className={`flex items-start gap-3 mb-5 ${canEnable ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => canEnable && setAcknowledged(e.target.checked)}
              disabled={!canEnable}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 cursor-inherit"
            />
            <span className="text-sm text-gray-700">
              I understand that enabling multi-entity is permanent, locks this account to the Scale plan,
              and adds $40/month per sub-entity to my subscription.
            </span>
          </label>

          <button
            disabled={!acknowledged || !canEnable}
            onClick={onEnableMultiEntity}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Enable multi-entity
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
