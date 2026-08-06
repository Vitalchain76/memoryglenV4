import { supabase } from '@/lib/supabase';
import { sanitiseImage } from '@/lib/imageSanitiser';
import { validateImageHeader } from '@/lib/mediaUtils';

/**
 * Data access for database-backed memorials.
 *
 * The two showcase memorials — virginia-dadirayi-chiimba and john-peters — are
 * bespoke React pages and are deliberately NOT in this table. Everything a user
 * creates goes through here.
 */

export const MEDIA_BUCKET = 'memorial-media';
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** Threat T-09: per-memorial ceiling on stored photographs. */
export const MAX_MEDIA_PER_MEMORIAL = 300;
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

export interface MemorialRow {
  id: string;
  owner_id: string;
  slug: string;
  full_name: string;
  born_on: string | null;
  died_on: string | null;
  tagline: string | null;
  story: string | null;
  resting_place: string | null;
  cover_path: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

export interface MediaRow {
  id: string;
  memorial_id: string;
  uploader_id: string;
  storage_path: string;
  kind: 'image' | 'video' | 'audio';
  caption: string | null;
  category: string | null;
  sort_order: number;
  created_at: string;
}

/** Public URL for a stored object. The bucket is public by design. */
export function mediaUrl(storagePath: string): string {
  if (!supabase) return '';
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

/**
 * Slug from a name, with a short random suffix. Two families will eventually
 * bury two people with the same name, and a collision must not fail the create
 * flow at the last step.
 */
export function slugify(fullName: string): string {
  const base = fullName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 6);
  return base ? `${base}-${suffix}` : `memorial-${suffix}`;
}

export interface CreateMemorialInput {
  fullName: string;
  bornOn?: string | null;
  diedOn?: string | null;
  tagline?: string | null;
  story?: string | null;
  restingPlace?: string | null;
  consentGiven: boolean;
  publish?: boolean;
}

export async function createMemorial(
  ownerId: string,
  input: CreateMemorialInput,
): Promise<{ memorial?: MemorialRow; error?: string }> {
  if (!supabase) return { error: 'Accounts are not switched on yet.' };
  if (!input.consentGiven) {
    return { error: 'Please confirm you have the family’s consent to publish.' };
  }

  const { data, error } = await supabase
    .from('memorials')
    .insert({
      owner_id: ownerId,
      slug: slugify(input.fullName),
      full_name: input.fullName.trim(),
      born_on: input.bornOn || null,
      died_on: input.diedOn || null,
      tagline: input.tagline?.trim() || null,
      story: input.story?.trim() || null,
      resting_place: input.restingPlace?.trim() || null,
      status: input.publish ? 'published' : 'draft',
      consent_given: true,
      consent_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { memorial: data as MemorialRow };
}

export async function getMemorialBySlug(
  slug: string,
): Promise<{ memorial?: MemorialRow; error?: string }> {
  if (!supabase) return { error: 'Not available.' };
  const { data, error } = await supabase
    .from('memorials')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return { error: error.message };
  if (!data) return { error: 'not-found' };
  return { memorial: data as MemorialRow };
}

export async function listPublishedMemorials(): Promise<MemorialRow[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('memorials')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return (data as MemorialRow[]) ?? [];
}

export async function listMyMemorials(ownerId: string): Promise<MemorialRow[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('memorials')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  return (data as MemorialRow[]) ?? [];
}

export async function listMedia(memorialId: string): Promise<MediaRow[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('memorial_media')
    .select('*')
    .eq('memorial_id', memorialId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  return (data as MediaRow[]) ?? [];
}

/**
 * Upload one photograph and record it.
 *
 * Validation happens here as well as in the bucket config: the bucket is the
 * real enforcement, this is only so the person gets a sentence they can act on
 * instead of a raw storage error.
 */
export async function uploadMedia(
  memorialId: string,
  uploaderId: string,
  file: File,
  caption?: string,
): Promise<{ media?: MediaRow; error?: string }> {
  if (!supabase) return { error: 'Accounts are not switched on yet.' };

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: 'That file type isn’t supported. Please use a JPG, PNG or WEBP photograph.' };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return { error: `That photo is ${mb} MB. Please use one under 10 MB.` };
  }
  if (!(await validateImageHeader(file))) {
    return { error: 'That file doesn’t look like a real photograph. Please choose a JPG, PNG, WEBP or HEIC image.' };
  }

  // Threat T-09: storage abuse. The bucket's size ceiling caps a single file;
  // this caps the total. Enforced again in the database by a trigger, since
  // anything checked only in the browser is advisory.
  const { count } = await supabase
    .from('memorial_media')
    .select('id', { count: 'exact', head: true })
    .eq('memorial_id', memorialId);
  if ((count ?? 0) >= MAX_MEDIA_PER_MEMORIAL) {
    return {
      error: `This memorial has reached ${MAX_MEDIA_PER_MEMORIAL} photographs. Please remove one before adding another.`,
    };
  }

  // Threat T-08: strip EXIF/GPS before the file ever leaves the device.
  let clean: File;
  try {
    clean = await sanitiseImage(file);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'That image could not be prepared.' };
  }

  const path = `${memorialId}/${crypto.randomUUID()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, clean, { cacheControl: '3600', upsert: false, contentType: 'image/jpeg' });

  if (uploadError) return { error: uploadError.message };

  const { data, error } = await supabase
    .from('memorial_media')
    .insert({
      memorial_id: memorialId,
      uploader_id: uploaderId,
      storage_path: path,
      kind: 'image',
      caption: caption?.trim() || null,
      bytes: clean.size,
    })
    .select()
    .single();

  if (error) {
    // Row insert failed after the object landed — remove the orphan so the
    // bucket doesn't fill with files nothing points at.
    await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    return { error: error.message };
  }

  return { media: data as MediaRow };
}

export async function deleteMedia(media: MediaRow): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Not available.' };
  const { error } = await supabase.from('memorial_media').delete().eq('id', media.id);
  if (error) return { error: error.message };
  await supabase.storage.from(MEDIA_BUCKET).remove([media.storage_path]);
  return {};
}
