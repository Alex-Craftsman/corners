'use client';

import { LogOutIcon } from 'lucide-react';

import { signOutLucia } from '~/app/action/sign-out';
import { useSession } from '~/store/session.store';
import type { Nullable } from '~/type/helper.type';
import type { User } from '~prisma';

const NavbarSignOut = ({ user }: { user: Nullable<User> }) => {
  const { sessionId } = useSession();

  return user ? (
    <form action={signOutLucia}>
      <input type="hidden" name="sessionId" value={sessionId} />
      <button>
        <LogOutIcon size="26" />
      </button>
    </form>
  ) : null;
};

export default NavbarSignOut;
