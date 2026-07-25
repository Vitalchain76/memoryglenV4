import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Check, Copy, Mail } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';

interface Invitation {
  id: string;
  email: string;
  full_name: string | null;
  status: string;
  created_at: string;
}

/**
 * Account — profile and family invitations.
 *
 * ON INVITATIONS, and this is a real limitation worth understanding:
 *
 * Supabase's `auth.admin.inviteUserByEmail()` sends the email itself, but it
 * requires the service_role key, which bypasses Row Level Security and must
 * NEVER be shipped to a browser. So this first version records the invitation
 * in a table the inviter owns, and gives them a link to send themselves.
 *
 * To have MemoryGlen send the email, the invitation needs to go through a
 * Supabase Edge Function holding the service key server-side. That is the next
 * step, not something that can be done from the client.
 */
export default function Account() {
  const { user, profile, loading, configured, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [copied, setCopied] = useState(false);

  // Keyed off the profile so the field tracks it without a setState-in-effect.
  const profileName = profile?.full_name ?? '';
  const [nameKey, setNameKey] = useState(profileName);
  if (nameKey !== profileName) {
    setNameKey(profileName);
    setName(profileName);
  }

  useEffect(() => {
    if (!loading && configured && !user) navigate('/signin', { replace: true });
  }, [loading, configured, user, navigate]);

  const [inviteReload, setInviteReload] = useState(0);
  const loadInvitations = useCallback(() => setInviteReload((n) => n + 1), []);

  useEffect(() => {
    if (!supabase || !user) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase!
        .from('invitations')
        .select('id, email, full_name, status, created_at')
        .order('created_at', { ascending: false });
      // Async boundary: never write state into an unmounted component.
      if (!cancelled) setInvitations((data as Invitation[]) ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, inviteReload]);


  const inviteLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/signin?mode=register`;

  const saveName = async () => {
    setSavingName(true);
    setNameSaved(false);
    const res = await updateProfile(name.trim());
    setSavingName(false);
    if (!res.error) {
      setNameSaved(true);
      window.setTimeout(() => setNameSaved(false), 2500);
    }
  };

  const sendInvite = async () => {
    setInviteError(null);
    const email = inviteEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setInviteError('Please enter a valid email address.');
      return;
    }
    if (!supabase || !user) return;
    setInviting(true);
    const { error } = await supabase.from('invitations').insert({
      inviter_id: user.id,
      email,
      full_name: inviteName.trim() || null,
    });
    setInviting(false);
    if (error) {
      setInviteError(
        error.code === '23505' ? 'You have already invited that address.' : error.message,
      );
      return;
    }
    setInviteEmail('');
    setInviteName('');
    loadInvitations();
  };

  if (loading) {
    return (
      <div className="container-content py-24">
        <p className="text-soft">Loading…</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="container-content py-24">
        <p className="max-w-reading leading-relaxed text-soft">
          Accounts are not switched on yet.{' '}
          <Link to="/memorials" className="underline underline-offset-4">
            Browse memorials
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="container-content py-16 md:py-24">
      <div className="mx-auto max-w-reading space-y-16">
        <Reveal>
          <p className="eyebrow">Your account</p>
          <h1 className="type-h2 mt-4 text-body">{profile?.full_name || 'Welcome'}</h1>
          <p className="type-meta mt-2 text-soft">{profile?.email ?? user?.email}</p>
        </Reveal>

        {/* Profile */}
        <Reveal>
          <section aria-labelledby="acct-profile">
            <h2 id="acct-profile" className="type-h3 text-body">
              Your details
            </h2>
            <label className="mt-5 block">
              <span className="type-meta text-soft">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 text-body"
              />
            </label>
            <label className="mt-4 block">
              <span className="type-meta text-soft">Email</span>
              <input
                type="email"
                value={profile?.email ?? user?.email ?? ''}
                readOnly
                className="mt-1.5 min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-well px-4 text-soft"
              />
            </label>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => void saveName()}
                disabled={savingName}
                className="btn btn-evergreen min-h-12 disabled:opacity-50"
              >
                {savingName ? 'Saving…' : 'Save'}
              </button>
              {nameSaved && (
                <span className="type-meta inline-flex items-center gap-1.5 text-evergreen">
                  <Check size={14} aria-hidden /> Saved
                </span>
              )}
            </div>
          </section>
        </Reveal>

        {/* Invitations */}
        <Reveal>
          <section aria-labelledby="acct-invite">
            <h2 id="acct-invite" className="type-h3 text-body">
              Invite family
            </h2>
            <p className="mt-3 leading-relaxed text-soft">
              Add someone here and share the link with them. MemoryGlen does not send the
              email itself yet.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="type-meta text-soft">Their name (optional)</span>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="mt-1.5 min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 text-body"
                />
              </label>
              <label className="block">
                <span className="type-meta text-soft">Their email</span>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void sendInvite();
                  }}
                  className="mt-1.5 min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 text-body"
                />
              </label>
            </div>

            {inviteError && <p className="mt-3 text-sm text-[color:var(--danger,#a33)]">{inviteError}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => void sendInvite()}
                disabled={inviting}
                className="btn btn-evergreen min-h-12 disabled:opacity-50"
              >
                <Mail size={16} aria-hidden /> {inviting ? 'Adding…' : 'Add invitation'}
              </button>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard?.writeText(inviteLink);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                }}
                className="btn btn-outline-evergreen min-h-12"
              >
                {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                {copied ? 'Link copied' : 'Copy invite link'}
              </button>
            </div>

            {invitations.length > 0 && (
              <ul className="mt-8 divide-y divide-[color:var(--line)]">
                {invitations.map((inv) => (
                  <li key={inv.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
                    <span className="min-w-0 flex-1 text-body">{inv.full_name || inv.email}</span>
                    {inv.full_name && <span className="type-meta text-soft">{inv.email}</span>}
                    <span className="type-meta uppercase tracking-[0.12em] text-brass">
                      {inv.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Reveal>

        <Reveal>
          <button
            type="button"
            onClick={() => {
              void signOut();
              navigate('/');
            }}
            className="link-arrow text-sm"
          >
            Sign out
          </button>
        </Reveal>
      </div>
    </div>
  );
}
