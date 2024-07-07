import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { useAudio } from '@crfmn/use-audio';

import { useLocale } from '~/store/locale.store';
import { api } from '~/trpc/react';
import type { TGameWithPlayer } from '~/type/game.type';
import type { Nullable } from '~/type/helper.type';

const GameWinner = ({ game }: { game: TGameWithPlayer }) => {
  const { t } = useTranslation();

  const { locale } = useLocale();

  const winnerName = game.winner?.name || t('anonim');

  const isSoundPlayed = useRef<boolean>(false);

  const [winnerSoundUrl, winnerSoundUrlSet] = useState<Nullable<string>>(null);

  const { play: winnerSound, isInit } = useAudio(winnerSoundUrl);

  const { mutateAsync: getSpeech } = api.speech.getSpeech.useMutation({
    onSuccess: (data) => {
      winnerSoundUrlSet(data.fileUrl);
    },
    onError: (_) => {
      winnerSoundUrlSet(null);
    },
  });

  useEffect(() => {
    getSpeech({
      text: winnerName
        ? t('pobeditel-is-winner-name', { winnerName })
        : t('nichya'),
      locale,
    });
  }, [getSpeech, winnerName, locale, t]);

  useEffect(() => {
    setTimeout(() => {
      if (isInit && !isSoundPlayed.current) {
        isSoundPlayed.current = true;

        winnerSound();
      }
    }, 1000);
  }, [isInit, winnerSound]);

  const text = game.winner
    ? (`🥳✌🏼 ` + t('pobeditel') + ` ${winnerName}! 🎉`).split(' ')
    : (`🥳✌🏼 ` + t('nichya') + ` 🎉`).split(' ');

  return (
    <span className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {text.map((el, i) => (
        <motion.span
          key={'work-' + i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2,
            delay: i,
          }}
        >
          {el}{' '}
        </motion.span>
      ))}
    </span>
  );
};

export default GameWinner;
