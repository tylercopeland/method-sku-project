import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Check,
  Sparkles,
  CreditCard,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For solo operators getting organized.',
    monthlyPrice: 25,
    annualPrice: 20,
    features: [
      '1 user',
      'Customers & leads',
      'Estimates & invoices',
      'QuickBooks sync',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams that need automation.',
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      'Up to 5 users',
      'Everything in Starter',
      'Workflow automation',
      'Web to lead forms',
      'Activity tracking & reminders',
      'Priority support',
    ],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For established businesses at scale.',
    monthlyPrice: 99,
    annualPrice: 79,
    features: [
      'Unlimited users',
      'Everything in Pro',
      'Custom fields & apps',
      'Advanced reporting',
      'Dedicated success manager',
      'Phone support',
    ],
  },
];

type BillingCycle = 'monthly' | 'annual';
type Step = 'plans' | 'checkout' | 'success';

// --- Cosmetic formatting helpers (presentation only, no real validation) ---
const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const onlyDigits = (value: string, max: number) =>
  value.replace(/\D/g, '').slice(0, max);

interface SubscriptionPageProps {
  onBack?: () => void;
  onSubscribed?: (planId: string) => void;
}

export function SubscriptionPage({ onBack, onSubscribed }: SubscriptionPageProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('plans');
  const [processing, setProcessing] = useState(false);

  // Card form state (controlled inputs, matching the app's convention)
  const [card, setCard] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
    zip: '',
  });

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null;
  const unitPrice = selectedPlan
    ? billingCycle === 'annual'
      ? selectedPlan.annualPrice
      : selectedPlan.monthlyPrice
    : 0;
  // Annual is billed up front for the year; monthly is billed per month.
  const total = billingCycle === 'annual' ? unitPrice * 12 : unitPrice;

  const handleSubscribe = (planId: string) => {
    setSelectedPlanId(planId);
    setStep('checkout');
  };

  const handleUseTestCard = () => {
    setCard({
      name: 'Paul Casey',
      number: '4242 4242 4242 4242',
      expiry: '12/29',
      cvc: '123',
      zip: '90210',
    });
  };

  const handlePay = () => {
    if (processing) return;
    setProcessing(true);
    // Simulate a payment-processor round trip so it feels real on screen.
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
      if (selectedPlanId) onSubscribed?.(selectedPlanId);
    }, 1400);
  };

  // ----------------------------- SUCCESS -----------------------------
  if (step === 'success' && selectedPlan) {
    return (
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            You're all set — {selectedPlan.name} is active
          </h1>
          <p className="text-gray-600 mb-6">
            Your account is unlocked and everything from your trial is saved. Welcome aboard!
          </p>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-left mb-6">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-500">Plan</span>
              <span className="font-medium text-gray-900">
                {selectedPlan.name} ({billingCycle === 'annual' ? 'Annual' : 'Monthly'})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Charged today</span>
              <span className="font-medium text-gray-900">${total.toLocaleString()}</span>
            </div>
          </div>

          <Button
            onClick={onBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go to your dashboard
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            Demo — no real card was charged.
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------- CHECKOUT -----------------------------
  if (step === 'checkout' && selectedPlan) {
    return (
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStep('plans')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to plans
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Payment form */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Payment details</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Enter your card to activate your subscription.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="card-name">Cardholder name</Label>
                  <Input
                    id="card-name"
                    placeholder="Paul Casey"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="card-number">Card number</Label>
                  <div className="relative">
                    <Input
                      id="card-number"
                      inputMode="numeric"
                      placeholder="1234 1234 1234 1234"
                      value={card.number}
                      onChange={(e) =>
                        setCard({ ...card, number: formatCardNumber(e.target.value) })
                      }
                      className="pr-10"
                    />
                    <CreditCard className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="card-expiry">Expiry</Label>
                    <Input
                      id="card-expiry"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) =>
                        setCard({ ...card, expiry: formatExpiry(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input
                      id="card-cvc"
                      inputMode="numeric"
                      placeholder="123"
                      value={card.cvc}
                      onChange={(e) =>
                        setCard({ ...card, cvc: onlyDigits(e.target.value, 4) })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="card-zip">Billing ZIP</Label>
                  <Input
                    id="card-zip"
                    inputMode="numeric"
                    placeholder="90210"
                    value={card.zip}
                    onChange={(e) =>
                      setCard({ ...card, zip: onlyDigits(e.target.value, 10) })
                    }
                  />
                </div>

                <button
                  onClick={handleUseTestCard}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Use test card
                </button>
              </div>

              <Button
                onClick={handlePay}
                disabled={processing}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing payment…
                  </>
                ) : (
                  `Subscribe & pay $${total.toLocaleString()}`
                )}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-4">
                <Lock className="w-3 h-3" />
                Demo — no real card is charged.
              </p>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Order summary
                </h3>

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{selectedPlan.name} plan</p>
                    <p className="text-xs text-gray-500">
                      Billed {billingCycle === 'annual' ? 'annually' : 'monthly'}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${unitPrice}
                    <span className="text-xs font-normal text-gray-500">/user/mo</span>
                  </p>
                </div>

                {billingCycle === 'annual' && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    You're saving 20% with annual billing
                  </div>
                )}

                <div className="border-t border-gray-100 my-4" />

                <div className="flex justify-between items-baseline mb-4">
                  <span className="font-semibold text-gray-900">Total due today</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${total.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  Secure checkout · 30-day money-back guarantee
                </div>

                <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400">
                  <span className="px-1.5 py-0.5 rounded border border-gray-200">VISA</span>
                  <span className="px-1.5 py-0.5 rounded border border-gray-200">MASTERCARD</span>
                  <span className="px-1.5 py-0.5 rounded border border-gray-200">AMEX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------ PLANS ------------------------------
  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            7 days left in your trial
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Choose your plan
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Keep everything you set up during your trial. Pick the plan that fits
            your business — upgrade, downgrade, or cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Annual
              <span className="text-xs font-semibold text-green-600">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl border p-6 flex flex-col ${
                  plan.highlighted
                    ? 'border-blue-600 shadow-md ring-1 ring-blue-600'
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}

                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">{plan.description}</p>

                <div className="mb-5">
                  <span className="text-4xl font-bold text-gray-900">${price}</span>
                  <span className="text-gray-500 text-sm">/user/mo</span>
                  {billingCycle === 'annual' && (
                    <p className="text-xs text-gray-400 mt-1">Billed annually</p>
                  )}
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full mb-6 ${
                    plan.highlighted
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {`Subscribe to ${plan.name}`}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-sm text-gray-500">
            All plans include a 30-day money-back guarantee. Questions?{' '}
            <button className="text-blue-600 hover:underline font-medium">
              Talk to sales
            </button>
          </p>
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="text-gray-500">
              Maybe later
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
