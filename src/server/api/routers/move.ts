import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const moveRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        gameId: z.string().cuid(),
        checkerId: z.string(),
        positionIdFrom: z.string(),
        positionIdTo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.move
        .create({
          data: {
            gameId: input.gameId,
            playerId: ctx.user.id,
            checkerId: input.checkerId,
            positionIdFrom: input.positionIdFrom,
            positionIdTo: input.positionIdTo,
          },
        })
        .then((move) => {
          if (move.gameId) {
            ctx.db.game.switchPlayer(move.gameId);
          }

          return move;
        });
    }),
});
