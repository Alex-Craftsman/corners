import { type PropsWithChildren } from 'react';
import type { NextPage } from 'next';

import { UserContextProvider } from './user.context';

import { validateRequestCache } from '~/server/lucia';
import { api } from '~/trpc/server';
import type { User } from '~prisma';

export const UserProvider: NextPage<PropsWithChildren> = async ({
  children,
}: PropsWithChildren) => {
  const { user: sessionUser } = await validateRequestCache();

  let user: User | null = null;

  if (sessionUser) {
    user = await api.user.identity();
  }

  return <UserContextProvider user={user}>{children}</UserContextProvider>;
};
