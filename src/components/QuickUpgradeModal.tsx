import { useState } from 'react';
import { X, Check, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import type { ActiveSubscription } from './SubscriptionPage';
import { plans, ANNUAL_DISCOUNT } from './SubscriptionPage';

const MOCK_BILLING = {
  name: 'Paul McLane',
  line1: '123 King St W, Suite 400',
  city: 'Toronto, ON M5H 1B5',
};

interface QuickUpgradeModalProps {
  targetPlanId: string;
  isChangingPlan: boolean;
  currentCardLast4?: string;
  onClose: () => void;
  onViewAllPlans: () => void;
  onUpdateBilling: () => void;
  onSubscribed: (sub: ActiveSubscription) => void;
}

export function QuickUpgradeModal({
  targetPlanId,
  isChangingPlan,
  currentCardLast4,
  onClose,
  onViewAllPlans,
  onUpdateBilling,
  onSubscribed,
}: QuickUpgradeModalProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const plan = plans.find(p => p.id === targetPlanId);
  if (!plan) return null;

  const monthly = plan.monthlyPrice;
  const annualMonthly = Math.round(monthly * (1 - ANNUAL_DISCOUNT));
  const annualTotal = Math.round(monthly * 12 * (1 - ANNUAL_DISCOUNT));
  const savingsPct = Math.round(ANNUAL_DISCOUNT * 100);
  const yearlySavings = (monthly - annualMonthly) * 12;
  const displayPrice = billing === 'monthly' ? monthly : annualMonthly;
  const cardLast4 = currentCardLast4 ?? '4242';

  return (
    <div className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl flex relative">

      {/* Floating close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* ── Left: plan info + features ─────────────────────────────────── */}
      <div className="flex-1 px-8 py-8 flex flex-col border-r border-gray-100 min-h-0">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">{plan.eyebrow}</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to {plan.name}</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-xs">{plan.description}</p>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">{plan.includedLabel}</p>
        <div className="space-y-3.5 flex-1">
          {plan.features.slice(0, 5).map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <span className="text-sm text-gray-700 leading-snug">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onViewAllPlans}
          className="mt-8 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors self-start"
        >
          Compare all plans <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Right: billing toggle + price + payment + CTA ──────────────── */}
      <div className="w-80 flex-shrink-0 px-7 py-8 bg-gray-50/40 flex flex-col">

        {/* Billing toggle */}
        <div className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-100 p-0.5 mb-6 self-start">
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
            Annual
            <span className="text-xs font-bold text-green-500">−{savingsPct}%</span>
          </button>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="text-4xl font-extrabold text-gray-900">${displayPrice}</span>
            <span className="text-base text-gray-400">/mo</span>
          </div>
          {billing === 'annual' ? (
            <p className="text-sm font-medium text-green-600">
              ${annualTotal}/year · saves ${yearlySavings} vs monthly
            </p>
          ) : (
            <p className="text-sm text-gray-400">Billed monthly · cancel anytime</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {plan.seats} seats included{plan.extraSeatPrice ? ` · +$${plan.extraSeatPrice}/user after` : ''}
          </p>
        </div>

        {/* Combined payment + billing address tile */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-5">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
            <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Visa ···· {cardLast4}</p>
              <p className="text-xs text-gray-400">Default payment method</p>
            </div>
          </div>
          <div className="flex items-start justify-between px-4 py-3">
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="font-medium text-gray-700 mb-0.5">{MOCK_BILLING.name}</p>
              <p>{MOCK_BILLING.line1}</p>
              <p>{MOCK_BILLING.city}</p>
            </div>
            <button
              onClick={onUpdateBilling}
              className="text-xs font-medium text-blue-600 hover:underline ml-4 mt-0.5 flex-shrink-0"
            >
              Update
            </button>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() =>
            onSubscribed({ planId: plan.id as 'essentials' | 'build' | 'scale', billingCycle: billing, cardLast4 })
          }
          className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors mb-4"
        >
          Upgrade to {plan.name}
        </button>

        {/* Security */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
          Secure checkout · 30-day money-back guarantee
        </div>
      </div>
    </div>
  );
}
