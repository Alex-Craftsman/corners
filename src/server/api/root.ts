import { gameRouter } from '~/server/api/routers/game';
import { moveRouter } from '~/server/api/routers/move';
import { speechRouter } from '~/server/api/routers/speech';
import { userRouter } from '~/server/api/routers/user';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  game: gameRouter,
  user: userRouter,
  move: moveRouter,
  speech: speechRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.game.all();
 *       ^? Game[]
 */
export const createCaller = createCallerFactory(appRouter);
