import React from 'react';
import { Check, Shield, Users, Clock, Sparkles, ChevronRight, Globe } from 'lucide-react';

export const Plans: React.FC = () => {
  const plans = [
    {
      name: 'Starter Life OS',
      price: 'Free',
      period: 'forever',
      description: 'Ideal for individuals starting the habit of documenting personal milestones, travel diaries, and voice notes.',
      features: [
        '1 Personal Glen Vault of your choice',
        'Unlimited Milestone Entries',
        '3 Active Sealed Time Capsules',
        'Basic High-Definition Photo & Audio Storage',
        'GPS Travel & Encounter Logging',
      ],
      cta: 'Begin Free Living Record',
      popular: false,
      borderClass: 'border-stone-800',
    },
    {
      name: 'Life Builder',
      price: '$4.99',
      period: 'per month',
      description: 'Built for individuals and families wanting the complete living experience across all 5 life stages.',
      features: [
        'All 5 Life Stage Glens Unlocked (Family, Alumni, Arena, Crossroads, Horizon)',
        'Unlimited Group Glens created or joined',
        'Unlimited Sealed Time Capsules',
        'Anniversary Archives with automatic yearly prompts',
        'Multi-User Voice Notes & Reflection Sharing',
        'GPS Route & Encounter Map Geotagging',
      ],
      cta: 'Start 14-Day Free Trial',
      popular: true,
      borderClass: 'border-[#C9A227] ring-2 ring-[#C9A227]',
    },
    {
      name: 'Circle & Community',
      price: '$29.00',
      period: 'per month',
      description: 'Tailored for university cohorts, sports clubs, extended family clans, and global communities.',
      features: [
        'Unlimited Members per Group Glen',
        '500GB High-Definition Vault Storage',
        'Admin Moderation & Granular Privacy Controls',
        'Custom Group Glen Branding & Badges',
        'Interactive Historical Throwbacks ("On This Day")',
        'Priority Global Cloud Support',
      ],
      cta: 'Contact Circle Sales',
      popular: false,
      borderClass: 'border-stone-800',
    },
  ];

  return (
    <div className="min-h-screen bg-[#1C2526] py-20 px-4 sm:px-6 lg:px-8 font-sans text-stone-100">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="px-4 py-1.5 rounded-full bg-[#C9A227]/10 text-[#C9A227] text-xs font-black uppercase tracking-widest border border-[#C9A227]/30 mb-4 inline-block">
          PLANS FOR A LIFE FULLY DOCUMENTED
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Choose How Deeply You Author Your Story
        </h1>
        <p className="text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed">
          Every plan is engineered for people who are actively writing their chapters. Preserve daily milestones, travel encounters, and time capsules with total data sovereignty.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-stone-900 rounded-3xl p-8 border ${plan.borderClass} shadow-2xl flex flex-col justify-between relative overflow-hidden`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-[#C9A227] text-stone-950 text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-bl-xl">
                Most Popular
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-stone-400 text-xs leading-relaxed mb-6">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-stone-500 text-xs">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-xs text-stone-300">
                    <Check className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                plan.popular
                  ? 'bg-[#C9A227] hover:bg-[#b08d1e] text-stone-950 shadow-lg'
                  : 'bg-stone-800 hover:bg-stone-700 text-white border border-stone-700'
              }`}
            >
              {plan.cta} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Guaranteed Living Focus Disclaimer */}
      <div className="max-w-3xl mx-auto text-center p-6 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs text-stone-400 leading-relaxed">
        <p className="font-semibold text-stone-300 mb-1">Guaranteed Active Living Platform</p>
        All LivingGlen plans are exclusively designed for documenting and celebrating life while it is being lived. There are zero cemetery features, funeral tools, or posthumous products on LivingGlen.
      </div>
    </div>
  );
};
