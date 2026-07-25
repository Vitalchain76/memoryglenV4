import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { AuthContext } from '@/lib/authContext';
import type { AuthState, Profile } from '@/lib/authContext';


/**
 * Auth state for the whole app.
 *
 * Memorial pages are public and must render for signed-out visitors, so this
 * provider never blocks rendering and never throws when Supabase is
 * unconfigured — it simply reports `configured: false` and everything
 * auth-related stays out of the way.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('id', userId)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
      if (data.session?.user) void loadProfile(data.session.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next?.user) void loadProfile(next.user.id);
      else setProfile(null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      configured: isSupabaseConfigured,

      async signUp(email, password, fullName) {
        if (!supabase) return { error: 'Sign-up is not available yet.' };
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) return { error: error.message };
        // Email confirmation on: a user exists but no session is issued.
        return { needsConfirmation: !data.session };
      },

      async signIn(email, password) {
        if (!supabase) return { error: 'Sign-in is not available yet.' };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { error: error.message } : {};
      },

      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
        setProfile(null);
      },

      async updateProfile(fullName) {
        if (!supabase || !session?.user) return { error: 'Not signed in.' };
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', session.user.id);
        if (error) return { error: error.message };
        await loadProfile(session.user.id);
        return {};
      },

      async refreshProfile() {
        if (session?.user) await loadProfile(session.user.id);
      },
    }),
    [loading, session, profile, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
