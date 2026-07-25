import { useContext } from 'react';
import { AuthContext } from '@/lib/authContext';
import type { AuthState } from '@/lib/authContext';

/** Auth state. Throws only if used outside AuthProvider, which is a bug. */
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
