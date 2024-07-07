'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { lucia, validateRequestCache } from '~/server/lucia';

interface ActionResult {
  error: string;
}

export async function signOutLucia(formData: FormData): Promise<ActionResult> {
  const { session } = await validateRequestCache();

  const sessionId = formData.get('sessionId');

  if (!session || !sessionId) {
    return {
      error: 'Unauthorized',
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set({
    ...sessionCookie.attributes,
    name: sessionCookie.name,
    value: sessionCookie.value,
    path: sessionId ? `/${sessionId}` : '/',
    httpOnly: false,
  });

  return redirect('/');
}
