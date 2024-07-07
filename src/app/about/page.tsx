'use client';

import { useTranslation } from 'react-i18next';
import type { NextPage } from 'next';

import type { Locale } from '~/type/i18n.type';

const AboutPage: NextPage<{
  searchParams: { locale: Locale };
}> = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 text-justify md:w-3/4">
      <h1 className="mb-5 scroll-m-20 text-4xl tracking-tight lg:text-5xl">
        {t('pravila-igry-v-ugolki')}
      </h1>
      <p>{t('about-1')}</p>
      <p>{t('about-2')}</p>

      <p>{t('about-3')}</p>
      <p>{t('about-4')}</p>

      <p>{t('about-5')}</p>

      <p>{t('about-6')}</p>
    </div>
  );
};

export default AboutPage;
