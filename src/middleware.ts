import { type NextRequest, NextResponse } from 'next/server';

import { DEFAULT_LOCALE } from './config/app.config';

export function middleware(req: NextRequest) {
  const locale = req.cookies.get('i18next')?.value || DEFAULT_LOCALE;
  const nextUrl = req.nextUrl.clone();

  // Add a parameter to the URL
  nextUrl.searchParams.set('locale', locale);

  const res = NextResponse.rewrite(nextUrl);
  res.cookies.set('i18next', locale);

  return res;
}

export const config = {
  // restricted routes
  matcher: ['/', '/:path*'],
};
