import { supabase } from '@/lib/supabase';

export type MemberRole = 'owner' | 'family' | 'guest';
export type MemberStatus = 'active' | 'pending';

export interface MemorialMember {
  id: string;
  memorial_slug: string;
  user_id: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
}

export type MembershipState = 'active' | 'pending' | 'none';

/**
 * Resolve the current user's membership state for a memorial.
 * Returns 'active' (full access), 'pending' (awaiting family approval)
 * or 'none' (no membership row / not signed in).
 */
export async function getMembershipState(
  memorialSlug: string,
): Promise<MembershipState> {
  if (!supabase) return 'none';
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 'none';

  const { data } = await supabase
    .from('memorial_members')
    .select('status')
    .eq('memorial_slug', memorialSlug)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!data) return 'none';
  return data.status === 'active' ? 'active' : 'pending';
}

/** Convenience: is the current user an approved (active) member? */
export async function checkMemorialMembership(
  memorialSlug: string,
): Promise<boolean> {
  return (await getMembershipState(memorialSlug)) === 'active';
}

export interface JoinResult {
  success: boolean;
  /** Resulting membership status when success is true. */
  status?: MembershipState;
  error?: string;
}

/**
 * Join a memorial.
 *  - With a VALID, unexpired invite code -> immediate 'active' access.
 *  - Without a code -> a 'pending' request the family must approve.
 *  - With an INVALID/expired code -> rejected (so a typo is not silently
 *    downgraded to a public request).
 */
export async function joinMemorial(
  memorialSlug: string,
  inviteCode?: string,
): Promise<JoinResult> {
  if (!supabase) return { success: false, error: 'Auth system unavailable.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Please sign in or create an account first.' };
  }

  const code = inviteCode?.trim();
  let role: MemberRole = 'guest';
  let status: MemberStatus = 'pending';

  if (code) {
    const { data: invite } = await supabase
      .from('memorial_invites')
      .select('role, email, expires_at')
      .eq('invite_code', code)
      .eq('memorial_slug', memorialSlug)
      .maybeSingle();

    const notExpired =
      invite && (!invite.expires_at || new Date(invite.expires_at) > new Date());
    const emailMatches =
      invite &&
      (!invite.email ||
        invite.email.toLowerCase() === (user.email || '').toLowerCase());

    if (!invite || !notExpired || !emailMatches) {
      return { success: false, error: 'Invalid or expired invitation code.' };
    }

    role = (invite.role as MemberRole) || 'guest';
    status = 'active';
  }

  const { error } = await supabase.from('memorial_members').upsert(
    {
      memorial_slug: memorialSlug,
      user_id: user.id,
      email: user.email || '',
      role,
      status,
    },
    { onConflict: 'memorial_slug,user_id' },
  );

  if (error) return { success: false, error: error.message };
  return { success: true, status };
}
