import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  Sparkles,
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react';
import { useWhiteLabel } from '@/context/WhiteLabelContext';

export default function NyaradzoPortalHeader() {
  const { isNyaradzoMode, toggleNyaradzoMode, config } = useWhiteLabel();
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <header className="w-full transition-all duration-300">
      {/* Pitch Demo Switch Controller */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
            B2B Pitch Mode
          </span>
          {isNyaradzoMode && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
              Nyaradzo Partner Co-Branding Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDemoModal(true)}
            className="text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
          >
            <Sliders size={13} /> Partner Controls
          </button>

          <button
            onClick={toggleNyaradzoMode}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              isNyaradzoMode
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm'
                : 'bg-emerald-800 text-white hover:bg-emerald-700'
            }`}
          >
            <Sparkles size={13} />
            {isNyaradzoMode ? 'Switch to Standard MemoryGlen' : 'Activate Nyaradzo Partner Mode'}
          </button>
        </div>
      </div>

      {/* Nyaradzo Co-Branded Header Banner */}
      {isNyaradzoMode && config && (
        <div className="bg-emerald-950 text-white border-b-2 border-amber-500/80 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3.5 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Building2 size={22} />
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h2 className="font-serif font-bold text-lg text-white tracking-wide">
                    {config.name}
                  </h2>
                  <span className="bg-emerald-900/80 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} /> {config.badgeText}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 font-sans mt-0.5">
                  {config.tagline}
                </p>
              </div>
            </div>

            {/* Right: Hotline & Self-Service Portal Integration */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`tel:${config.hotline.split('/')[0].trim()}`}
                className="flex items-center gap-2 bg-emerald-900/90 hover:bg-emerald-900 border border-emerald-700/60 px-3.5 py-2 rounded-lg text-xs font-medium text-emerald-100 transition shadow-sm"
              >
                <PhoneCall size={14} className="text-amber-400" />
                <div className="text-left">
                  <div className="text-[10px] text-emerald-300/80 leading-none">24/7 Bereavement Line</div>
                  <div className="font-semibold mt-0.5">{config.hotline.split('/')[0]}</div>
                </div>
              </a>

              <a
                href={config.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-sm"
              >
                Policy Self-Service <ExternalLink size={13} />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Demo Control Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg mb-2">
              <Building2 size={20} />
              Nyaradzo Group Partnership Architecture
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              This white-label module allows Nyaradzo Funeral Services to bundle MemoryGlen's digital memorial, QR headstone, and live-stream features into policy packages.
            </p>

            <div className="space-y-2.5 text-xs mb-6">
              <div className="flex items-start gap-2 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Policy Integration:</strong> Automatically seeds family memorials upon bereavement notification.</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Sahwira Mukuru Branding:</strong> Custom colors, 24/7 hotline, and policy verification.</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Revenue Share:</strong> Subscription monetization for premium multi-generational family trees.</span>
              </div>
            </div>

            <button
              onClick={() => setShowDemoModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition"
            >
              Close Partner Overview
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
