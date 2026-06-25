import { useState, useEffect, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Check,
  Sparkles,
  CreditCard,
  Loader2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Users,
  X,
  AlertTriangle,
  Heart,
  PhoneCall,
  Minus,
  CalendarClock,
} from 'lucide-react';

interface Plan {
  id: string;
  eyebrow: string;
  name: string;
  description: string;
  monthlyPrice: number;
  seats: number;
  extraSeatPrice?: number; // monthly $/user charged beyond the included seats
  contactSales?: boolean; // sales-assisted plan — no self-serve checkout or hard price
  seatsNote: string; // text shown after "N seats included ·"
  includedLabel: string;
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
}

// Annual billing = 20% off the monthly rate.
export const ANNUAL_DISCOUNT = 0.20;
const annualPerMonth = (monthly: number) => Math.round(monthly * (1 - ANNUAL_DISCOUNT));
const annualYearly = (monthly: number) => Math.round(monthly * 12 * (1 - ANNUAL_DISCOUNT));

export type { Plan };
export const plans: Plan[] = [
  {
    id: 'essentials',
    eyebrow: 'Solo operators',
    name: 'Essentials',
    description:
      'Full Method for one user. All core apps, QuickBooks sync, and customer management — no team complexity. Upgrade to Build when you\'re ready to grow.',
    monthlyPrice: 50,
    seats: 1,
    seatsNote: 'Single-user plan — upgrade to Build to add your team',
    includedLabel: "What's included",
    features: [
      'All stock apps — CRM, invoicing, proposals, cases',
      'QuickBooks sync (full, two-way)',
      'Unlimited contacts',
      'Custom fields on existing screens',
      'Email sender — up to 1,000 / mo',
      'Method Pay',
      'Help centre + ticket support',
    ],
    ctaLabel: 'Start with Essentials',
  },
  {
    id: 'build',
    eyebrow: 'Growing teams',
    name: 'Build',
    description:
      'Custom workflows, AI-assisted building, and guided setup — for teams ready to run Method their way.',
    monthlyPrice: 200,
    seats: 3,
    extraSeatPrice: 59,
    seatsNote: 'Additional full seats: $59/user · Field crew: $18/user',
    includedLabel: 'Everything in Essentials, plus',
    features: [
      'Full screen & workflow designer',
      'AI app builder — describe it, Method builds it',
      'Automations & app routines',
      'API access',
      'Multi-user apps — Field Crew, Jobs, Schedules, Inventory',
      'Higher email + SMS limits',
      'Dedicated onboarding session',
      'CSM setup guidance + priority support',
    ],
    ctaLabel: 'Continue with Build',
    highlighted: true,
  },
  {
    id: 'scale',
    eyebrow: 'Established businesses',
    name: 'Scale',
    description:
      'A dedicated Method expert builds, maintains and grows your setup alongside your business.',
    monthlyPrice: 500,
    seats: 8,
    extraSeatPrice: 79,
    seatsNote: 'Additional seats: $79/user',
    includedLabel: 'Everything in Build, plus',
    features: [
      'Dedicated Expert Partner (DEP) — named contact',
      'Included build hours every month',
      'They build it — you approve it',
      'Multi-entity support',
      'Quarterly business review',
      'Proactive workflow audits',
      'Migration & data support',
      'Custom SLA',
    ],
    ctaLabel: 'Continue with Scale',
  },
];

// Full feature comparison — columns map to [Essentials, Build, Scale].
// Cell value: true = included, false = not included, string = qualifier text.
type ComparisonCell = boolean | string;
const FEATURE_COMPARISON: { title: string; rows: { label: string; values: ComparisonCell[] }[] }[] = [
  {
    title: 'Core',
    rows: [
      { label: 'QuickBooks sync', values: [true, true, true] },
      { label: 'Unlimited contacts', values: [true, true, true] },
      { label: 'Core apps (Invoices, Payments, Customers, etc.)', values: [true, true, true] },
      { label: 'Method Pay', values: [true, true, true] },
      { label: 'Customer portal branding', values: [true, true, true] },
      { label: 'Custom fields', values: [true, true, true] },
      { label: 'Included seats', values: ['1 seat (solo only)', '3 seats', '8 seats'] },
      { label: 'Additional full seats', values: [false, '$59/user', '$79/user'] },
      { label: 'Field crew seats', values: [false, '$18/user', '$18/user'] },
      { label: 'View-only seats (free)', values: [false, 'Free', 'Free'] },
    ],
  },
  {
    title: 'Customization',
    rows: [
      { label: 'App Studio (draft only)', values: [true, true, true] },
      { label: 'App Studio: create & publish', values: [false, true, true] },
      { label: 'App Routines & workflows', values: [false, true, true] },
      { label: 'Custom global search', values: [false, true, true] },
      { label: 'Multi-user apps (Field Crew, Jobs, etc.)', values: [false, true, true] },
      { label: 'Tables & custom fields', values: ['Limited', 'Full', 'Full'] },
    ],
  },
  {
    title: 'Integrations & API',
    rows: [
      { label: 'Zapier, Mailchimp, Google integrations', values: [true, true, true] },
      { label: 'API access', values: [false, true, true] },
      { label: 'API limits', values: [false, 'Standard', 'Higher limits'] },
    ],
  },
  {
    title: 'AI',
    rows: [
      { label: 'AI credits', values: [false, 'Included monthly', 'More credits'] },
      { label: 'AI App Builder assist', values: [false, true, true] },
    ],
  },
  {
    title: 'Email',
    rows: [{ label: 'Monthly email sends', values: ['1,000/mo', '5,000/mo', 'Higher limits'] }],
  },
  {
    title: 'Support',
    rows: [
      { label: 'Live chat & email support', values: [true, true, true] },
      { label: 'Sales demo', values: [true, true, true] },
      { label: 'Free onboarding hour', values: [true, true, true] },
      { label: 'Pay-per-use Professional Services', values: [true, true, true] },
      { label: 'CSM shared pool', values: [false, true, true] },
      { label: 'Dedicated Customer Success Manager', values: [false, false, true] },
      { label: 'Dedicated Expert Program (DEP)', values: [false, false, true] },
    ],
  },
  {
    title: 'Scale',
    rows: [
      { label: 'Multi-entity support', values: [false, false, true] },
      { label: 'Method Pay scale discounts', values: [false, false, true] },
    ],
  },
];

function ComparisonValue({ value }: { value: ComparisonCell }) {
  if (value === true) return <Check className="w-4 h-4 text-blue-600 mx-auto" />;
  if (value === false) return <Minus className="w-4 h-4 text-gray-300 mx-auto" />;
  return <span className="text-gray-700">{value}</span>;
}

// The "Full feature comparison" table shown beneath the plan cards.
function FeatureComparison({ planNames, highlightIndex }: { planNames: string[]; highlightIndex: number }) {
  const colCount = planNames.length + 1;
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">Full feature comparison</h2>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-gray-50/70">
              <th className="text-left font-semibold text-gray-900 px-4 sm:px-6 py-4 w-2/5">Feature</th>
              {planNames.map((name, i) => (
                <th
                  key={name}
                  className={`px-4 py-4 text-center font-semibold ${
                    i === highlightIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURE_COMPARISON.map((section) => (
              <Fragment key={section.title}>
                <tr>
                  <td
                    colSpan={colCount}
                    className="bg-gray-50/70 px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-500"
                  >
                    {section.title}
                  </td>
                </tr>
                {section.rows.map((row) => (
                  <tr key={row.label} className="border-t border-gray-100">
                    <td className="px-4 sm:px-6 py-3.5 text-gray-700">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className={`px-4 py-3.5 text-center ${i === highlightIndex ? 'bg-blue-50/40' : ''}`}
                      >
                        <ComparisonValue value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type BillingCycle = 'monthly' | 'annual';
type Step = 'plans' | 'checkout' | 'success' | 'manage' | 'cancel' | 'canceled' | 'downgrade' | 'billing';

export interface ActiveSubscription {
  planId: string;
  billingCycle: BillingCycle;
  cardLast4: string;
  /** Set when the user has canceled but still has access through the end of the paid period. */
  cancelAtPeriodEnd?: boolean;
  /** A downgrade scheduled for the end of the current period — access stays on the
   *  current plan until `effectiveDate`, then switches to `planId`. */
  scheduledDowngrade?: { planId: string; effectiveDate: string };
}

// Why someone is leaving — collected on the cancel screen for retention/feedback.
const CANCEL_REASONS = [
  'Too expensive',
  'Missing features I need',
  'Switching to another tool',
  "I'm not using it enough",
  'Just exploring — not ready yet',
  'Other',
];

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
  onSubscribed?: (subscription: ActiveSubscription) => void;
  /** Confirm a cancellation — the parent decides whether it's a trial or paid subscription. */
  onCancel?: (reason: string) => void;
  /** Reverse a pending cancellation (re-activate the trial or subscription). */
  onResume?: () => void;
  /** Schedule a downgrade for the end of the period (planId = target, plus date). */
  onScheduleDowngrade?: (planId: string, effectiveDate: string) => void;
  /** Cancel a scheduled downgrade and keep the current plan. */
  onCancelDowngrade?: () => void;
  activeSubscription?: ActiveSubscription | null;
  /** Whether the user is still within their free trial (first charge deferred to trial end). */
  isInTrial?: boolean;
  /** Human-readable trial end / first-charge date, e.g. "June 14, 2026". */
  trialEndLabel?: string;
  /** Known team size — drives seat math and the headcount fallback recommendation. */
  teamSize?: number;
  /** What the user has done during the trial — drives a behavior-based recommendation. */
  trialUsage?: {
    customAppsBuilt?: number;
    publishedApps?: number;
    draftApps?: number;
    automationsCreated?: number;
    workflowDesignerOpened?: boolean;
  };
  /** For subscribed users, which view to open on: the manage card or the change-plan grid. */
  initialStep?: 'manage' | 'plans' | 'billing';
  /** Render the checkout (payment + order summary) inline as a page, or in a modal. */
  checkoutMode?: 'inline' | 'modal';
  /** Whether the user has App Studio access (a Build-tier capability). Drives the
   *  "what you'll lose" warning when a builder picks Essentials. */
  hasAppStudioAccess?: boolean;
  /** Emphasize the annual discount: strike through the full price on annual and
   *  show the discounted monthly price as a savings nudge on monthly. */
  showDiscountedPrice?: boolean;
  /** Promo discount applied to the monthly price only (e.g. from demo controls). */
  discountName?: string;
  discountPct?: number;
  /** Pre-select this plan and jump straight to checkout (used by the upgrade modal). */
  upgradeFromPlanId?: string;
  /** Called when the user clicks "Upgrade plan" in the manage view — lets the parent
   *  open an upgrade modal instead of navigating within this component. */
  onUpgrade?: (planId: string) => void;
  /** When true, multi-entity is enabled and the plan is locked to Scale permanently. */
  multiEntityEnabled?: boolean;
}

export function SubscriptionPage({
  onBack,
  onSubscribed,
  onCancel,
  onResume,
  onScheduleDowngrade,
  onCancelDowngrade,
  activeSubscription,
  isInTrial = false,
  trialEndLabel = '',
  teamSize = 1,
  trialUsage,
  initialStep = 'manage',
  checkoutMode = 'inline',
  hasAppStudioAccess = false,
  showDiscountedPrice = true,
  discountName,
  discountPct,
  upgradeFromPlanId,
  onUpgrade,
  multiEntityEnabled = false,
}: SubscriptionPageProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    upgradeFromPlanId ? 'monthly' : (activeSubscription?.billingCycle ?? 'monthly')
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    upgradeFromPlanId ?? activeSubscription?.planId ?? null
  );
  // If upgradeFromPlanId is set, jump straight to checkout for that plan.
  // Otherwise, open on the requested view (manage by default, or plans grid when upgrading).
  const [step, setStep] = useState<Step>(
    initialStep === 'billing' ? 'billing' : upgradeFromPlanId ? 'checkout' : (activeSubscription ? initialStep : 'plans')
  );
  const [processing, setProcessing] = useState(false);

  // Keep the manage/billing views in sync with the active plan, so changing it
  // externally (e.g. via the demo controls) updates the subscription card live.
  useEffect(() => {
    if (activeSubscription && (step === 'manage' || step === 'billing')) {
      setSelectedPlanId(activeSubscription.planId);
    }
  }, [activeSubscription?.planId, step]);

  // Card form state (controlled inputs, matching the app's convention)
  const [card, setCard] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
    zip: '',
  });

  const [salesContacted, setSalesContacted] = useState<string | null>(null);

  // Cancel flow: selected reason (retention) + optional free-text detail.
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDetail, setCancelDetail] = useState('');

  // Downgrade flow: downgrades are sales-assisted (data migration), so they route to
  // a "talk to sales" request rather than self-serve checkout.
  const [salesRequested, setSalesRequested] = useState(false);
  const [downgradeContact, setDowngradeContact] = useState({ email: '', phone: '', note: '' });

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null;
  const unitPrice = selectedPlan
    ? billingCycle === 'annual'
      ? annualPerMonth(selectedPlan.monthlyPrice)
      : selectedPlan.monthlyPrice
    : 0;
  // Seat math for the selected plan: charge extra for any users beyond the included seats.
  const includedSeats = selectedPlan?.seats ?? 0;
  const extraSeatsCount = selectedPlan ? Math.max(0, teamSize - includedSeats) : 0;
  const extraSeatMonthly = selectedPlan?.extraSeatPrice
    ? billingCycle === 'annual'
      ? annualPerMonth(selectedPlan.extraSeatPrice)
      : selectedPlan.extraSeatPrice
    : 0;
  const seatsMonthly = extraSeatsCount * extraSeatMonthly;
  const hasExtraSeats = extraSeatsCount > 0 && extraSeatMonthly > 0;
  // Effective amounts include seats; these are what the customer is actually charged.
  const effectiveMonthly = unitPrice + seatsMonthly;
  const total = billingCycle === 'annual' ? effectiveMonthly * 12 : effectiveMonthly;
  // Annual savings vs. paying the same seats month-to-month for a year.
  const fullMonthlyAllSeats = selectedPlan
    ? selectedPlan.monthlyPrice + extraSeatsCount * (selectedPlan.extraSeatPrice ?? 0)
    : 0;
  const annualSavings = Math.max(0, fullMonthlyAllSeats * 12 - total);

  // Recommendation rationale: prefer trial behavior, fall back to headcount.
  const builtApps = trialUsage?.customAppsBuilt ?? 0;
  const builtAutomations = trialUsage?.automationsCreated ?? 0;
  const usedBuildFeatures = builtApps > 0 || builtAutomations > 0 || Boolean(trialUsage?.workflowDesignerOpened);

  // A builder picking Essentials will lose Build-tier capabilities — warn them first.
  // Triggers when they have App Studio access and have actually built something in the trial.
  const isBuilderDowngradingToEssentials =
    hasAppStudioAccess && (builtApps > 0 || builtAutomations > 0 || Boolean(trialUsage?.workflowDesignerOpened));
  const buildPlan = plans.find((p) => p.id === 'build') ?? null;

  // A human-readable summary of what they built, e.g. "1 published app and 1 draft".
  const publishedAppsCount = trialUsage?.publishedApps ?? 0;
  const draftAppsCount = trialUsage?.draftApps ?? 0;
  const builtAppsPhrase =
    [
      publishedAppsCount > 0
        ? `${publishedAppsCount} published app${publishedAppsCount === 1 ? '' : 's'}`
        : null,
      draftAppsCount > 0 ? `${draftAppsCount} draft${draftAppsCount === 1 ? '' : 's'}` : null,
    ]
      .filter(Boolean)
      .join(' and ') ||
    (builtApps > 0 ? `${builtApps} app${builtApps === 1 ? '' : 's'}` : 'apps');
  const recommendationBadge = isInTrial
    ? 'Current trial'
    : usedBuildFeatures
    ? 'Recommended for you'
    : `Best for your team of ${teamSize}`;
  // The middle plan (Build) is always highlighted as the default recommendation.
  const recommendedPlanId = 'build';

  // Change-plan context: when an active subscription exists, the plan grid and
  // checkout switch into "change plan" mode (current plan highlighted, others
  // labeled upgrade/downgrade, card-on-file confirmation).
  const isChangingPlan = Boolean(activeSubscription);
  const currentPlanIndex = activeSubscription
    ? plans.findIndex((p) => p.id === activeSubscription.planId)
    : -1;
  const currentPlan = activeSubscription
    ? plans.find((p) => p.id === activeSubscription.planId) ?? null
    : null;

  // A scheduled (not yet effective) downgrade: target plan + the features lost when
  // it takes effect (the additive tiers between the target and the current plan).
  const scheduledDowngrade = activeSubscription?.scheduledDowngrade;
  const downgradeTargetPlan = scheduledDowngrade
    ? plans.find((p) => p.id === scheduledDowngrade.planId) ?? null
    : null;
  const downgradeLostFeatures =
    scheduledDowngrade && downgradeTargetPlan && currentPlanIndex >= 0
      ? plans
          .slice(plans.findIndex((p) => p.id === scheduledDowngrade.planId) + 1, currentPlanIndex + 1)
          .flatMap((p) => p.features)
      : [];
  const selectedPlanIndex = plans.findIndex((p) => p.id === selectedPlanId);
  const changeKind: 'upgrade' | 'downgrade' | 'new' =
    currentPlanIndex >= 0 && selectedPlanIndex >= 0
      ? selectedPlanIndex > currentPlanIndex
        ? 'upgrade'
        : 'downgrade'
      : 'new';

  // Next renewal date for an active paid subscription (one cycle from today).
  const nextBilling = new Date();
  if ((activeSubscription?.billingCycle ?? billingCycle) === 'annual') {
    nextBilling.setFullYear(nextBilling.getFullYear() + 1);
  } else {
    nextBilling.setMonth(nextBilling.getMonth() + 1);
  }
  const nextBillingLabel = nextBilling.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Cancel flow: what is being canceled and when access actually ends.
  // - In trial: access runs to the trial-end date, no charge ever happens.
  // - Paid subscriber: access runs to the end of the current paid period.
  // - Expired trial (no sub): nothing left to keep — closes right away.
  const cancelMode: 'subscription' | 'trial' = activeSubscription ? 'subscription' : 'trial';
  const accessEndsLabel = isInTrial
    ? trialEndLabel
    : activeSubscription
    ? nextBillingLabel
    : 'today';
  const isCanceling = Boolean(activeSubscription?.cancelAtPeriodEnd);

  const handleConfirmCancel = () => {
    onCancel?.(cancelDetail.trim() || cancelReason);
    setStep('canceled');
  };

  // Leave the success screen for the home dashboard, resetting the page's internal
  // step so it doesn't re-open on the success modal if the user comes back.
  const goToDashboard = () => {
    setStep('manage');
    onBack?.();
  };

  // Success confirmation content — shared by the inline (full-page) and modal experiences.
  const successContent = selectedPlan ? (
    <>
      <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <ShieldCheck className="w-8 h-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        {isChangingPlan
          ? `Your plan has been updated — ${selectedPlan.name} is now active`
          : `You're all set — ${selectedPlan.name} is active`}
      </h1>
      <p className="text-gray-600 mb-6">
        {isChangingPlan
          ? isInTrial
            ? `Your new plan is active right away. You won't be charged until ${trialEndLabel}.`
            : 'Your new plan is active right away. Your billing will reflect the change on your next invoice.'
          : isInTrial
          ? `Your account is unlocked — enjoy the rest of your trial. You won't be charged until ${trialEndLabel}.`
          : 'Your account is unlocked and everything from your trial is saved. Welcome aboard!'}
      </p>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-left mb-6">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-500">Plan</span>
          <span className="font-medium text-gray-900">
            {selectedPlan.name} ({billingCycle === 'annual' ? 'Annual' : 'Monthly'})
          </span>
        </div>
        {hasExtraSeats && (
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-500">Users</span>
            <span className="font-medium text-gray-900">
              {teamSize} ({includedSeats} included + {extraSeatsCount} × ${extraSeatMonthly}/mo)
            </span>
          </div>
        )}
        {isInTrial ? (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">First charge</span>
            <span className="font-medium text-gray-900">
              ${total.toLocaleString()} on {trialEndLabel}
            </span>
          </div>
        ) : (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{isChangingPlan ? 'New rate' : 'Charged today'}</span>
            <span className="font-medium text-gray-900">${total.toLocaleString()}</span>
          </div>
        )}
      </div>

      <Button onClick={goToDashboard} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Go to your dashboard
      </Button>
    </>
  ) : null;

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
      // A plan change lands on the subscription (manage) page, which already shows
      // the updated plan + billing details — no separate success modal. A brand-new
      // subscription still gets the welcome confirmation.
      setStep(isChangingPlan ? 'manage' : 'success');
      if (selectedPlanId) {
        // Reuse the card already on file when changing plans; otherwise read the entered card.
        const cardLast4 =
          isChangingPlan && activeSubscription
            ? activeSubscription.cardLast4
            : card.number.replace(/\D/g, '').slice(-4) || '0000';
        onSubscribed?.({ planId: selectedPlanId, billingCycle, cardLast4 });
      }
    }, 1400);
  };

  // --------------------------- BILLING PORTAL (static) ---------------------------
  if (step === 'billing') {
    return (
      <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#e8eef6]">
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
          <button
            onClick={() => setStep('manage')}
            className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to subscription
          </button>
          <div className="rounded-2xl overflow-hidden shadow-2xl flex" style={{ minHeight: 480 }}>
            {/* Left — login form (non-interactive) */}
            <div className="bg-white flex-1 flex flex-col items-center justify-center px-10 py-12 pointer-events-none select-none">
              <div className="mb-8 text-center">
                <span className="text-3xl font-bold tracking-tight">
                  <span className="text-gray-900">method</span>
                  <span className="text-blue-500">:CRM</span>
                </span>
              </div>
              <p className="text-base font-semibold text-gray-800 mb-6">Sign in to your portal</p>
              <div className="w-full max-w-xs space-y-3">
                <div className="flex items-center gap-3 border-2 border-blue-500 rounded-full px-4 py-2.5">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-blue-600 text-sm font-medium flex-1 text-center">Sign in with Google</span>
                </div>
                <div className="flex items-center gap-3 border-2 border-blue-500 rounded-full px-4 py-2.5">
                  <svg viewBox="0 0 23 23" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                    <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
                    <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
                    <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
                  </svg>
                  <span className="text-blue-600 text-sm font-medium flex-1 text-center">Sign in with Microsoft</span>
                </div>
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">Or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <p className="text-xs text-gray-500 text-center">Sign in easily with a one-time code</p>
                <div className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-400 bg-white">Email address</div>
                <div className="bg-blue-400 rounded-full px-4 py-2.5 text-center text-white text-sm font-medium opacity-80">Send code</div>
              </div>
              <p className="mt-8 text-xs text-gray-400">
                Powered by <span className="font-semibold text-gray-600">method</span>
              </p>
            </div>
            {/* Right — welcome panel */}
            <div className="w-64 flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 flex flex-col justify-center px-8 py-10 pointer-events-none select-none relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-20">
                {Array.from({ length: 6 }).map((_, row) => (
                  <div key={row} className="flex gap-2 mb-2">
                    {Array.from({ length: 5 }).map((_, col) => (
                      <div key={col} className="w-1.5 h-1.5 rounded-full bg-white" />
                    ))}
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 opacity-20">
                {Array.from({ length: 4 }).map((_, row) => (
                  <div key={row} className="flex gap-2 mb-2">
                    {Array.from({ length: 4 }).map((_, col) => (
                      <div key={col} className="w-1.5 h-1.5 rounded-full bg-white" />
                    ))}
                  </div>
                ))}
              </div>
              <p className="text-white text-lg font-bold mb-6 relative z-10">Welcome to your portal</p>
              <ul className="space-y-4 relative z-10">
                {['Secure and online', 'Access transaction history', 'Update personal information'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-white text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------- MANAGE (current subscription) ---------------------------
  if (step === 'manage' && selectedPlan) {
    return (
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Your subscription</h1>
              <p className="text-gray-500">Manage your plan and billing details.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setStep('billing')}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors px-3 py-2"
              >
                View billing details
              </button>
              <div className="relative group">
                <button
                  onClick={() => !multiEntityEnabled && setStep('plans')}
                  disabled={multiEntityEnabled}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    multiEntityEnabled
                      ? 'bg-blue-200 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Manage plan
                </button>
                {multiEntityEnabled && (
                  <div className="absolute top-full right-0 mt-2 w-64 rounded-lg bg-gray-900 px-3 py-2.5 text-xs text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                    <div className="absolute bottom-full right-4 border-4 border-transparent border-b-gray-900" />
                    Your plan is locked to Scale because multi-entity is enabled. To discuss plan changes,{' '}
                    <span className="underline">contact support</span> or visit the Help Center.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scheduled-downgrade notice — persists until the change takes effect */}
          {scheduledDowngrade && downgradeTargetPlan && !isCanceling && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <CalendarClock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">
                  Downgrade scheduled for {scheduledDowngrade.effectiveDate}
                </p>
                <p className="text-sm text-amber-800 mt-0.5">
                  You'll keep full {currentPlan?.name} access until then — your plan switches to{' '}
                  {downgradeTargetPlan.name} on {scheduledDowngrade.effectiveDate}. It hasn't taken
                  effect yet.
                </p>
                {downgradeLostFeatures.length > 0 && (
                  <p className="text-sm text-amber-800 mt-1">
                    On that date you'll lose access to{' '}
                    {downgradeLostFeatures.slice(0, 3).join(', ')}
                    {downgradeLostFeatures.length > 3 ? ', and more' : ''}.
                  </p>
                )}
                <Button
                  onClick={() => onCancelDowngrade?.()}
                  className="mt-3 h-8 bg-amber-600 hover:bg-amber-700 text-white text-sm"
                >
                  Keep current plan
                </Button>
              </div>
            </div>
          )}

          {/* Pending-cancellation notice — access continues until the period ends */}
          {isCanceling && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">
                  Your subscription is set to cancel
                </p>
                <p className="text-sm text-amber-800">
                  You'll keep {selectedPlan.name} access until{' '}
                  {isInTrial ? trialEndLabel : nextBillingLabel}. After that your account
                  will close and billing stops.
                </p>
                <Button
                  onClick={() => onResume?.()}
                  className="mt-3 h-8 bg-amber-600 hover:bg-amber-700 text-white text-sm"
                >
                  Resume subscription
                </Button>
              </div>
            </div>
          )}

          {/* Current plan card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedPlan.name}</h2>
                  {isCanceling ? (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Canceling
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{selectedPlan.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-gray-900">
                  ${effectiveMonthly.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">/mo</span>
                </p>
                <p className="text-xs text-gray-400">
                  Billed {billingCycle === 'annual' ? 'annually' : 'monthly'}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="divide-y divide-gray-100">
              <div className="flex justify-between items-center px-6 py-4">
                <span className="text-sm text-gray-500">Billing cycle</span>
                <span className="text-sm font-medium text-gray-900">
                  {billingCycle === 'annual' ? 'Annual' : 'Monthly'}
                </span>
              </div>
              <div className="flex justify-between items-center px-6 py-4">
                <span className="text-sm text-gray-500">Users</span>
                <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <Users className="w-4 h-4 text-gray-400" />
                  {teamSize} {teamSize === 1 ? 'user' : 'users'}
                  {hasExtraSeats && (
                    <span className="text-xs font-normal text-gray-400">
                      ({includedSeats} included + {extraSeatsCount} × ${extraSeatMonthly}/mo)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center px-6 py-4">
                <span className="text-sm text-gray-500">
                  {billingCycle === 'annual' ? 'Amount (per year)' : 'Amount (per month)'}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  ${total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center px-6 py-4">
                <span className="text-sm text-gray-500">
                  {isInTrial ? 'First charge' : 'Next billing date'}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {isInTrial ? trialEndLabel : nextBillingLabel}
                </span>
              </div>
              <div className="flex justify-between items-center px-6 py-4">
                <span className="text-sm text-gray-500">Payment method</span>
                <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  Visa ending in {activeSubscription?.cardLast4 ?? '••••'}
                </span>
              </div>
            </div>

            {/* What's included */}
            <div className="px-6 py-5 bg-gray-50/60 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-900 mb-3">What's included</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedPlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Multi-entity lock banner */}
          {multiEntityEnabled && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 mt-6">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <div>
                <p className="text-sm font-semibold text-amber-900">Plan locked — multi-entity enabled</p>
                <p className="text-sm text-amber-800 mt-0.5">
                  Multi-entity management is active on this account. Your plan is permanently locked to Scale. To discuss plan changes, contact{' '}
                  <a href="mailto:support@method.me" className="underline font-medium">support@method.me</a>.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {!multiEntityEnabled && !isCanceling && (
            <div className="flex mt-6">
              <button
                onClick={() => {
                  setCancelReason('');
                  setCancelDetail('');
                  setStep('cancel');
                }}
                className="text-sm text-gray-400 hover:text-red-600 transition-colors"
              >
                Cancel subscription
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------- SUCCESS (inline / full-page) -----------------------------
  // In modal mode the same confirmation renders inside the modal (see PLANS return below).
  if (step === 'success' && selectedPlan && checkoutMode === 'inline') {
    return (
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-in fade-in zoom-in-95 duration-300">
          {successContent}
        </div>
      </div>
    );
  }

  // ----------------------------- CANCEL (confirm) -----------------------------
  if (step === 'cancel') {
    const losingPlan = currentPlan ?? selectedPlan;
    const loseFeatures = losingPlan?.features ?? [
      'Your custom apps, fields, and automations',
      'QuickBooks sync and everything it keeps in step',
      'Team access and saved workflows',
    ];
    const backStep: Step = cancelMode === 'subscription' ? 'manage' : 'plans';

    return (
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => setStep(backStep)}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            {cancelMode === 'subscription' ? 'Back to your subscription' : 'Back to plans'}
          </button>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {cancelMode === 'subscription'
                  ? 'Cancel your subscription?'
                  : 'Cancel your free trial?'}
              </h1>
              <p className="text-gray-600">
                {isInTrial ? (
                  <>
                    You won't be charged. You'll keep full access until your trial ends on{' '}
                    <span className="font-medium text-gray-900">{trialEndLabel}</span>, then your
                    account will close.
                  </>
                ) : cancelMode === 'subscription' ? (
                  <>
                    You'll keep {losingPlan?.name} access until{' '}
                    <span className="font-medium text-gray-900">{nextBillingLabel}</span>. We won't
                    renew after that, and you won't be charged again.
                  </>
                ) : (
                  <>Your trial has ended, so your Method account will close now.</>
                )}
              </p>
            </div>

            {/* What you'll lose */}
            <div className="px-6 sm:px-8 py-5 bg-gray-50/60 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                What you'll lose when {cancelMode === 'subscription' ? 'it ends' : 'your account closes'}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {loseFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reason */}
            <div className="p-6 sm:p-8">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Mind sharing why you're leaving?
              </p>
              <div className="space-y-2 mb-4">
                {CANCEL_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                      cancelReason === reason
                        ? 'border-blue-600 bg-blue-50 text-gray-900'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel-reason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={() => setCancelReason(reason)}
                      className="accent-blue-600"
                    />
                    {reason}
                  </label>
                ))}
              </div>
              <textarea
                value={cancelDetail}
                onChange={(e) => setCancelDetail(e.target.value)}
                placeholder="Anything else we could have done better? (optional)"
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleConfirmCancel}
                  disabled={!cancelReason}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  {cancelMode === 'subscription' ? 'Cancel subscription' : 'Close my account'}
                </Button>
                <Button
                  onClick={() => setStep(backStep)}
                  className="bg-blue-600 hover:bg-blue-700 text-white sm:ml-auto"
                >
                  <Heart className="w-4 h-4 mr-1.5" />
                  {cancelMode === 'subscription' ? 'Keep my subscription' : 'Keep my trial'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------- CANCELED (outcome) -----------------------------
  if (step === 'canceled') {
    return (
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {cancelMode === 'subscription'
              ? 'Your subscription is canceled'
              : 'Your trial is canceled'}
          </h1>
          <p className="text-gray-600 mb-6">
            {accessEndsLabel === 'today' ? (
              <>Your account has been closed. We're sorry to see you go — your door's always open.</>
            ) : (
              <>
                You'll keep full access until{' '}
                <span className="font-medium text-gray-900">{accessEndsLabel}</span>. After that
                your account closes and {cancelMode === 'subscription' ? 'billing stops' : 'no charge is made'}.
                Changed your mind? You can reactivate anytime before then.
              </>
            )}
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => {
                onResume?.();
                setStep(cancelMode === 'subscription' ? 'manage' : 'plans');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {cancelMode === 'subscription' ? 'Reactivate my subscription' : 'Reactivate my trial'}
            </Button>
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="w-full text-blue-600">
                Back to dashboard
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-5">Demo — nothing is permanently changed.</p>
        </div>
      </div>
    );
  }

  // ----------------------------- DOWNGRADE (sales-assisted) -----------------------------
  if (step === 'downgrade' && selectedPlan) {
    // Confirmation view once a call has been requested.
    if (salesRequested) {
      return (
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
          <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
              <PhoneCall className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Downgrade request received
            </h1>
            <p className="text-gray-600 mb-5">
              We'll process your downgrade from {currentPlan?.name} to {selectedPlan.name}. Someone from
              our team may reach out via email if we need anything from you — no call required unless you want one.
            </p>
            {/* When the downgraded plan takes effect */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 mb-6 text-left">
              <p className="text-sm text-gray-700">
                You'll keep <span className="font-semibold">{currentPlan?.name}</span> until{' '}
                <span className="font-semibold">{nextBillingLabel}</span> — your new{' '}
                <span className="font-semibold">{selectedPlan.name}</span> plan starts then, so
                nothing changes before the end of your current billing period.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => setStep('manage')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Back to your subscription
              </Button>
              {onBack && (
                <Button variant="ghost" onClick={onBack} className="w-full text-blue-600">
                  Back to dashboard
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-5">Demo — no request is actually sent.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => setStep('plans')}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to plans
          </button>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <div className="flex mb-4">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Request a downgrade to {selectedPlan.name}
              </h1>
              <p className="text-gray-600">
                Submit your request and we'll take it from there. Someone from our team may reach out to
                confirm a few details or help with the transition — but there's no call required.
              </p>
            </div>

            {/* What changes */}
            {currentPlan && currentPlan.features.length > 0 && (
              <div className="px-6 sm:px-8 py-5 bg-gray-50/60 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  What you'd be turning off
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentPlan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Seat-count downgrade warnings */}
            {selectedPlan.id === 'build' && teamSize > (selectedPlan.seats ?? 3) && (
              <div className="px-6 sm:px-8 py-5 bg-amber-50 border-b border-amber-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Extra seat charges on Build
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      You currently have {teamSize} users. Build includes {selectedPlan.seats ?? 3} seats — your
                      remaining {teamSize - (selectedPlan.seats ?? 3)} {teamSize - (selectedPlan.seats ?? 3) === 1 ? 'user' : 'users'} will each add{' '}
                      <strong>${selectedPlan.extraSeatPrice ?? 59}/mo</strong> to your bill. Total extra:{' '}
                      <strong>${(teamSize - (selectedPlan.seats ?? 3)) * (selectedPlan.extraSeatPrice ?? 59)}/mo</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedPlan.id === 'essentials' && teamSize > 1 && (
              <div className="px-6 sm:px-8 py-5 bg-red-50 border-b border-red-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      {teamSize - 1} {teamSize - 1 === 1 ? 'user' : 'users'} will become View-only
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Essentials includes 1 seat (yours). Your other {teamSize - 1}{' '}
                      {teamSize - 1 === 1 ? 'user' : 'users'} will be switched to View-only access — they
                      can still log in and read data, but can't edit. You can re-adjust their roles any time
                      you upgrade back to Build or Scale.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact form */}
            <div className="p-6 sm:p-8">
              <p className="text-sm font-semibold text-gray-900 mb-4">
                Where should we follow up?
              </p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dg-email">Work email</Label>
                  <Input
                    id="dg-email"
                    type="email"
                    placeholder="you@company.com"
                    value={downgradeContact.email}
                    onChange={(e) =>
                      setDowngradeContact({ ...downgradeContact, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dg-phone">Phone (optional)</Label>
                  <Input
                    id="dg-phone"
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={downgradeContact.phone}
                    onChange={(e) =>
                      setDowngradeContact({ ...downgradeContact, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dg-note">What's prompting the change? (optional)</Label>
                  <textarea
                    id="dg-note"
                    value={downgradeContact.note}
                    onChange={(e) =>
                      setDowngradeContact({ ...downgradeContact, note: e.target.value })
                    }
                    placeholder="Tell us a bit about what you're looking for."
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setStep('manage')}
                  className="text-gray-500"
                >
                  Keep my current plan
                </Button>
                <Button
                  onClick={() => {
                    // Schedule the downgrade for period end; access stays put until then.
                    if (selectedPlanId) onScheduleDowngrade?.(selectedPlanId, nextBillingLabel);
                    setSalesRequested(true);
                  }}
                  disabled={!downgradeContact.email.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white sm:ml-auto disabled:opacity-50"
                >
                  Request downgrade
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------- CHECKOUT -----------------------------
  // Soft, in-context note shown inside checkout when a builder is subscribing to
  // Essentials — App Studio (and the apps they built) won't carry over.
  const buildMonthly = buildPlan
    ? billingCycle === 'annual'
      ? annualPerMonth(buildPlan.monthlyPrice)
      : buildPlan.monthlyPrice
    : 0;
  const showEssentialsBuilderNote =
    !isChangingPlan && selectedPlan?.id === 'essentials' && isBuilderDowngradingToEssentials;
  // Essentials is single-seat — extra users convert to view-only.
  const showEssentialsSeatNote = selectedPlan?.id === 'essentials' && teamSize > 1;
  const extraUsers = teamSize - 1;
  const extraUsersWord = extraUsers === 1 ? 'user' : 'users';

  // Shared checkout content — rendered inline (full page) or inside a modal.
  const checkoutBody = selectedPlan ? (
    <>
          {checkoutMode === 'inline' && (
            <button
              onClick={() => setStep('plans')}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mb-5"
            >
              <ArrowLeft className="w-4 h-4" />
              {upgradeFromPlanId ? 'View all plans' : 'Back to plans'}
            </button>
          )}

          {/* Essentials caveats — merged into one banner when both apply */}
          {showEssentialsBuilderNote && showEssentialsSeatNote ? (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">
                  A couple of things change on Essentials
                </p>
                <ul className="mt-1.5 space-y-1 text-sm text-amber-800 list-disc pl-4">
                  <li>
                    App Studio isn't included, so your {builtAppsPhrase} from the trial won't carry
                    over.
                  </li>
                  <li>
                    Only 1 seat is included — your other {extraUsers} {extraUsersWord} will become
                    view-only (they can sign in and read, but can't edit).
                  </li>
                </ul>
                <p className="mt-1.5 text-sm text-amber-800">
                  Build keeps your apps and gives everyone a full seat.
                </p>
                <button
                  onClick={() => setSelectedPlanId('build')}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-900 hover:underline"
                >
                  Upgrade to Build — ${buildMonthly}/mo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : showEssentialsBuilderNote ? (
            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">App Studio lives on Build</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  You have {builtAppsPhrase} in App Studio from your trial. Essentials doesn't
                  include App Studio, so they won't carry over — switch to Build to keep everything
                  you've made.
                </p>
                <button
                  onClick={() => setSelectedPlanId('build')}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Switch to Build — ${buildMonthly}/mo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : showEssentialsSeatNote ? (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
              <Users className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">
                  Only 1 seat — your other {extraUsers} {extraUsersWord} will become view-only
                </p>
                <p className="text-sm text-amber-800 mt-0.5">
                  Essentials includes a single seat (yours). Your other {extraUsers} {extraUsersWord}{' '}
                  will be switched to view-only access — they can still sign in and read data, but
                  can't edit. Upgrade to Build to give everyone a full seat.
                </p>
                <button
                  onClick={() => setSelectedPlanId('build')}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-900 hover:underline"
                >
                  Upgrade to Build — ${buildMonthly}/mo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Payment form */}
            <div
              className={`lg:col-span-3 ${
                checkoutMode === 'modal'
                  ? 'lg:border-r lg:border-gray-200 lg:pr-8'
                  : 'bg-white rounded-xl border border-gray-200 shadow-sm p-6'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {isChangingPlan ? 'Confirm your plan change' : 'Payment details'}
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                {isChangingPlan
                  ? `You're ${changeKind === 'downgrade' ? 'downgrading' : 'upgrading'} from ${currentPlan?.name} to ${selectedPlan.name}.`
                  : isInTrial
                  ? `Add your card to continue after your trial — you won't be charged until ${trialEndLabel}.`
                  : 'Enter your card to activate your subscription.'}
              </p>

              {!isChangingPlan && (
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
              )}

              {isChangingPlan && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Visa ending in {activeSubscription?.cardLast4 ?? '••••'}
                        </p>
                        <p className="text-xs text-gray-500">Card on file</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400">Default</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePay}
                disabled={processing}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isChangingPlan
                      ? 'Updating your plan…'
                      : isInTrial
                      ? 'Starting your subscription…'
                      : 'Processing payment…'}
                  </>
                ) : isChangingPlan ? (
                  changeKind === 'downgrade'
                    ? `Switch to ${selectedPlan.name}`
                    : `Upgrade to ${selectedPlan.name}`
                ) : isInTrial ? (
                  'Start subscription'
                ) : (
                  `Subscribe & pay $${total.toLocaleString()}`
                )}
              </Button>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div
                className={
                  checkoutMode === 'modal'
                    ? 'lg:pl-2'
                    : 'bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6'
                }
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Order summary
                </h3>

                {/* Billing cycle toggle — always visible in checkout */}
                {(
                  <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 mb-4 w-fit">
                    {(['monthly', 'annual'] as const).map((cycle) => (
                      <button
                        key={cycle}
                        onClick={() => setBillingCycle(cycle)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                          billingCycle === cycle
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {cycle === 'annual' ? `Annual · save ${Math.round(ANNUAL_DISCOUNT * 100)}%` : 'Monthly'}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{selectedPlan.name} plan</p>
                    <p className="text-xs text-gray-500">
                      Billed {billingCycle === 'annual' ? 'annually' : 'monthly'} ·{' '}
                      {includedSeats} {includedSeats === 1 ? 'seat' : 'seats'} included
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${unitPrice}
                    <span className="text-xs font-normal text-gray-500">/mo</span>
                  </p>
                </div>

                {/* Per-seat line — shown when the team exceeds the plan's included seats */}
                {hasExtraSeats && (
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {extraSeatsCount} additional {extraSeatsCount === 1 ? 'seat' : 'seats'}
                        <span className="text-xs text-gray-400"> · ${extraSeatMonthly}/mo each</span>
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${seatsMonthly.toLocaleString()}
                      <span className="text-xs font-normal text-gray-500">/mo</span>
                    </p>
                  </div>
                )}

                {billingCycle === 'annual' && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    You're saving ${annualSavings.toLocaleString()}/yr ({Math.round(ANNUAL_DISCOUNT * 100)}%) with annual billing
                  </div>
                )}

                <div className="border-t border-gray-100 my-4" />

                {/* Effective monthly across all seats, before the billed total below */}
                {hasExtraSeats && (
                  <div className="flex justify-between items-baseline mb-3 text-sm">
                    <span className="text-gray-600">
                      {teamSize} users · {selectedPlan.name}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${effectiveMonthly.toLocaleString()}
                      <span className="text-xs font-normal text-gray-500">/mo</span>
                    </span>
                  </div>
                )}

                {isInTrial && !isChangingPlan ? (
                  <>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-gray-900">Due today</span>
                      <span className="text-2xl font-bold text-gray-900">$0</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      First charge of ${total.toLocaleString()} on {trialEndLabel}. Cancel anytime before then and you won't be charged.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="font-semibold text-gray-900">
                        {isChangingPlan ? 'New rate' : 'Total due today'}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                    {isChangingPlan && (
                      <p className="text-xs text-gray-500 -mt-2 mb-4">
                        {isInTrial
                          ? `No charge now — your new rate starts ${trialEndLabel}.`
                          : changeKind === 'downgrade'
                          ? 'Your lower rate takes effect on your next billing date.'
                          : 'The prorated difference appears on your next invoice.'}
                      </p>
                    )}
                  </>
                )}

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  Secure checkout
                </div>

                <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400 mb-4">
                  <span className="px-1.5 py-0.5 rounded border border-gray-200">VISA</span>
                  <span className="px-1.5 py-0.5 rounded border border-gray-200">MASTERCARD</span>
                  <span className="px-1.5 py-0.5 rounded border border-gray-200">AMEX</span>
                </div>

                {/* Billing address preview */}
                {isChangingPlan && (
                  <div className="border-t border-gray-100 pt-4 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Billing address</p>
                      <p className="text-xs text-gray-500">Paul McLane</p>
                      <p className="text-xs text-gray-400">123 King St W, Suite 400</p>
                      <p className="text-xs text-gray-400">Toronto, ON M5H 1B5, Canada</p>
                    </div>
                    <button
                      onClick={() => setStep('billing')}
                      className="text-xs text-blue-600 hover:underline whitespace-nowrap ml-3 mt-0.5 flex-shrink-0"
                    >
                      Update billing
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
    </>
  ) : null;

  if (step === 'checkout' && selectedPlan && checkoutMode === 'inline') {
    return (
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">{checkoutBody}</div>
      </div>
    );
  }

  // ------------------------------ PLANS ------------------------------
  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          {isChangingPlan && (
            <button
              onClick={() => setStep('manage')}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to your subscription
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            {isChangingPlan ? 'Change your plan' : "The right plan for where you're headed"}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            {isChangingPlan
              ? `You're currently on the ${currentPlan?.name} plan. Upgrade or downgrade anytime — changes apply right away.`
              : 'All plans include every stock app, QuickBooks sync, and unlimited contacts.'}
          </p>

          {/* Billing toggle — hidden for already-subscribed users (their cycle is fixed) */}
          {!isChangingPlan && (
            <div className="inline-flex items-center gap-3 mt-5">
              <span
                className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Monthly
              </span>
              <Switch
                checked={billingCycle === 'annual'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
              />
              <span
                className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Annually
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {Math.round(ANNUAL_DISCOUNT * 100)}% off
              </span>
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {plans.map((plan, index) => {
            const isContactSales = !!plan.contactSales;
            const isCurrent = isChangingPlan && plan.id === activeSubscription?.planId;
            const isUpgrade = isChangingPlan && currentPlanIndex >= 0 && index > currentPlanIndex;
            // A downgrade to a self-serve tier (Scale stays sales-assisted via contactSales).
            const isDowngrade =
              isChangingPlan && currentPlanIndex >= 0 && index < currentPlanIndex && !plan.contactSales;

            // Pricing (annual = 15% off), and the effective total for this team size.
            const price = billingCycle === 'annual' ? annualPerMonth(plan.monthlyPrice) : plan.monthlyPrice;
            const yearly = annualYearly(plan.monthlyPrice);
            const extraSeats = Math.max(0, teamSize - plan.seats);
            const extraUnit = plan.extraSeatPrice
              ? billingCycle === 'annual'
                ? annualPerMonth(plan.extraSeatPrice)
                : plan.extraSeatPrice
              : 0;
            const teamMonthly = price + extraSeats * extraUnit;
            const showTeamTotal = Boolean(plan.extraSeatPrice) && extraSeats > 0;
            const isRecommended = plan.id === recommendedPlanId;

            // Button copy: sales-assisted plans always read "Talk to sales"; changing shows
            // current/upgrade/downgrade; a fresh subscribe uses the plan CTA during the trial
            // but switches to "Subscribe to {Plan}" once the trial has expired.
            const ctaLabel = isContactSales
              ? plan.ctaLabel
              : isChangingPlan
              ? isCurrent
                ? 'Current plan'
                : isUpgrade
                ? `Upgrade to ${plan.name}`
                : `Downgrade to ${plan.name}`
              : isInTrial
              ? plan.ctaLabel
              : `Subscribe to ${plan.name}`;
            // In change mode, highlight the current plan; otherwise the team-size recommendation.
            const highlight = isChangingPlan ? isCurrent : isRecommended;
            const showArrow = !isChangingPlan && isRecommended;
            const contacted = isContactSales && salesContacted === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border p-5 flex flex-col ${
                  highlight
                    ? 'border-blue-600 shadow-lg ring-1 ring-blue-600'
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                {isCurrent ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wide px-4 py-1 rounded-full whitespace-nowrap">
                    Current plan
                  </span>
                ) : !isChangingPlan && isRecommended ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wide px-4 py-1 rounded-full whitespace-nowrap">
                    {recommendationBadge}
                  </span>
                ) : null}

                {/* Eyebrow + name */}
                <p
                  className={`text-xs font-bold uppercase tracking-wide mb-2 ${
                    highlight ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {plan.eyebrow}
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{plan.name}</h3>

                {/* Price */}
                {isContactSales ? (
                  <>
                    <div className="flex items-baseline mb-1">
                      <span className="text-3xl font-bold text-gray-900 tracking-tight">Let's talk</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Tailored to your business</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-2xl font-medium text-gray-900">$</span>
                      <span className="text-4xl font-bold text-gray-900 tracking-tight">{price}</span>
                      <span className="text-gray-500 text-sm">/ mo</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {billingCycle === 'annual'
                        ? `Billed annually · $${yearly.toLocaleString()}/yr`
                        : 'Billed monthly'}
                    </p>
                    {/* On monthly, nudge the discounted monthly price available with annual billing,
                        or show a promo discount if one is active from demo controls. */}
                    {showDiscountedPrice && billingCycle === 'monthly' && (
                      discountName && discountPct ? (
                        <p className="text-xs font-medium text-green-700 mb-1">
                          <span className="bg-green-100 rounded px-1 py-0.5 mr-1">{discountName}</span>
                          ${Math.round(plan.monthlyPrice * (1 - discountPct))}/mo · save{' '}
                          {Math.round(discountPct * 100)}%
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-green-700 mb-1">
                          ${annualPerMonth(plan.monthlyPrice)}/mo billed annually · save{' '}
                          {Math.round(ANNUAL_DISCOUNT * 100)}%
                        </p>
                      )
                    )}
                    {showTeamTotal ? (
                      <p className="text-xs font-medium text-blue-700 mb-3">
                        {teamSize} users · ${teamMonthly.toLocaleString()}/mo
                      </p>
                    ) : (
                      <div className="mb-2" />
                    )}
                  </>
                )}

                {/* Seats — the highlighted focal point */}
                <div
                  className={`rounded-xl px-4 py-2.5 mb-4 flex items-center gap-3 ${
                    highlight ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
                      highlight ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-500'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="leading-snug">
                    <p className="text-xs font-bold text-gray-900">
                      {plan.seats} {plan.seats === 1 ? 'seat' : 'seats'} included
                    </p>
                    <p className="text-xs text-gray-600">{plan.seatsNote}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 mb-3" />

                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                  {plan.includedLabel}
                </p>

                <ul className="space-y-2 mb-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => {
                    if (isContactSales) {
                      setSalesContacted(plan.id);
                    } else if (isDowngrade) {
                      // Downgrades are handled with a specialist, not self-serve.
                      setSelectedPlanId(plan.id);
                      setSalesRequested(false);
                      setDowngradeContact({ email: '', phone: '', note: '' });
                      setStep('downgrade');
                    } else if (!isCurrent) {
                      handleSubscribe(plan.id);
                    }
                  }}
                  disabled={isCurrent || contacted}
                  className={`w-full mt-auto ${
                    isCurrent
                      ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-default hover:bg-gray-100'
                      : highlight
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : isContactSales
                      ? 'bg-white text-gray-900 border border-gray-900 hover:bg-gray-50'
                      : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {contacted ? "We'll be in touch" : ctaLabel}
                  {showArrow && <ArrowRight className="w-4 h-4 ml-1.5" />}
                </Button>

                {contacted && (
                  <p className="text-center text-xs text-gray-500 mt-3">
                    A Method expert will reach out shortly.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Full feature comparison */}
        <FeatureComparison
          planNames={plans.map((p) => p.name)}
          highlightIndex={plans.findIndex((p) => p.highlighted)}
        />

        {/* Trial users: a quiet exit to close the account instead of subscribing */}
        {!isChangingPlan && (
          <div className="text-center mt-10">
            <button
              onClick={() => {
                setCancelReason('');
                setCancelDetail('');
                setStep('cancel');
              }}
              className="text-sm text-gray-400 hover:text-red-600 transition-colors"
            >
              {isInTrial ? 'Not the right fit? Cancel your account' : 'Cancel your account'}
            </button>
          </div>
        )}
      </div>

      {/* Modal checkout + its success confirmation (demo: checkoutMode === 'modal') */}
      {(step === 'checkout' || step === 'success') && checkoutMode === 'modal' && selectedPlan && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 sm:px-8 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {step === 'success'
                  ? isChangingPlan
                    ? 'Plan updated'
                    : "You're all set"
                  : isChangingPlan
                  ? 'Change your plan'
                  : `Subscribe to ${selectedPlan.name}`}
              </h2>
              <button
                onClick={() => (step === 'success' ? goToDashboard() : setStep('plans'))}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              {step === 'success' ? (
                <div className="max-w-md mx-auto text-center py-2">{successContent}</div>
              ) : (
                checkoutBody
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
