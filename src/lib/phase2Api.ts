import { supabase } from '@/lib/supabase';

/**
 * Phase 2/3 data-access layer: the LivingGlen <-> MemoryGlen lifecycle
 * (trustee consensus, transition state, public contributions) and the
 * shared analytics counters.
 *
 * Every mutation that can change who is allowed to see or edit a life
 * record goes through a SECURITY DEFINER Postgres function (see
 * supabase/migrations/20260803_liferecord_lifecycle_and_analytics.sql) so
 * that the multi-sig / 7-day veto rules cannot be bypassed by a client
 * calling .update() directly. This module never touches the service_role
 * key -- it only ever uses the public anon client, which is subject to Row
 * Level Security.
 */

export type LifeRecordState = 'ACTIVE' | 'PENDING_TRANSITION' | 'MEMORIAL';

export interface LifeRecord {
  id: string;
  owner_id: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  status: LifeRecordState;
  transition_threshold: number;
  transition_initiated_at: string | null;
  transition_commit_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LifeRecordTrustee {
  id: string;
  life_record_id: string;
  trustee_email: string;
  trustee_user_id: string | null;
  has_confirmed_transition: boolean;
  confirmed_at: string | null;
}

export interface PendingContribution {
  id: string;
  life_record_id: string;
  contributor_name: string;
  story_text: string;
  media_urls: string[];
  target_event_id: string | null;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export interface DailyAnalyticsRow {
  visit_date: string;
  platform: 'LIVINGGLEN' | 'MEMORYGLEN';
  page_path: string;
  page_views: number;
  unique_visitors: number;
}

type Result<T> = { data: T; error: null } | { data: null; error: string };

const NOT_CONFIGURED = 'Supabase is not configured.';

function ok<T>(data: T): Result<T> {
  return { data, error: null };
}

function fail<T>(error: string): Result<T> {
  return { data: null, error };
  

/** Fetch the current state of a life record. Public rows (MEMORIAL) are readable by anyone. */
export async function getLifeRecordState(lifeRecordId: string): Promise<Result<LifeRecord>> {
  if (!supabase) return fail(NOT_CONFIGURED);
  const { data, error } = await supabase
    .from('life_records')
    .select('*')
    .eq('id', lifeRecordId)
    .maybeSingle();
  if (error) return fail(error.message);
  if (!data) return fail('Life record not found or not visible to you.');
  return ok(data as LifeRecord);
}

/** Owner-only: propose a trustee by email. Enforced server-side by nominate_trustee(). */
export async function nominateTrustee(lifeRecordId: string, trusteeEmail: string): Promise<Result<string>> {
  if (!supabase) return fail(NOT_CONFIGURED);
  const email = trusteeEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Enter a valid email address.');
  const { data, error } = await supabase.rpc('nominate_trustee', {
    p_life_record_id: lifeRecordId,
    p_trustee_email: email,
  });
  if (error) return fail(error.message);
  return ok(data as string);
}

/** Trustee-only: cast a confirmation vote. Triggers the 7-day timer at threshold. */
export async function confirmTrusteeTransition(lifeRecordId: string): Promise<Result<string>> {
  if (!supabase) return fail(NOT_CONFIGURED);
  const { data, error } = await supabase.rpc('confirm_trustee_transition', {
    p_life_record_id: lifeRecordId,
  });
  if (error) return fail(error.message);
  return ok(data as string);
}

/** Owner-only: cancel a pending transition and reset trustee votes. */
export async function vetoTransition(lifeRecordId: string): Promise<Result<null>> {
  if (!supabase) return fail(NOT_CONFIGURED);
  const { error } = await supabase.rpc('veto_transition', { p_life_record_id: lifeRecordId });
  if (error) return fail(error.message);
  return ok(null);
}

/** List trustees + vote status for the consensus panel. Owner/trustee visibility only (RLS). */
export async function listTrustees(lifeRecordId: string): Promise<Result<LifeRecordTrustee[]>> {
  if (!supabase) return fail(NOT_CONFIGURED);
  const { data, error } = await supabase
    .from('life_record_trustees')
    .select('*')
    .eq('life_record_id', lifeRecordId);
  if (error) return fail(error.message);
  return ok((data ?? []) as LifeRecordTrustee[]);
}

/**
 * Strip all markup from user-supplied text before it is stored or rendered.
 * Equivalent to DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }) but implemented
 * with the browser's own parser so no extra dependency is required: the
 * string is parsed as HTML and only the resulting text nodes are kept, so
 * <script>, event handler attributes, and any other markup can never reach
 * the database or the DOM.
 */
export function sanitizePlainText(input: string, maxLength = 4000): string {
  const parsed = new DOMParser().parseFromString(input, 'text/html');
  const text = (parsed.body.textContent ?? '').replace(/\s+/g, ' ').trim();
  return text.slice(0, maxLength);
}

/**
 * Re-encode an image client-side to WebP, iteratively lowering quality/scale
 * until it is under maxBytes (default 1.5MB). Runs entirely on the
 * <canvas> element already available in every browser, so no image
 * compression library needs to be added to package.json.
 */
export async function compressImageToWebP(file: File, maxBytes = 1.5 * 1024 * 1024): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  const MAX_DIMENSION = 2000;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  let quality = 0.85;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob) break;
    if (blob.size <= maxBytes || quality <= 0.35) {
      return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
    }
    quality -= 0.15;
  }
  return file;
}

export interface SubmitContributionInput {
  lifeRecordId: string;
  contributorName: string;
  storyText: string;
  mediaUrls?: string[];
  targetEventId?: string | null;
}

/** Public: submit a memory for moderation. Text is sanitized before it ever leaves this function. */
export async function submitContribution(input: SubmitContributionInput): Promise<Result<PendingContribution>> {
  if (!supabase) return fail(NOT_CONFIGURED);
  const contributorName = sanitizePlainText(input.contributorName, 120);
  const storyText = sanitizePlainText(input.storyText, 4000);
  if (!contributorName) return fail('Please tell us your name.');
  if (!storyText) return fail('Please share a memory before submitting.');

  const { data, error } = await supabase
    .from('pending_contributions')
    .insert({
      life_record_id: input.lifeRecordId,
      contributor_name: contributorName,
      story_text: storyText,
      media_urls: input.mediaUrls ?? [],
      target_event_id: input.targetEventId ?? null,
    })
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(data as PendingContribution);
}

/** List contributions awaiting moderation for a life record. Owner/steward visibility only (RLS). */
export async function listPendingContributions(lifeRecordId: string): Promise<Result<PendingContribution[]>> {
  if (!supabase) return fail(NOT_CONFIGURED);
  const { data, error } = await supabase
    .from('pending_contributions')
    .select('*')
    .eq('life_record_id', lifeRecordId)
    .eq('status', 'PENDING_APPROVAL')
    .order('created_at', { ascending: false });
  if (error) return fail(error.message);
  return ok((data ?? []) as PendingContribution[]);
}

/** Owner/steward: approve or reject a pending contribution. */
export async function moderateContribution(
  contributionId: string,
  decision: 'APPROVED' | 'REJECTED',
): Promise<Result<null>> {
  if (!supabase) return fail(NOT_CONFIGURED);
  const { error } = await supabase
    .from('pending_contributions')
    .update({ status: decision })
    .eq('id', contributionId);
  if (error) return fail(error.message);
  return ok(null);
}

/** Admin-only (see profiles.is_admin): traffic counters for the analytics dashboard. */
export async function getDailyAnalytics(
  platform: 'LIVINGGLEN' | 'MEMORYGLEN',
  days = 30,
): Promise<Result<DailyAnalyticsRow[]>> {
  if (!supabase) return fail(NOT_CONFIGURED);
  const { data, error } = await supabase.rpc('get_daily_analytics', {
    p_platform: platform,
    p_days: days,
  });
  if (error) return fail(error.message);
  return ok((data ?? []) as DailyAnalyticsRow[]);
}

/** Record one page view. Safe to call from every page load; never throws. */
export async function recordPageView(
  platform: 'LIVINGGLEN' | 'MEMORYGLEN',
  pagePath: string,
  isUnique: boolean,
): Promise<void> {
  if (!supabase) return;
  await supabase.rpc('increment_hit_counter', {
    p_platform: platform,
    p_page_path: pagePath,
    p_is_unique: isUnique,
  });
}
