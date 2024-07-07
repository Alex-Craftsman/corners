import type { NextPage } from 'next';

import GameInner from '~/components/game/GameInner';
import { validateRequestCache } from '~/server/lucia';
import { api } from '~/trpc/server';
import type { User } from '~prisma';

const GamePage: NextPage<{
  params: {
    gameId: string;
  };
}> = async ({ params: { gameId } }) => {
  const { user: sessionUser } = await validateRequestCache();

  let user: User | null = null;

  if (sessionUser) {
    user = await api.user.identity();
  }

  const game = await api.game.getById({ gameId });

  return user ? <GameInner game={game} user={user} /> : null;
};

export default GamePage;
