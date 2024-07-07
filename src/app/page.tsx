'use client';

import { useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';

import { useSession } from '~/store/session.store';

const HomePagePlaceholder: NextPage = () => {
  const { sessionId } = useSession();
  const { push } = useRouter();

  const ref = useRef<boolean>(false);

  useEffect(() => {
    if (sessionId && !ref.current) {
      ref.current = true;

      push(`/${sessionId}/`);
    }
  }, [push, sessionId]);

  return null;
};

export default HomePagePlaceholder;
