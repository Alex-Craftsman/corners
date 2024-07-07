'use client';

import { createContext, type FC, type PropsWithChildren } from 'react';

import type { TUserContext } from '~/type/user.type';
import type { User } from '~prisma';

export const userContext = createContext<TUserContext>({
  user: null,
});

export const UserContextProvider: FC<
  PropsWithChildren<{
    user: User | null;
  }>
> = ({
  user,
  children,
}: PropsWithChildren<{
  user: User | null;
}>) => {
  return (
    <userContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
