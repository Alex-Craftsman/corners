'use client';

import { useTheme } from 'next-themes';

import { useAudio } from '@crfmn/use-audio';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

export const ThemeToggle = () => {
  const { play: playToggle } = useAudio('/s/theme-toggle.mp3');

  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    playToggle();

    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="theme toggle"
      onClick={handleThemeToggle}
    >
      <Icons.sun className="dark:hidden" />
      <Icons.moon className="hidden dark:block" />
    </Button>
  );
};
