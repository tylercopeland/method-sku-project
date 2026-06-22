import {
  LayoutGrid, Users, Wrench, Phone, BookOpen, AlertCircle, ArrowRight, X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);

  useEffect(() => {
    if (!settingUp) return;
    setSetupProgress(0);
    const duration = 3000;
    const interval = 50;
    const step = 100 / (duration / interval);
    const timer = setInterval(() => {
      setSetupProgress(p => {
        const next = p + step;
        if (next >= 100) {
          clearInterval(timer);
          onEnableMultiEntity();
          return 100;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [settingUp]);

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

            {/* Pricing note */}
            <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 mb-6">
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-800">
                <span className="font-semibold">$40/month per entity</span> — billed in addition to your Scale plan subscription.
              </p>
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
                I understand that enabling multi-entity management is permanent, locks this account
                to the Scale plan, and includes additional multi-entity pricing with a dedicated
                support &amp; customization plan.
              </span>
            </label>

            {/* Enable button */}
            <button
              disabled={!acknowledged || !canEnable}
              onClick={() => setConfirmOpen(true)}
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

      {/* Confirmation modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative">
            <button
              onClick={() => setConfirmOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16">
                {/* Chat bubble base */}
                <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                  <circle cx="32" cy="28" r="26" fill="#EEF2FF" />
                  <path d="M22 44 l4-8" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {/* Warning triangle overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-blue-700" />
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-3">Confirm action</h2>
            <div className="text-sm text-gray-600 text-center mb-6 leading-relaxed space-y-2">
              <p>
                This change is permanent and new pricing will be applied (
                <button className="text-blue-600 hover:underline font-medium">learn more</button>
                ).
              </p>
              <p>
                Your account will be{' '}
                <span className="font-semibold text-gray-800">permanently locked to Scale</span>
                {' '}with no option to downgrade. A new{' '}
                <span className="font-semibold text-gray-800">Super Admin</span> role will be
                introduced and you will become the sole Super Admin.
              </p>
              <p>
                If you have any questions or concerns,{' '}
                <button className="text-blue-600 hover:underline font-medium">
                  book a call with our team
                </button>
                .
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go back
              </button>
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setSettingUp(true);
                }}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Enable feature
              </button>
            </div>
          </div>
        </div>
      )}

      {settingUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm px-8 py-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
              <LayoutGrid className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">Setting up Multi-Entity</h2>
            <p className="text-sm text-gray-500 text-center mb-7">Configuring your account, just a moment…</p>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-[width] duration-100 ease-linear rounded-full"
                style={{ width: `${setupProgress}%` }}
              />
            </div>
            <p className="text-xs font-medium text-blue-600 mt-2">{Math.round(setupProgress)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
