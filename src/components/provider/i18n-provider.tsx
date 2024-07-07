'use client';

import type { FC, PropsWithChildren } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '~/lib/i18n.lib';
import type { Locale } from '~/type/i18n.type';

export const I18NClientProvider: FC<
  PropsWithChildren & {
    locale: Locale;
  }
> = ({ children, locale }) => {
  i18n.changeLanguage(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </html>
  );
};
