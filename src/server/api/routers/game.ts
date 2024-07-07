import { z } from 'zod';

import { expirationMinutesConfigConst } from '~/config/app.config';
import {
  type GameFlavor,
  GameFlavorArray,
  initialBoardConst,
} from '~/lib/constant';
import { checkLoser, checkWinner } from '~/lib/game.lib';
import { boardToHash } from '~/lib/util.lib';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import type { TBoard } from '~/type/game.type';

export const gameRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Droids you are looking for, ${input.text}!`,
      };
    }),

  getGamesToJoin: protectedProcedure.query(({ ctx }) => {
    return ctx.db.game.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        OR: [
          {
            p1Id: ctx.user.id,
          },
          {
            p2Id: ctx.user.id,
          },
          {
            p2Id: null,
          },
        ],
        state: { in: ['PENDING', 'ACTIVE'] },
      },
      include: {
        p1: true,
        p2: true,
        winner: true,
      },
    });
  }),

  getMyGames: protectedProcedure.query(({ ctx }) => {
    return ctx.db.game.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        OR: [
          {
            p1Id: ctx.user.id,
          },
          {
            p2Id: ctx.user.id,
          },
        ],
        state: { in: ['PENDING', 'ACTIVE'] },
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        flavor: z
          .enum<
            GameFlavor,
            [GameFlavor, ...GameFlavor[]]
          >(['standard', ...GameFlavorArray])
          .default('standard'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return ctx.db.game.create({
        data: {
          name: input.name,
          p1Id: ctx.user.id,
          p2Id: null,
          createdById: ctx.user.id,
          winnerId: null,
          flavor: input.flavor,
        },
      });
    }),

  join: protectedProcedure
    .input(
      z.object({
        gameId: z.string().cuid(),
        playerId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const game = await ctx.db.game.findFirstOrThrow({
        where: { id: input.gameId },
      });

      if (game.p1Id === input.playerId || game.p2Id === input.playerId) {
        return game;
      }

      if (game.p2Id) {
        throw new Error('Game is full');
      }

      return ctx.db.game.update({
        where: { id: input.gameId },
        data: {
          state: 'ACTIVE',
          p2Id: input.playerId,
        },
      });
    }),

  cancel: protectedProcedure
    .input(
      z.object({
        gameId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const game = await ctx.db.game.findFirstOrThrow({
        where: { id: input.gameId },
      });

      if (game.p1Id !== ctx.user.id) {
        return game;
      }

      return ctx.db.game.update({
        where: { id: input.gameId },
        data: {
          state: 'ABORTED',
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.game.findFirst({
      orderBy: { createdAt: 'desc' },
      where: { createdBy: { id: ctx.user.id } },
    });
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.game.findMany({
      orderBy: { createdAt: 'desc' },
      where: {},
    });
  }),

  getById: protectedProcedure
    .input(
      z.object({
        gameId: z.string().cuid(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.game.findFirstOrThrow({
        where: {
          id: input.gameId,
        },
      });
    }),

  getGameInfo: protectedProcedure
    .input(
      z.object({
        gameId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let game = await ctx.db.game.findFirstOrThrow({
        where: {
          id: input.gameId,
        },
        include: {
          p1: true,
          p2: true,
          winner: true,
        },
      });

      // https://dev.to/samanthaming/how-to-deep-clone-an-array-in-javascript-3cig
      const board = JSON.parse(
        JSON.stringify(initialBoardConst[game.flavor]),
      ) as TBoard;

      if (!board) {
        throw new Error('gameGetGameInfoAction: board is null');
      }

      const moves = await ctx.db.move.findMany({
        where: {
          gameId: game.id,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      for (const move of moves) {
        const { positionIdFrom, positionIdTo, checkerId } = move;

        const [_checkerX, fromY, fromX] = positionIdFrom
          .split('-')
          .map((v) => parseInt(v, 10));
        const [_checkerY, toY, toX] = positionIdTo
          .split('-')
          .map((v) => parseInt(v, 10));

        if (toY !== undefined && toX !== undefined) {
          const row = board[toY];

          if (row !== undefined) {
            // board[toY][toX] = checkerId

            row[toX] = checkerId;
          }
        }
        if (fromY !== undefined && fromX !== undefined) {
          const row = board[fromY];

          if (row !== undefined) {
            row[fromX] = '';
          }
        }
      }

      const winnerFirstTier = checkLoser(board, moves.length, game.flavor);

      if (winnerFirstTier !== false && game.winnerId === null) {
        game = await ctx.db.game.setWinner(game.id, winnerFirstTier);
      }

      const winnerSecondTier = checkWinner(board, moves.length, game.flavor);

      if (winnerSecondTier !== false && game.winnerId === null) {
        game = await ctx.db.game.setWinner(game.id, winnerSecondTier);
      }

      return {
        game,
        boardHash: boardToHash(board),
        movesCount: moves.length + 1,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!';
  }),

  getExpiredGames: publicProcedure.query(({ ctx }) => {
    return ctx.db.game.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        updatedAt: {
          lte: new Date(Date.now() - 1000 * 60 * expirationMinutesConfigConst),
        },
        state: { in: ['PENDING', 'ACTIVE'] },
      },
    });
  }),

  requestMoveCancellation: protectedProcedure
    .input(
      z.object({
        gameId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.game.findFirstOrThrow({
        where: { id: input.gameId },
      });

      if (game.p1Id !== ctx.user.id && game.p2Id !== ctx.user.id) {
        return game;
      }

      return ctx.db.game.requestMoveCancellation(input.gameId, ctx.user.id);
    }),

  cancelMoveConfirmation: protectedProcedure
    .input(
      z.object({
        gameId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.game.deleteLastMove(input.gameId);
    }),

  markExpired: publicProcedure
    .input(
      z.object({
        gameId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.game.update({
        where: { id: input.gameId },
        data: {
          state: 'EXPIRED',
        },
      });
    }),
});
