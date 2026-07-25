import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
}

export interface AuthState {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  configured: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (fullName: string) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);
