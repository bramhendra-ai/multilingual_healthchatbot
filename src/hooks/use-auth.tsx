'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { displayName?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Firebase functions
const mockSignInWithEmailAndPassword = async (email: string, pass: string) => {
  console.log('Mock sign in with', email, pass);
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, this would come from the auth provider
  const storedUser = localStorage.getItem('mockUser');
  if (storedUser) {
    return { user: JSON.parse(storedUser) };
  }
  return {
    user: {
      uid: 'mock-uid-123',
      email: email,
      displayName: 'Mock User',
    } as User,
  };
};

const mockCreateUserWithEmailAndPassword = async (
  email: string,
  pass: string,
  name: string
) => {
  console.log('Mock sign up with', email, pass, name);
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    user: {
      uid: 'mock-uid-123',
      email: email,
      displayName: name,
    } as User,
  };
};

const mockSignOut = async () => {
  console.log('Mock sign out');
  await new Promise(resolve => setTimeout(resolve, 500));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect simulates checking the auth state on mount
  useEffect(() => {
    const unsubscribe = () => {
      // In a real app, you'd use onAuthStateChanged from Firebase
      // For this mock, we'll just set loading to false after a delay
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    const timer = setTimeout(unsubscribe, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // In a real app, you'd use the commented out line
      // const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const { user: signedInUser } = await mockSignInWithEmailAndPassword(
        email,
        pass
      );
      setUser(signedInUser);
      localStorage.setItem('mockUser', JSON.stringify(signedInUser));
      return { user: signedInUser };
    } catch (error) {
      console.error('Sign in error', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      // In a real app, you'd use the commented out line
      // const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // await updateProfile(userCredential.user, { displayName: name });
      const { user: signedUpUser } = await mockCreateUserWithEmailAndPassword(
        email,
        pass,
        name
      );
      setUser(signedUpUser);
      localStorage.setItem('mockUser', JSON.stringify(signedUpUser));
      return { user: signedUpUser };
    } catch (error) {
      console.error('Sign up error', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // await firebaseSignOut(auth);
      await mockSignOut();
      setUser(null);
      localStorage.removeItem('mockUser');
    } catch (error) {
      console.error('Sign out error', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: { displayName?: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      // In a real app, you'd use updateProfile(auth.currentUser, updates)
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update profile error', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = { user, loading, signIn, signUp, signOut, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
