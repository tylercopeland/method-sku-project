import { useState } from 'react';
import { X, Check, ArrowRight, Users } from 'lucide-react';
import type { ActiveSubscription } from './SubscriptionPage';
import { plans, ANNUAL_DISCOUNT } from './SubscriptionPage';

interface QuickUpgradeModalProps {
  targetPlanId: string;
  onClose: () => void;
  onViewAllPlans: () => void;
  onSubscribed: (sub: ActiveSubscription) => void;
}

export function QuickUpgradeModal({ targetPlanId, onClose, onViewAllPlans, onSubscribed }: QuickUpgradeModalProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const plan = plans.find(p => p.id === targetPlanId);
  if (!plan) return null;

  const monthlyPrice = plan.monthlyPrice;
  const annualMonthly = Math.round(monthlyPrice * (1 - ANNUAL_DISCOUNT));
  const annualTotal = Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT));
  const savingsPct = Math.round(ANNUAL_DISCOUNT * 100);
  const annualSavings = (monthlyPrice - annualMonthly) * 12;
  const displayPrice = billing === 'monthly' ? monthlyPrice : annualMonthly;

  const topFeatures = plan.features.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl overflow-hidden w-full max-w-md shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">{plan.eyebrow}</p>
          <h2 className="text-xl font-bold text-gray-900">Upgrade to {plan.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{plan.description}</p>
        </div>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 ml-3 flex-shrink-0 mt-0.5">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-5">
        {/* Billing toggle */}
        <div className="flex items-center gap-3 mb-5">
          <div className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-100 p-0.5">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                billing === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                billing === 'annual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Annually
              <span className={`text-xs font-bold ${billing === 'annual' ? 'text-green-600' : 'text-green-500'}`}>
                Save {savingsPct}%
              </span>
            </button>
          </div>
        </div>

        {/* Price block */}
        <div className="bg-gray-50 rounded-2xl px-5 py-4 mb-5">
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="text-4xl font-extrabold text-gray-900">${displayPrice}</span>
            <span className="text-base text-gray-500 font-medium">/mo</span>
          </div>
          {billing === 'annual' ? (
            <p className="text-sm text-gray-500">Billed as <span className="font-medium text-gray-700">${annualTotal}/year</span> · cancel anytime</p>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Billed monthly · cancel anytime</p>
              <button onClick={() => setBilling('annual')} className="text-xs font-semibold text-green-600 hover:text-green-700">
                Save ${annualSavings}/yr →
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{plan.seats} seat{plan.seats !== 1 ? 's' : ''} included</span>
            {plan.extraSeatPrice && (
              <span className="text-gray-400 text-xs">· +${plan.extraSeatPrice}/user after</span>
            )}
          </div>
        </div>

        {/* Top features */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{plan.includedLabel}</p>
          <div className="space-y-2.5">
            {topFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blue-600" strokeWidth={2.5} />
                </div>
                <span className="text-sm text-gray-700 leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() =>
            onSubscribed({ planId: plan.id as 'essentials' | 'build' | 'scale', billingCycle: billing, cardLast4: '4242' })
          }
          className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors mb-3 flex items-center justify-center gap-2"
        >
          Upgrade to {plan.name} — ${displayPrice}/mo
        </button>

        {/* View all plans */}
        <button
          onClick={onViewAllPlans}
          className="w-full text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 py-1 transition-colors"
        >
          View tier comparison <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
