import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client.
 *
 * Credentials come from environment variables only — nothing is hard-coded, and
 * `.env` is gitignored. `.env.example` documents what is needed.
 *
 * IMPORTANT, and worth understanding rather than assuming:
 *
 * Vite inlines every `VITE_*` variable into the production JavaScript bundle at
 * build time. Putting the anon key in `.env` keeps it out of the git history,
 * but it does NOT make it secret — anyone can read it from the shipped bundle.
 *
 * That is fine, because the anon key is designed to be public. What actually
 * protects the data is Row Level Security. Every table MUST have RLS enabled
 * with policies that restrict rows to their owner. Without RLS, this key grants
 * full read and write access to the database to anyone who views source.
 *
 * See supabase/migrations/0001_auth_and_profiles.sql.
 *
 * The service_role key must never appear in this repository or in any VITE_*
 * variable. It bypasses RLS entirely.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True when the app has been given credentials. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Null when unconfigured. Deliberately null rather than throwing: a missing
 * .env must never take down the memorial pages, which are public and must keep
 * working for visitors who never sign in.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[MemoryGlen] Supabase is not configured. Copy .env.example to .env and fill it in. ' +
      'Memorial pages will still work; sign-in will be unavailable.',
  );
}
