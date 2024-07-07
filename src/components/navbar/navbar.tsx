import Image from 'next/image';
import Link from 'next/link';

import { Icons } from '../icons';
import { Button } from '../ui/button';

import { ConnectCloud } from './connect-cloud';
import { LocaleToggle } from './locale-toggle';
import NavbarPlayerName from './NavbarPlayerName';
import NavbarSignOut from './NavbarSignOut';

import { ThemeToggle } from '~/components/navbar/theme-toggle';
import { routes } from '~/config/route.config';
import { api } from '~/trpc/server';

export const Navbar = async () => {
  const user = await api.user.safeIdentity();

  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/" className="font-mono text-lg font-bold">
            <div className="flex items-center gap-2">
              <Image
                src="/i/logo.png"
                alt="logo"
                width="24"
                height="24"
                color="white"
              />
              <span className="text-xs sm:text-base">
                corners • уголки
                <NavbarPlayerName user={user} />
              </span>
            </div>
          </Link>
          <ConnectCloud user={user} />
          <NavbarSignOut user={user} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Link href={routes.about} className="text-xs sm:text-base">
              <Icons.about />
            </Link>
          </Button>
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
