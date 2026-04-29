
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { getSession } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If already logged in, go straight to dashboard
    const session = getSession();
    if (session) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Habit Tracker
          </h1>
          <p className="text-gray-500 mt-2">
            Welcome back! Log in to continue.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <LoginForm />
        </div>

        {/* Link to Signup */}
        <p className="text-center mt-6 text-gray-600">
          Do not have an account?{' '}
          <a
            href="/signup"
            className="text-indigo-700 font-medium hover:underline" >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}