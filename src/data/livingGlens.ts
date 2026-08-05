/**
 * LivingGlen "Group Glens" content pack — STRUCTURAL DEMO DATA ONLY.
 *
 * Every entry is flagged `isDemo: true` so the UI badges it
 * "Sample Group Glen — Structural Demo". None of these are real communities;
 * they exist solely to exercise the /glens layout until real Glen data lands.
 * Do NOT present these as live communities.
 */

export type LifeStage = 'family' | 'alumni' | 'sports' | 'roadtrips' | 'capsules';

export interface GroupGlen {
  slug: string;
  title: string;
  stage: LifeStage;
  stageName: string;
  /** Accent hex used for the stage badge. */
  accentHex: string;
  membersCount: number;
  location: string;
  description: string;
  tags: string[];
  updated: string;
  /** Always true for now — these are structural demos, never real communities. */
  isDemo: true;
}

export const LIFE_STAGES: { id: LifeStage; label: string }[] = [
  { id: 'family', label: 'Family' },
  { id: 'alumni', label: 'Alumni' },
  { id: 'sports', label: 'Sports' },
  { id: 'roadtrips', label: 'Roadtrips' },
  { id: 'capsules', label: 'Time Capsules' },
];

export const LIVING_GLENS: GroupGlen[] = [
  {
    slug: 'sample-family-circle',
    title: 'Sample Family Circle',
    stage: 'family',
    stageName: 'Family Glen',
    accentHex: '#C9A227',
    membersCount: 14,
    location: 'Placeholder location',
    description:
      'Structural demo of an intergenerational family Glen: shared timeline, voice notes and archives. Replace with real content.',
    tags: ['Roots', 'Audio Diary', 'Lineage'],
    updated: 'Demo data',
    isDemo: true,
  },
  {
    slug: 'sample-alumni-cohort',
    title: 'Sample Alumni Cohort',
    stage: 'alumni',
    stageName: 'Alumni Glen',
    accentHex: '#C9A227',
    membersCount: 62,
    location: 'Placeholder location',
    description:
      'Structural demo of an alumni Glen tracking milestones and reunions. Replace with real content.',
    tags: ['Cohort', 'Mentorship', 'Reunions'],
    updated: 'Demo data',
    isDemo: true,
  },
  {
    slug: 'sample-sports-squad',
    title: 'Sample Sports Squad',
    stage: 'sports',
    stageName: 'Arena Glen',
    accentHex: '#C9A227',
    membersCount: 28,
    location: 'Placeholder location',
    description:
      'Structural demo of a team Glen: training logs and race replays. Replace with real content.',
    tags: ['Athletics', 'Replays', 'Team Logs'],
    updated: 'Demo data',
    isDemo: true,
  },
  {
    slug: 'sample-roadtrip-crew',
    title: 'Sample Roadtrip Crew',
    stage: 'roadtrips',
    stageName: 'Crossroads Glen',
    accentHex: '#C9A227',
    membersCount: 5,
    location: 'Placeholder route',
    description:
      'Structural demo of a roadtrip Glen: GPS pins and roadside clips. Replace with real content.',
    tags: ['Roadtrip', 'GPS Pins', 'Encounters'],
    updated: 'Demo data',
    isDemo: true,
  },
  {
    slug: 'sample-time-capsule',
    title: 'Sample Time Capsule',
    stage: 'capsules',
    stageName: 'Horizon Glen',
    accentHex: '#C9A227',
    membersCount: 8,
    location: 'Placeholder hub',
    description:
      'Structural demo of a time-capsule Glen: locked capsules and future unlocks. Replace with real content.',
    tags: ['Vision Board', 'Capsules', 'Unlocks'],
    updated: 'Demo data',
    isDemo: true,
  },
];
