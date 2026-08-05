import React, { useState } from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import {
  Users,
  GraduationCap,
  Flame,
  Compass,
  Sparkles,
  Clock,
  Calendar,
  MapPin,
  Mic,
  Lock,
  ChevronRight,
  Globe,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { isLivingGlen } = useWhiteLabel();
  const [activeStage, setActiveStage] = useState(0);

  if (!isLivingGlen) {
    return <div className="p-8 text-center text-stone-400">MemoryGlen Legacy Platform View</div>;
  }

  const lifeStages = [
    {
      id: 'family',
      stage: 'Stage 1 · Roots',
      title: 'Family Glen',
      icon: Users,
      bgHex: '#C45C26',
      borderClass: 'border-[#C45C26]',
      textClass: 'text-[#C45C26]',
      bgLightClass: 'bg-[#C45C26]/10',
      description: 'The foundation of belonging. Preserve lineage, family trees, grandparent voice recordings, and shared traditions across generations.',
      story: 'The Miller Circle: Family members across London, Toronto, and Sydney updating a unified family tree, sharing audio stories, and uploading holiday albums in real time.',
      tags: ['Family Heritage', 'Intergenerational Audio', 'Shared Albums', 'Private Vaults'],
    },
    {
      id: 'alumni',
      stage: 'Stage 2 · Formation',
      title: 'Alumni Glen',
      icon: GraduationCap,
      bgHex: '#3B3B98',
      borderClass: 'border-[#3B3B98]',
      textClass: 'text-[#3B3B98]',
      bgLightClass: 'bg-[#3B3B98]/10',
      description: 'The space of learning and growth. Reconnect with school cohorts, university residences, research groups, and mentorship circles.',
      story: 'Class of 2018 Hub: 60 graduates maintaining a permanent circle for career updates, reunion planning, and student throwback photos.',
      tags: ['Class Rosters', 'Mentorship Threads', 'Academic Archives', 'Reunion Planning'],
    },
    {
      id: 'arena',
      stage: 'Stage 3 · Mastery',
      title: 'Arena Glen',
      icon: Flame,
      bgHex: '#E85D04',
      borderClass: 'border-[#E85D04]',
      textClass: 'text-[#E85D04]',
      bgLightClass: 'bg-[#E85D04]/10',
      description: 'The arena of passion and discipline. Capture sports team seasons, athletic records, creative crafts, and performance journals.',
      story: 'Metro Rowing Squad: Teammates logging race replays, medal ceremonies, and coaching wisdom that carry into lifelong friendships.',
      tags: ['Athletic Logs', 'Team Replays', 'Creative Crafts', 'Tournament Archives'],
    },
    {
      id: 'crossroads',
      stage: 'Stage 4 · Encounters',
      title: 'Crossroads Glen',
      icon: Compass,
      bgHex: '#D4A017',
      borderClass: 'border-[#D4A017]',
      textClass: 'text-[#D4A017]',
      bgLightClass: 'bg-[#D4A017]/10',
      description: 'The unscripted journeys. Document spontaneous roadtrips, pivotal life pivots, wisdom from strangers, and hard-won lessons.',
      story: 'Coast-to-Coast Roadtrip 2024: Friends geotagging roadside encounters, recording travel audio clips, and documenting unexpected life advice.',
      tags: ['GPS Travel Logs', 'Stranger Wisdom', 'Life Lessons', 'Roadtrip Journals'],
    },
    {
      id: 'horizon',
      stage: 'Stage 5 · Continuity',
      title: 'Horizon Glen',
      icon: Sparkles,
      bgHex: '#0D7377',
      borderClass: 'border-[#0D7377]',
      textClass: 'text-[#0D7377]',
      bgLightClass: 'bg-[#0D7377]/10',
      description: 'Looking into the future. Lock time capsules for future birthdays, write letters to your future self, and log ongoing milestone anniversaries.',
      story: 'Letter on a 30th Birthday: A founder sealing a video time capsule on launch day set to automatically unlock on their 40th birthday.',
      tags: ['Time Capsules', 'Vision Boards', 'Anniversary Archives', 'Future Unlocks'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#1C2526] text-stone-100 font-sans">
      {/* Universal Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-6">
            <Globe className="w-3.5 h-3.5" /> LIVINGGLEN · ACTIVE LIFE OPERATING SYSTEM
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Where You Live and Author <span className="text-[#C9A227]">Your Story</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            A universal digital home to capture daily milestones, spontaneous encounters, voice memories, and time capsules as they happen—owned by you, shared with your inner circle.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/plans" className="px-8 py-4 bg-[#C9A227] hover:bg-[#b08d1e] text-stone-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              Start Your Living Record <ChevronRight className="w-5 h-5" />
            </a>
            <a href="#life-stages" className="px-8 py-4 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl border border-stone-700 transition-all flex items-center justify-center gap-2">
              Explore the 5 Life Stages
            </a>
          </div>
        </div>
      </section>

      {/* Feature Pillar Explanation Banner */}
      <section className="py-16 bg-stone-900 border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-stone-950/60 border border-stone-800">
            <div className="w-12 h-12 bg-[#C45C26]/20 text-[#C45C26] rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Group Glens</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Shared living spaces for families, travel crews, and alumni cohorts. Never lose cherished photos or voice notes in buried chat streams.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-stone-950/60 border border-stone-800">
            <div className="w-12 h-12 bg-[#D4A017]/20 text-[#D4A017] rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Time Capsules</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Time-locked video, audio, and written messages set to unlock on future birthdays, wedding anniversaries, or graduation days.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-stone-950/60 border border-stone-800">
            <div className="w-12 h-12 bg-[#0D7377]/20 text-[#0D7377] rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Milestone Archives</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Structured living timelines for births, weddings, home purchases, and career victories that grow richer every passing year.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Life Stages Section */}
      <section id="life-stages" className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            The 5 Universal Life Stages
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto">
            From childhood origins to spontaneous roadtrips and future time capsules—explore how LivingGlen organizes every phase of human experience.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {lifeStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                style={{
                  backgroundColor: isSelected ? stage.bgHex : 'rgba(38, 38, 38, 0.8)',
                  borderColor: isSelected ? stage.bgHex : '#374151',
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                  isSelected ? 'text-white shadow-lg scale-105' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {stage.title}
              </button>
            );
          })}
        </div>

        {/* Active Stage Card Render */}
        {(() => {
          const current = lifeStages[activeStage];
          const Icon = current.icon;
          return (
            <div className="bg-stone-900 rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className={`text-xs font-black uppercase tracking-widest block mb-2 ${current.textClass}`}>
                  {current.stage}
                </span>
                <h3 className="text-3xl font-extrabold text-white mb-4 flex items-center gap-3">
                  <div className="p-3 rounded-xl text-white" style={{ backgroundColor: current.bgHex }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {current.title}
                </h3>
                <p className="text-stone-300 text-base leading-relaxed mb-6">
                  {current.description}
                </p>

                <div className={`p-4 rounded-r-xl border-l-4 mb-6 ${current.borderClass} ${current.bgLightClass}`}>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Real Life Scenario
                  </span>
                  <p className="text-stone-200 italic text-sm leading-relaxed">
                    "{current.story}"
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${current.bgLightClass} ${current.borderClass} ${current.textClass}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mock Glen Vault Card */}
              <div className="bg-stone-950 text-white rounded-2xl p-6 border border-stone-800 relative shadow-inner min-h-[320px] flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800/80 pb-3">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#C9A227]" /> Geotagged Active Record</span>
                  <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5 text-emerald-400" /> Audio Vault Active</span>
                </div>

                <div className="my-6">
                  <div className="w-12 h-12 rounded-xl text-white flex items-center justify-center mb-4" style={{ backgroundColor: current.bgHex }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-xl font-bold text-white mb-2">{current.title} Vault</p>
                  <p className="text-stone-400 text-sm leading-relaxed">
                    Photos, audio reflections, GPS pins, and documents are encrypted and synced to authorized group members across devices.
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs text-stone-500 pt-3 border-t border-stone-800/80">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Circle Privacy Active</span>
                  <span className="font-mono text-[#C9A227]">STATUS: ACTIVE_OS</span>
                </div>
              </div>
            </div>
          );
        })()}
      </section>
    </div>
  );
};

export default Home;
