import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAudio } from '@crfmn/use-audio';

import {
  maxMoveCountOverallAppConfig,
  remainingMoveCountAppConfig,
} from '~/config/game.config';
import { useLocale } from '~/store/locale.store';
import { api } from '~/trpc/react';
import type { Nullable } from '~/type/helper.type';

const GameCount = ({ moveCount }: { moveCount: number }) => {
  const remainingMoveCount = maxMoveCountOverallAppConfig - moveCount;

  const isSoundPlayed = useRef<boolean>(false);

  const { t } = useTranslation();
  const { locale } = useLocale();

  const [countSoundUrl, countSoundUrlSet] = useState<Nullable<string>>(null);

  const { play: countSound, isInit } = useAudio(countSoundUrl);

  const { mutateAsync: getSpeech } = api.speech.getSpeech.useMutation({
    onSuccess: (data) => {
      countSoundUrlSet(data.fileUrl);
    },
    onError: (_) => {
      countSoundUrlSet(null);
    },
  });

  useEffect(() => {
    getSpeech({
      text: t('ostalos-x-khodov', {
        remainingMoveCount: remainingMoveCountAppConfig,
      }),
      locale,
    });
  }, [getSpeech, locale, t]);

  useEffect(() => {
    setTimeout(() => {
      if (
        remainingMoveCount === remainingMoveCountAppConfig &&
        isInit &&
        !isSoundPlayed.current
      ) {
        isSoundPlayed.current = true;

        countSound();
      }
    }, 2000);
  }, [isInit, countSound, remainingMoveCount]);

  return null;
};

export default GameCount;
