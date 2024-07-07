'use client';

import { type PropsWithChildren, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';

import PageLoader from '~/components/ui/page-loader';
import { useSession } from '~/store/session.store';

const SessionLayout: NextPage<
  PropsWithChildren & {
    params: {
      sessionId: string;
    };
  }
> = ({ children, params }) => {
  const { push } = useRouter();

  const [isSessionValid, isSessionValidSet] = useState(false);

  const { sessionId } = useSession();

  useEffect(() => {
    if (sessionId === params.sessionId) {
      isSessionValidSet(true);
    } else if (sessionId) {
      push(`/${sessionId}`);
    }
  }, [params.sessionId, push, sessionId]);

  if (!isSessionValid) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

export default SessionLayout;
