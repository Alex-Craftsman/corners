import type { NextPage } from 'next';

import HomePageContent from '~/components/home/HomePageContent';
import SignUp from '~/components/home/SignUp';
import { validateRequestCache } from '~/server/lucia';
import { api } from '~/trpc/server';
import type { User } from '~prisma';

const HomePage: NextPage<{
  params: {
    sessionId: string;
  };
}> = async ({ params }) => {
  const { user: sessionUser } = await validateRequestCache();

  let user: User | null = null;

  if (sessionUser) {
    user = await api.user.identity();
  }

  return sessionUser && user ? (
    <HomePageContent user={user} />
  ) : (
    <SignUp sessionId={params.sessionId} />
  );
};

export default HomePage;
