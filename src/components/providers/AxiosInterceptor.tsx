'use client';

import { useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '@/api/client';

export default function AxiosInterceptor({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    // We add the interceptor to attach the auth token to every request
    const requestIntercept = apiClient.interceptors.request.use(
      (config) => {
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      // Clean up the interceptor on unmount
      apiClient.interceptors.request.eject(requestIntercept);
    };
  }, [session]);

  return <>{children}</>;
}
