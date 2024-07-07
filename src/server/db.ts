import { env } from '~/env.mjs';
import { PrismaClient } from '~prisma';

const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? [
            // 'query',
            'error',
            'warn',
          ]
        : ['error'],
  }).$extends({
    model: {
      game: {
        async switchPlayer(id: string) {
          const game = await prisma.game.findFirstOrThrow({
            where: { id },
          });

          await prisma.game.update({
            where: { id },
            data: {
              turn: game.turn === 'p1' ? 'p2' : 'p1',
              p1CancelRequest: false,
              p2CancelRequest: false,
            },
          });

          return prisma.game.findFirstOrThrow({
            where: { id },
          });
        },
        async setWinner(id: string, winner: 'p1' | 'p2' | null) {
          const game = await prisma.game.findFirstOrThrow({
            where: { id },
          });

          await prisma.game.update({
            where: { id },
            data: {
              winnerId:
                (winner === 'p1' && game.p1Id) ||
                (winner === 'p2' && game.p2Id) ||
                null,
              state: 'FINISHED',
            },
          });

          return prisma.game.findFirstOrThrow({
            where: { id },
            include: {
              p1: true,
              p2: true,
              winner: true,
            },
          });
        },
        async requestMoveCancellation(id: string, pId: string) {
          await prisma.game.updateMany({
            where: { id, p1Id: pId },
            data: {
              p1CancelRequest: true,
            },
          });

          await prisma.game.updateMany({
            where: { id, p2Id: pId },
            data: {
              p2CancelRequest: true,
            },
          });

          return prisma.game.findFirstOrThrow({
            where: { id },
          });
        },
        async deleteLastMove(id: string) {
          const game = await prisma.game.findFirstOrThrow({
            where: { id },
          });

          const lastMove = await prisma.move.findFirst({
            where: {
              gameId: id,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          if (lastMove) {
            await prisma.game.update({
              where: { id },
              data: {
                turn: game.turn === 'p1' ? 'p2' : 'p1',
                p1CancelRequest: false,
                p2CancelRequest: false,
              },
            });

            await prisma.move.delete({
              where: {
                id: lastMove.id,
              },
            });
          }

          return prisma.game.findFirstOrThrow({
            where: { id },
          });
        },
      },
    },
  });

  return prisma;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
