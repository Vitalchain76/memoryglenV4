import { supabase } from '@/lib/supabase';

export interface GuestbookRow {
  id: string;
  memorial_slug: string;
  guest_name: string;
  message: string;
  media_url: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface SubmitGuestbookInput {
  memorialSlug: string;
  guestName: string;
  message: string;
  mediaUrl?: string | null;
}

/** Insert a tribute for family moderation. Always stored is_approved = false. */
export async function submitGuestbookEntry(
  input: SubmitGuestbookInput,
): Promise<{ entry?: GuestbookRow; error?: string }> {
  if (!supabase) return { error: 'The guestbook is not switched on yet.' };

  const guestName = input.guestName.trim();
  const message = input.message.trim();
  if (!guestName) return { error: 'Please add your name.' };
  if (!message) return { error: 'Please write a message.' };

  const { data, error } = await supabase
    .from('guestbook_entries')
    .insert({
      memorial_slug: input.memorialSlug,
      guest_name: guestName,
      message,
      media_url: input.mediaUrl?.trim() || null,
      is_approved: false,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { entry: data as GuestbookRow };
}

/** Fetch approved tributes for a memorial, newest first. */
export async function getApprovedGuestbookEntries(
  memorialSlug: string,
): Promise<GuestbookRow[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('guestbook_entries')
    .select('*')
    .eq('memorial_slug', memorialSlug)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  return (data as GuestbookRow[]) ?? [];
}
