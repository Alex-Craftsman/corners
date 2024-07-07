import { NextResponse } from 'next/server';

import { api } from '~/trpc/server';

const handler = async () => {
  const games = await api.game.getExpiredGames();

  let expired = 0;

  for (const game of games) {
    await api.game.markExpired({
      gameId: game.id,
    });

    expired += 1;
  }

  return NextResponse.json({ expired });
};

export { handler as GET, handler as POST };
