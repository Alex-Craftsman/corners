import { type PropsWithChildren, Suspense } from 'react';
import type { Metadata, NextPage } from 'next';
import { cookies } from 'next/headers';
import { CookiesProvider } from 'next-client-cookies/server';

import { AudioContainer, AudioProvider } from '@crfmn/use-audio';

import '~/styles/globals.css';

import { Footer } from '~/components/footer';
import { Navbar } from '~/components/navbar/navbar';
import { I18NClientProvider } from '~/components/provider/i18n-provider';
import { ReactQueryClientProvider } from '~/components/provider/query.provider';
import { ThemeProvider } from '~/components/provider/theme-provider';
import { UserProvider } from '~/components/provider/user.provider';
import PageLoader from '~/components/ui/page-loader';
import { Toaster } from '~/components/ui/toaster';
import { DEFAULT_LOCALE } from '~/config/app.config';
import { siteConfigConst } from '~/lib/constant';
import { fonts } from '~/lib/fonts';
import { cn } from '~/lib/util.lib';
import { TRPCReactProvider } from '~/trpc/react';
import type { Locale } from '~/type/i18n.type';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfigConst.url),
  title: {
    default: siteConfigConst.title,
    template: `%s | ${siteConfigConst.title}`,
  },
  description: siteConfigConst.description,
  keywords: siteConfigConst.keywords,
  robots: { index: true, follow: true },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  verification: {
    google: siteConfigConst.googleSiteVerificationId,
  },
  openGraph: {
    url: siteConfigConst.url,
    title: siteConfigConst.title,
    description: siteConfigConst.description,
    siteName: siteConfigConst.title,
    images: '/og-image.jpeg',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfigConst.title,
    description: siteConfigConst.description,
    images: '/og-image.jpeg',
  },
};

const RootLayout: NextPage<PropsWithChildren> = async ({ children }) => {
  const cookieStore = cookies();
  const locale = cookieStore.get('i18next')?.value as Locale;

  return (
    <I18NClientProvider locale={locale ?? DEFAULT_LOCALE}>
      <body className={cn('min-h-screen font-sans', fonts)}>
        <CookiesProvider>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ReactQueryClientProvider>
                <UserProvider>
                  <AudioProvider>
                    <Suspense fallback={<PageLoader />}>
                      <div className="flex min-h-screen flex-col">
                        <Navbar />

                        <main className="container mx-auto grow">
                          <section className="my-5 flex flex-col items-center gap-3 text-center md:my-10">
                            {children}
                          </section>
                        </main>

                        <Footer />
                      </div>
                    </Suspense>
                    <Toaster />
                    <AudioContainer />
                  </AudioProvider>
                </UserProvider>
              </ReactQueryClientProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </CookiesProvider>
      </body>
    </I18NClientProvider>
  );
};

export default RootLayout;
