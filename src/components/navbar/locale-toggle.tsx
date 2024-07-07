'use client';

import { useAudio } from '@crfmn/use-audio';

import { Button } from '~/components/ui/button';
import { useLocale } from '~/store/locale.store';
import { LocaleEnum } from '~/type/i18n.type';

export const LocaleToggle = () => {
  const { play: playToggle } = useAudio('/s/theme-toggle.mp3');

  const { locale, localeSet } = useLocale();

  const handleThemeToggle = () => {
    playToggle();

    const newLocale = locale === LocaleEnum.ru ? LocaleEnum.en : LocaleEnum.ru;

    localeSet(newLocale);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="theme toggle"
      onClick={handleThemeToggle}
    >
      {locale.toUpperCase()}
    </Button>
  );
};
