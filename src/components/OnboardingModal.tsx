import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  RefreshCw,
  Calendar,
  CreditCard,
  Mail,
  Monitor,
  Globe,
  Quote,
  Users,
} from 'lucide-react';

type Step =
  | 'software'
  | 'industry'
  | 'demo'
  | 'qbversion'
  | 'connect'
  | 'connecting'
  | 'invite';

interface OnboardingModalProps {
  onComplete: () => void;
}

// Demo account name shown in a couple of the prompts.
const accountName = 'M18tylercopelandSKU';

const roles = ['Owner', 'Accountant', 'Sales', 'Marketing', 'Consultant', 'Other'];

const demoSlots = [
  '8:30 AM', '9:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM',
  '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '4:30 PM', '5:00 PM',
];

const stepLabel: Record<Step, string> = {
  software: "We're building a personalized trial for you",
  industry: "We're building a personalized trial for you",
  demo: "We're building a personalized trial for you",
  qbversion: "We're building a personalized trial for you",
  connect: 'Connect with QuickBooks Online',
  connecting: 'Connect to QuickBooks',
  invite: "You're ready to go!",
};

const stepProgress: Record<Step, number> = {
  software: 14,
  industry: 32,
  demo: 52,
  qbversion: 70,
  connect: 84,
  connecting: 92,
  invite: 100,
};

function Testimonial() {
  return (
    <div className="relative rounded-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-100 p-5">
      <p className="text-sm font-bold text-blue-700 text-center mb-2">#1 QuickBooks CRM</p>
      <Quote className="w-5 h-5 text-blue-300 mb-1" />
      <p className="text-sm text-gray-600 leading-relaxed italic">
        With Method's two-way, real-time QuickBooks sync, I'm confident that my accounting data
        is always up to date. If you're already using QuickBooks, it's a no-brainer to also use
        Method.
      </p>
      <p className="text-xs text-gray-500 mt-3">
        <span className="font-semibold text-gray-700">Kayla Prusinski</span> — Advanced Certified
        QuickBooks Online ProAdvisor, Savvy Bird Consulting
      </p>
    </div>
  );
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<Step>('software');
  const [software, setSoftware] = useState<'quickbooks' | 'xero'>('quickbooks');
  const [industry, setIndustry] = useState('Construction');
  const [role, setRole] = useState('Owner');
  const [qbVersion, setQbVersion] = useState<'desktop' | 'online'>('online');
  const [slot, setSlot] = useState<string | null>(null);

  // The flow branches: Xero skips the QuickBooks-specific steps.
  const sequence: Step[] =
    software === 'quickbooks'
      ? ['software', 'industry', 'demo', 'qbversion', 'connect', 'connecting', 'invite']
      : ['software', 'industry', 'demo', 'invite'];

  const idx = sequence.indexOf(step);
  const goNext = () => {
    const next = sequence[idx + 1];
    if (next) setStep(next);
  };
  const goBack = () => {
    const prev = sequence[idx - 1];
    if (prev) setStep(prev);
  };

  // The "connecting" screen auto-advances to the final step.
  useEffect(() => {
    if (step !== 'connecting') return;
    const t = setTimeout(() => setStep('invite'), 2200);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4">
      <div className="w-[min(900px,94vw)] max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header label */}
        <div className="px-6 sm:px-8 pt-5 pb-3">
          <p className="text-sm font-semibold text-gray-900">{stepLabel[step]}</p>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${stepProgress[step]}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* STEP 1 — Accounting software */}
          {step === 'software' && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Which accounting software does {accountName} use?
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  If you don't see your software below,{' '}
                  <button className="text-blue-600 hover:underline font-medium">get in touch</button>{' '}
                  with our team!
                </p>
                <div className="space-y-3">
                  {[
                    { id: 'quickbooks' as const, name: 'QuickBooks', badge: 'qb', color: 'bg-green-600' },
                    { id: 'xero' as const, name: 'Xero', badge: 'X', color: 'bg-sky-500' },
                  ].map((opt) => {
                    const selected = software === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSoftware(opt.id)}
                        className={`w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                          selected
                            ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span
                          className={`w-9 h-9 rounded-full ${opt.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
                        >
                          {opt.badge}
                        </span>
                        <span className="flex-1 font-semibold text-gray-900">{opt.name}</span>
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selected ? 'border-blue-600' : 'border-gray-300'
                          }`}
                        >
                          {selected && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="hidden md:flex flex-col items-center">
                <div className="relative w-full rounded-xl bg-gradient-to-br from-blue-50 to-white border border-gray-100 p-6">
                  <div className="space-y-2">
                    {['Amy Ford', 'Laura Murphy', 'Tony Randall', 'Sofia Garcia'].map((n) => (
                      <div key={n} className="flex items-center gap-2 bg-white rounded-lg border border-gray-100 px-3 py-2 shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-100" />
                        <span className="text-xs text-gray-600">{n}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-center mt-4">
                  <span className="block font-bold text-gray-900">Avoid duplicate data entry</span>
                  <span className="text-sm text-gray-500">and work 3 times faster.</span>
                </p>
              </div>
            </div>
          )}

          {/* STEP 2 — Industry + role */}
          {step === 'industry' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-5">What industry are you in?</h2>
                <label className="block text-sm text-gray-600 mb-1">
                  Industry type<span className="text-red-500">*</span>
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {['Construction', 'Field Services', 'Professional Services', 'Retail', 'Manufacturing', 'Nonprofit', 'Other'].map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">What's your primary role?</h3>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                        role === r
                          ? 'border-blue-500 text-blue-700 bg-blue-50'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-100 p-6 w-full grid grid-cols-2 gap-3">
                  {[CreditCard, Mail, Users, Calendar].map((Icon, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <Icon className="w-7 h-7 text-blue-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Book a demo */}
          {step === 'demo' && (
            <div>
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">We can help get you started.</h2>
                  <p className="text-sm text-gray-500 max-w-md">
                    Walk through a demo and get your questions about Method answered with your
                    Customer Success Manager.
                  </p>
                </div>
                <div className="hidden sm:flex -space-x-2 flex-shrink-0">
                  {['bg-rose-300', 'bg-blue-300', 'bg-purple-300', 'bg-emerald-300'].map((c, i) => (
                    <div key={i} className={`w-12 h-12 rounded-full ${c} ring-2 ring-white`} />
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600 border border-gray-200 rounded-full px-3 py-1">
                    Today
                  </span>
                  <span className="font-semibold text-gray-900">May 2026</span>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-center text-xs text-gray-400 border-y border-gray-100 py-1 mb-3">This Week</p>
                <p className="font-semibold text-gray-900 mb-2">
                  Wednesday <span className="font-normal text-gray-500">May 13th</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {demoSlots.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`rounded-full border py-2 text-sm font-medium transition-colors ${
                        slot === s
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Want to see this schedule in fullscreen?{' '}
                <button className="text-blue-600 hover:underline">Open in a new window.</button>
              </p>
            </div>
          )}

          {/* STEP 5 — QuickBooks version */}
          {step === 'qbversion' && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-5">
                  Which version of QuickBooks does {accountName} use?
                </h2>
                <div className="space-y-3">
                  {[
                    { id: 'desktop' as const, name: 'Desktop & Enterprise', sub: 'Pro, Premier, Plus', icon: Monitor },
                    { id: 'online' as const, name: 'Online', sub: 'All versions', icon: Globe },
                  ].map((opt) => {
                    const selected = qbVersion === opt.id;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setQbVersion(opt.id)}
                        className={`w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                          selected ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </span>
                        <span className="flex-1">
                          <span className="block font-semibold text-gray-900">{opt.name}</span>
                          <span className="block text-xs text-gray-500">{opt.sub}</span>
                        </span>
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selected ? 'border-blue-600' : 'border-gray-300'
                          }`}
                        >
                          {selected && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button className="text-sm text-blue-600 hover:underline font-medium mt-4">Need help?</button>
              </div>
              <div className="hidden md:block">
                <Testimonial />
              </div>
            </div>
          )}

          {/* STEP 6 — Connect */}
          {step === 'connect' && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Click and connect, it's that easy.</h2>
                <p className="text-sm text-gray-500 mb-5">
                  You will be directed to the QuickBooks Online portal to connect to your QuickBooks Account.
                </p>
                <Button
                  onClick={goNext}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Connect to QuickBooks
                </Button>
                <div className="border-t border-gray-100 my-5" />
                <p className="text-sm text-gray-600 mb-2">Not the admin of your QuickBooks account?</p>
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  Send setup link
                </Button>
                <div className="mt-4">
                  <button className="text-sm text-blue-600 hover:underline font-medium">Need help?</button>
                </div>
              </div>
              <div className="hidden md:block">
                <Testimonial />
              </div>
            </div>
          )}

          {/* STEP 7 — Connecting */}
          {step === 'connecting' && (
            <div className="py-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">QuickBooks is connecting...</h2>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-200 px-6 py-3 shadow-sm">
                    <span className="font-bold text-green-700">intuit</span>{' '}
                    <span className="font-bold text-gray-700">quickbooks</span>
                  </div>
                  <div className="rounded-lg border border-gray-200 px-6 py-3 shadow-sm text-center">
                    <span className="font-bold text-[#0a1f44]">method</span>
                  </div>
                </div>
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden max-w-md mx-auto">
                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 animate-pulse w-2/3" />
              </div>
              <p className="text-center text-sm font-medium text-blue-600 mt-2">Connecting...</p>
            </div>
          )}

          {/* STEP 8 — Invite teammates */}
          {step === 'invite' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Invite your teammates</h2>
              <p className="text-sm text-gray-500 mb-6">Work better together and stay connected with Method.</p>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input placeholder="Name" />
                      <Input placeholder="Email" type="email" />
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Make Admin
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-sm text-blue-600 hover:underline font-semibold mt-5">
                More users to invite?
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'connecting' && (
          <div className="bg-gray-50 border-t border-gray-100 px-6 sm:px-8 py-4 flex items-center justify-end gap-3">
            {(step === 'industry' || step === 'demo' || step === 'connect') && (
              <Button variant="outline" onClick={goBack} className="text-blue-600 border-blue-600 hover:bg-blue-50">
                Back
              </Button>
            )}
            {(step === 'software' || step === 'industry' || step === 'demo') && (
              <Button onClick={goNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                Next step
              </Button>
            )}
            {step === 'qbversion' && (
              <Button onClick={goNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Sync
              </Button>
            )}
            {step === 'invite' && (
              <Button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700 text-white">
                Done
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
