import { useState } from 'react';
import { X, Check, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import type { ActiveSubscription } from './SubscriptionPage';
import { plans, ANNUAL_DISCOUNT } from './SubscriptionPage';

// Mock billing address — consistent with mock card 4242 on file
const MOCK_BILLING = {
  name: 'Paul McLane',
  line1: '123 King St W, Suite 400',
  city: 'Toronto, ON M5H 1B5',
  country: 'Canada',
};

interface QuickUpgradeModalProps {
  targetPlanId: string;
  isChangingPlan: boolean; // true when upgrading from an existing subscription
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
  const newRate = billing === 'annual' ? annualTotal : displayPrice;
  const cardLast4 = currentCardLast4 ?? '4242';

  const handleUpgrade = () => {
    onSubscribed({
      planId: plan.id as 'essentials' | 'build' | 'scale',
      billingCycle: billing,
      cardLast4,
    });
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl flex flex-col sm:flex-row">

      {/* ── Left column: plan info + toggle + benefits ─────────────────── */}
      <div className="flex-1 px-7 py-7 flex flex-col border-b sm:border-b-0 sm:border-r border-gray-100">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">{plan.eyebrow}</p>
            <h2 className="text-xl font-bold text-gray-900">Upgrade to {plan.name}</h2>
            <p className="text-sm text-gray-500 mt-1 leading-snug">{plan.description}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 ml-3 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billing toggle */}
        <div className="mb-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Billing cycle</p>
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
          {billing === 'monthly' && (
            <button
              onClick={() => setBilling('annual')}
              className="block mt-1.5 text-xs text-green-600 hover:text-green-700 font-medium"
            >
              Switch to annual — save ${yearlySavings}/year →
            </button>
          )}
        </div>

        {/* Top benefits */}
        <div className="mt-5 flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{plan.includedLabel}</p>
          <div className="space-y-2.5">
            {plan.features.slice(0, 4).map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blue-600" strokeWidth={2.5} />
                </div>
                <span className="text-sm text-gray-700 leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* View tier comparison */}
        <button
          onClick={onViewAllPlans}
          className="mt-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Compare all plans <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Right column: order summary ─────────────────────────────────── */}
      <div className="w-full sm:w-72 flex-shrink-0 px-6 py-7 bg-gray-50/60 flex flex-col">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Order summary</p>

        {/* Plan line */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-sm font-semibold text-gray-900">{plan.name} plan</p>
            <p className="text-xs text-gray-500">
              Billed {billing === 'annual' ? 'annually' : 'monthly'} · {plan.seats} seat{plan.seats !== 1 ? 's' : ''} included
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900 whitespace-nowrap ml-2">
            ${displayPrice}<span className="text-xs font-normal text-gray-400">/mo</span>
          </p>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* New rate */}
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm font-semibold text-gray-900">
            {isChangingPlan ? 'New rate' : 'Total due today'}
          </span>
          <span className="text-2xl font-bold text-gray-900">${newRate.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          {billing === 'annual'
            ? `Billed as $${annualTotal.toLocaleString()}/year`
            : isChangingPlan
            ? 'The prorated difference appears on your next invoice.'
            : 'Billed monthly · cancel anytime'}
        </p>

        {/* Card on file */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5 mb-3">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800">Visa ending in {cardLast4}</p>
              <p className="text-xs text-gray-400">Card on file</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">Default</span>
        </div>

        {/* Billing address */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">{MOCK_BILLING.name}</p>
            <p className="text-xs text-gray-400">{MOCK_BILLING.line1}</p>
            <p className="text-xs text-gray-400">{MOCK_BILLING.city}</p>
            <p className="text-xs text-gray-400">{MOCK_BILLING.country}</p>
          </div>
          <button
            onClick={onUpdateBilling}
            className="text-xs text-blue-600 hover:underline whitespace-nowrap ml-3 mt-0.5 flex-shrink-0"
          >
            Update billing
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors mb-3"
        >
          Upgrade to {plan.name}
        </button>

        {/* Security */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
          Secure checkout · 30-day money-back guarantee
        </div>
        <div className="flex items-center gap-1.5">
          {['VISA', 'MASTERCARD', 'AMEX'].map(b => (
            <span key={b} className="px-1.5 py-0.5 border border-gray-200 rounded text-[10px] font-semibold text-gray-400">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
