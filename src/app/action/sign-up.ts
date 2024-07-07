'use server';

import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { z, ZodError } from 'zod';

import { db } from '~/server/db';
import { lucia } from '~/server/lucia';

interface ActionResult {
  error: string | null;
}

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: '2 или более символов' })
    .max(12, { message: '12 или менее символов' })
    .regex(/^[\p{L}\p{M}\p{Zs}-]+$/u, {
      message: 'Имя может содержать только буквы, пробелы и дефис',
    }),
});

function capitalizeFirstLetterOfEachWord(input: string): string {
  return input
    .split(/([- ])/) // Split by space or dash and include delimiters in the result
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export async function signUpLucia(formData: FormData): Promise<ActionResult> {
  try {
    let name = formData.get('name')?.toString() ?? '';
    const sessionId = formData.get('sessionId');

    signUpSchema.parse({ name: name.trim() });

    name = capitalizeFirstLetterOfEachWord(name.trim());

    let possibleUser = await db.user.findFirst({
      where: {
        name,
      },
    });

    if (!possibleUser) {
      possibleUser = await db.user.create({
        data: {
          name,
          email: uuidv4() + '@crf.mn',
          emailVerified: new Date(),
        },
      });
    }

    const session = await lucia.createSession(possibleUser.id, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set({
      ...sessionCookie.attributes,
      name: sessionCookie.name,
      value: sessionCookie.value,
      path: sessionId ? `/${sessionId}` : '/',
      httpOnly: false,
    });

    return {
      error: null,
    };
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return {
        error: e.errors.join(' '),
      };
    }

    throw new Error('VALIDATION_ERROR ');
  }
}
