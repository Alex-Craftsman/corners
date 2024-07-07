import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  sessionedProcedure,
} from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: uuidv4() + '@crf.mn',
          emailVerified: new Date(),
        },
      });
    }),

  identity: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findFirstOrThrow({
      where: { id: ctx.user.id },
    });
  }),

  safeIdentity: sessionedProcedure.query(({ ctx }) => {
    return ctx.user
      ? ctx.db.user.findFirstOrThrow({
          where: { id: ctx.user.id },
        })
      : null;
  }),

  findByNameOrEmail: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: {
          OR: [{ name: input.name }, { email: input.name }],
        },
      });
    }),
});
