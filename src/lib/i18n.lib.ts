import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import { LocaleEnum } from '~/type/i18n.type';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: LocaleEnum.ru,
    detection: {
      order: [
        'cookie',
        'localStorage',
        'navigator',
        'querystring',
        'path',
        'subdomain',
      ],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/l/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: true,
    },
  });

export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
};

export default i18n;
