'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getHabitsByUser } from '@/lib/storage';
import { logOut } from '@/lib/auth';
import { Session } from '@/types/auth';
import { Habit } from '@/types/habit';
import HabitList from '@/components/habits/HabitList';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import WelcomeUser from '@/components/habits/WelcomeUser';

// ── Inner content — only renders when session is confirmed ──
function DashboardContent({ session }: { session: Session }) {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    setHabits(getHabitsByUser(session.userId));
  }, [session.userId]);

  function handleLogout() {
    logOut();
    router.replace('/login');
  }

  function handleHabitsChange() {
    const updated = getHabitsByUser(session.userId);
    setHabits(updated);
  }

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen bg-gray-50"
    >
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Habit Tracker
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-indigo-100 sm:blockm rounded-full flex align-center justify-center" title='First letter of your email'>
              <span className="text-lg text-indigo-700 font-bold m-auto" >
                {session.email[0].toUpperCase()}
              </span>
            </div>
            <button
              data-testid="auth-logout-button"  
              onClick={handleLogout}
              className="text-sm text-red-600 font-medium hover:underline"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <WelcomeUser />
        <HabitList
          habits={habits}
          session={session}
          onHabitsChange={handleHabitsChange}
        />
      </main>
    </div>
  );
}

// ── Page — ProtectedRoute handles the auth check ──
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {(session) => <DashboardContent session={session} />}
    </ProtectedRoute>
  );
}