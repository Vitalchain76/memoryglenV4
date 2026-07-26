import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import Reveal from '@/components/Reveal';
import { useAuth } from '@/lib/useAuth';

/**
 * Sign in / Sign up.
 *
 * `?mode=register` opens on registration. Memorial pages remain public — this
 * exists so family can be invited in, not to gate the memorials.
 */
export default function SignIn({ initialMode }: { initialMode?: 'signin' | 'register' } = {}) {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'register'>(
    initialMode ?? (params.get('mode') === 'register' ? 'register' : 'signin'),
  );
  const { signIn, signUp, configured } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const registering = mode === 'register';

  const submit = async () => {
    setError(null);
    setNotice(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and a password.');
      return;
    }
    if (registering && !fullName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (registering && password.length < 8) {
      setError('Please choose a password of at least 8 characters.');
      return;
    }
    setBusy(true);
    const res = registering
      ? await signUp(email.trim(), password, fullName.trim())
      : await signIn(email.trim(), password);
    setBusy(false);

    if (res.error) {
      setError(res.error);
      return;
    }
    if (registering && 'needsConfirmation' in res && res.needsConfirmation) {
      setNotice('Check your email to confirm your address, then sign in.');
      return;
    }
    navigate('/account');
  };

  return (
    <div className="container-content py-16 md:py-24">
      <div className="mx-auto max-w-[440px]">
        <Reveal>
          <p className="eyebrow">{registering ? 'Create an account' : 'Welcome back'}</p>
          <h1 className="type-h2 mt-4 text-body">
            {registering ? 'Create your account' : 'Sign in'}
          </h1>
          <p className="mt-3 leading-relaxed text-soft">
            {registering
              ? 'An account lets you build a memorial, add memories and invite your family. Memorials stay open to everyone whether you have one or not.'
              : 'Sign in to add to a memorial or invite family. Browsing memorials never needs an account.'}
          </p>
        </Reveal>

        {!configured && (
          <Reveal delay={0.05}>
            <p className="mt-6 rounded-sm border border-dashed border-brass/60 p-4 text-sm text-soft">
              Accounts are not switched on yet. Memorial pages work as normal.
            </p>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <div className="mt-8 space-y-4">
            {registering && (
              <label className="block">
                <span className="type-meta text-soft">Your name</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 text-body"
                />
              </label>
            )}
            <label className="block">
              <span className="type-meta text-soft">Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 text-body"
              />
            </label>
            <label className="block">
              <span className="type-meta text-soft">Password</span>
              <input
                type="password"
                autoComplete={registering ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void submit();
                }}
                className="mt-1.5 min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 text-body"
              />
            </label>

            {error && <p className="text-sm text-[color:var(--danger,#a33)]">{error}</p>}
            {notice && <p className="text-sm text-evergreen">{notice}</p>}

            <button
              type="button"
              disabled={busy || !configured}
              onClick={() => void submit()}
              className="btn btn-evergreen min-h-12 w-full disabled:opacity-50"
            >
              {busy ? 'Please wait…' : registering ? 'Create account' : 'Sign in'}
            </button>

            <p className="type-meta text-center text-soft">
              {registering ? 'Already have an account?' : 'No account yet?'}{' '}
              <button
                type="button"
                onClick={() => {
                  const next = registering ? 'signin' : 'register';
                  setMode(next);
                  setError(null);
                  setNotice(null);
                  // Keep the URL honest so the page is linkable and Back works.
                  navigate(next === 'register' ? '/register' : '/signin', { replace: true });
                }}
                className="min-h-11 underline underline-offset-4 hover:text-evergreen"
              >
                {registering ? 'Sign in' : 'Create one'}
              </button>
            </p>

            <p className="type-meta text-center text-soft">
              <Link to="/memorials" className="underline underline-offset-4 hover:text-evergreen">
                Browse memorials without an account
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
