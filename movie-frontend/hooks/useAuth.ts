'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const router = useRouter();
  const { accessToken, hydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (hydrated && !accessToken) {
      router.replace('/');
    }
  }, [hydrated, accessToken, router]);
};
