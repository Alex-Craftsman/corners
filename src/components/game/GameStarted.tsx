import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAudio } from '@crfmn/use-audio';

import { useLocale } from '~/store/locale.store';
import { api } from '~/trpc/react';
import type { TGameWithPlayer } from '~/type/game.type';
import type { Nullable } from '~/type/helper.type';

const GameStarted = ({
  game,
  moveCount,
}: {
  game: TGameWithPlayer;
  moveCount: number;
}) => {
  const { t } = useTranslation();

  const { locale } = useLocale();

  const player1Name = game.p1?.name || 'Аноним';
  const player2Name = game.p1?.name || 'Аноним';

  const playerName = game.turn === 'p1' ? player1Name : player2Name;

  const isSoundPlayed = useRef<boolean>(false);

  const [startedSoundUrl, startedSoundUrlSet] =
    useState<Nullable<string>>(null);

  const { play: startedSound, isInit } = useAudio(startedSoundUrl);

  const { mutateAsync: getSpeech } = api.speech.getSpeech.useMutation({
    onSuccess: (data) => {
      startedSoundUrlSet(data.fileUrl);
    },
    onError: (_) => {
      startedSoundUrlSet(null);
    },
  });

  useEffect(() => {
    getSpeech({
      text: t('igra-nachalas-pervym-khodit-playername', { playerName }),
      locale: locale,
    });
  }, [getSpeech, playerName, t, locale]);

  useEffect(() => {
    setTimeout(() => {
      if (moveCount <= 1 && isInit && !isSoundPlayed.current) {
        isSoundPlayed.current = true;

        startedSound();
      }
    }, 1000);
  }, [isInit, startedSound, moveCount]);

  return null;
};

export default GameStarted;
