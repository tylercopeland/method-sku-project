import {
  LayoutGrid, Users, Wrench, Phone, BookOpen, AlertCircle, ArrowRight,
} from 'lucide-react';
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
    Icon: LayoutGrid,
    title: 'Global Overview',
    description: 'View and manage all entities in one place.',
  },
  {
    Icon: Users,
    title: 'Centralized User Management',
    description:
      'Easily add users across all entities and manage their permissions, paying just once per user under a single subscription, no matter how many entities they belong to.',
  },
  {
    Icon: Wrench,
    title: 'Tailored Experience',
    description:
      'Access dedicated customization services for managing customizations across all your entities with our Professional Services team, supporting your unique workflows and maximizing multi-entity value.',
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
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm mb-5">
          <button
            onClick={onBack}
            className="text-blue-600 hover:underline font-medium"
          >
            Account Settings
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Multi-entity management</span>
        </nav>

        {/* Page title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Multi-entity setup</h1>
        <p className="text-sm text-gray-500 mb-6">
          Connect more than one QuickBooks database to the same Method account.
        </p>

        {/* Upgrade banner for SKU1/2 */}
        {!canEnable && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 mb-6">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900">Scale plan required</p>
              <p className="text-sm text-amber-800 mt-0.5">
                Multi-entity management is only available on the Scale plan. Upgrade to unlock this
                feature.
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5 items-start">

          {/* Left card: features + enable */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Why multi-entity makes sense</h2>
            <p className="text-sm text-gray-600 mb-7">
              Manage your entities (companies or franchisees) in one place with enhanced performance
              visibility, centralized access and shared customizations among accounts. Suitable only
              for accounts using the same QuickBooks version.
            </p>

            {/* Feature list */}
            <div className="space-y-6 mb-8">
              {FEATURES.map(({ Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{title}</p>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Acknowledge checkbox */}
            <label
              className={`flex items-start gap-3 mb-5 ${canEnable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            >
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => canEnable && setAcknowledged(e.target.checked)}
                disabled={!canEnable}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">
                I understand that enabling multi-entity management is permanent, locks this account to
                Scale, and introduces a Super Admin role. The user who enables multi-entity becomes
                the account Super Admin — the only role required for admin access. Each sub-entity is
                an additional $40/month (
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={(e) => e.preventDefault()}
                >
                  see pricing details
                </button>
                ).
              </span>
            </label>

            {/* Enable button */}
            <button
              disabled={!acknowledged || !canEnable}
              onClick={onEnableMultiEntity}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Enable multi-entity
            </button>
          </div>

          {/* Right card: support */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Not sure if multi-entity management is a right fit for you? Read our help article to
              learn more, or book a demo for personalized guidance.
            </p>
            <div className="flex flex-col gap-3">
              <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                <BookOpen className="w-4 h-4" />
                Read help article
              </button>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                <Phone className="w-4 h-4" />
                Talk to our team
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
