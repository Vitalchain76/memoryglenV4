import SignIn from '@/pages/SignIn';

/**
 * Create Account — a distinct page, not a toggle hidden inside sign-in.
 *
 * Served at /register, /signup and /create-account, because those are the three
 * things people type. It shares SignIn's form so there is one implementation and
 * one place for bugs to live.
 */
export default function Register() {
  return <SignIn initialMode="register" />;
}
