'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/storage';
import { Session } from '@/types/auth';

type Props = {
  children: (session: Session) => React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const currentSession = getSession();

    if (!currentSession) {
      router.replace('/login');
      return;
    }

    setSession(currentSession);
    setChecking(false);
  }, [router]);

  // Still checking session
  if (checking) return null;

  // Session confirmed — render children with session
  return <>{children(session!)}</>;
}