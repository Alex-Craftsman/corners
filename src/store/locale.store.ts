import Cookies from 'js-cookie';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { changeLanguage } from '~/lib/i18n.lib';
import { type Locale, LocaleEnum } from '~/type/i18n.type';

export const useLocale = create<{
  locale: Locale;
  localeSet: (locale: Locale) => void;
}>()(
  persist(
    (set) => ({
      locale: LocaleEnum.ru,
      localeSet: (locale: Locale) => {
        changeLanguage(locale);

        Cookies.set('i18next', locale);

        set({ locale });
      },
    }),
    {
      name: 'user-locale', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
