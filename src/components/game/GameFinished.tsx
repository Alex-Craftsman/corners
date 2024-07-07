import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAudio } from '@crfmn/use-audio';

import { useLocale } from '~/store/locale.store';
import { api } from '~/trpc/react';
import type { TGameWithPlayer } from '~/type/game.type';
import type { Nullable } from '~/type/helper.type';
import { GameState } from '~prisma';

const GameFinished = ({ game }: { game: TGameWithPlayer }) => {
  const isSoundPlayed = useRef<boolean>(false);

  const { t } = useTranslation();

  const { locale } = useLocale();

  const [finishedSoundUrl, finishedSoundUrlSet] =
    useState<Nullable<string>>(null);

  const { play: finishedSound, isInit } = useAudio(finishedSoundUrl);

  const { mutateAsync: getSpeech } = api.speech.getSpeech.useMutation({
    onSuccess: (data) => {
      finishedSoundUrlSet(data.fileUrl);
    },
    onError: (_) => {
      finishedSoundUrlSet(null);
    },
  });

  useEffect(() => {
    getSpeech({
      text: t(
        'spasibo-za-igru-nachat-novuyu-mozhno-s-glavnoi-stranicy-nazhav-na-krestik-ili-logotip-prilozheniya',
      ),
      locale,
    });
  }, [getSpeech, t, locale]);

  useEffect(() => {
    setTimeout(() => {
      if (
        game.state === GameState.FINISHED &&
        isInit &&
        !isSoundPlayed.current
      ) {
        isSoundPlayed.current = true;

        finishedSound();
      }
    }, 3000);
  }, [isInit, finishedSound, game.state]);

  return null;
};

export default GameFinished;
