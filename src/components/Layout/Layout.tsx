'use client';
import { useUserInfoStore } from '@/store/zustand';
import { httpClient } from '@/utils/httpClient';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import React, { ReactNode, useEffect } from 'react';

const UID_COOKIE_KEY = 'CPPUniID';

const Layout = ({ children }: { children: ReactNode }) => {
  const { setUid } = useUserInfoStore();
  useEffect(() => {
    if (hasCookie(UID_COOKIE_KEY)) {
      setUid(getCookie(UID_COOKIE_KEY) ?? '');
    } else {
      const signIn = async () => {
        try {
          const res = await httpClient.get('/api/v1/guest/sign-in');
          setCookie(UID_COOKIE_KEY, res.data.uuid);
          setUid(res.data.uuid);
        } catch (error) {
          console.error('Guest sign in error:', error);
        }
      };
      signIn();
    }
  }, [setUid]);
  return <>{children}</>;
};

export default Layout;
