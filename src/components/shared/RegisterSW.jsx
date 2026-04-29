'use client';

import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    // Service workers only work in production
    // and in browsers that support them
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            '[SW] Registered successfully:',
            registration.scope
          );
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error);
        });
    }
  }, []);

  // This component renders nothing visible
  return null;
}