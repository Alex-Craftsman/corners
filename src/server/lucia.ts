import { cache } from 'react';
import { cookies } from 'next/headers';
import type { Session, User } from 'lucia';
import { Lucia } from 'lucia';

import { PrismaAdapter } from '@lucia-auth/adapter-prisma';

import { db } from './db';

const adapter = new PrismaAdapter(db.session, db.user);
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (user) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      name: user.name,
    };
  },
});

export const validateRequest = async (
  mySessionId?: string | null,
): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId =
    mySessionId ?? cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);

      cookies().set({
        ...sessionCookie.attributes,
        name: sessionCookie.name,
        value: sessionCookie.value,
        path: sessionId ? `/${sessionId}` : '/',
        httpOnly: false,
      });
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();

      cookies().set({
        ...sessionCookie.attributes,
        name: sessionCookie.name,
        value: sessionCookie.value,
        path: sessionId ? `/${sessionId}` : '/',
        httpOnly: false,
      });
    }
  } catch {
    // ignore
  }

  return result;
};

export const validateRequestCache = cache(validateRequest);

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  name: string;
}
