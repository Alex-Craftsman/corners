import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAudio } from '@crfmn/use-audio';

import { socket } from '~/socket';
import { useLocale } from '~/store/locale.store';
import { api } from '~/trpc/react';
import type { TGameWithPlayer } from '~/type/game.type';
import type { Nullable } from '~/type/helper.type';
import { GameState } from '~prisma';

const GamePlayer = ({ game }: { game: TGameWithPlayer }) => {
  const [player1Name, player1NameSet] = useState<Nullable<string>>(null);
  const [player2Name, player2NameSet] = useState<Nullable<string>>(null);

  const { t } = useTranslation();
  const { locale } = useLocale();

  const [player1LeftSoundUrl, player1LeftSoundUrlSet] =
    useState<Nullable<string>>(null);
  const [player1JoinSoundUrl, player1JoinSoundUrlSet] =
    useState<Nullable<string>>(null);

  const [player2LeftSoundUrl, player2LeftSoundUrlSet] =
    useState<Nullable<string>>(null);
  const [player2JoinSoundUrl, player2JoinSoundUrlSet] =
    useState<Nullable<string>>(null);

  const { play: player1LeftSound } = useAudio(player1LeftSoundUrl);
  const { play: player1JoinSound } = useAudio(player1JoinSoundUrl);

  const { play: player2LeftSound } = useAudio(player2LeftSoundUrl);
  const { play: player2JoinSound } = useAudio(player2JoinSoundUrl);

  const { mutateAsync: getSpeechPlayer1Left } =
    api.speech.getSpeech.useMutation({});
  const { mutateAsync: getSpeechPlayer1Join } =
    api.speech.getSpeech.useMutation({});
  const { mutateAsync: getSpeechPlayer2Left } =
    api.speech.getSpeech.useMutation({});
  const { mutateAsync: getSpeechPlayer2Join } =
    api.speech.getSpeech.useMutation({});

  useEffect(() => {
    if (game.p1?.name !== player1Name) {
      player1NameSet(game.p1?.name ?? null);
    }
  }, [game.p1?.name, player1Name]);

  useEffect(() => {
    if (game.p2?.name !== player2Name) {
      player2NameSet(game.p2?.name ?? null);
    }
  }, [game.p2?.name, player2Name]);

  useEffect(() => {
    function onJoinRoom(room: { userId: string }) {
      if (room.userId === game.p1Id) {
        player1JoinSound();
      } else if (room.userId === game.p2Id) {
        player2JoinSound();
      }
    }

    function onLeaveRoom(room: { userId: string }) {
      if (room.userId === game.p1Id) {
        player1LeftSound();
      } else if (room.userId === game.p2Id) {
        player2LeftSound();
      }
    }

    if (socket.connected && game.state === GameState.ACTIVE) {
      socket.on('user-joined-room', onJoinRoom);

      socket.on('user-left-room', onLeaveRoom);
    }

    return () => {
      socket.off('user-joined-room', onJoinRoom);
      socket.off('user-left-room', onLeaveRoom);
    };
  }, [
    game.p1Id,
    game.p2Id,
    game.state,
    player1JoinSound,
    player1LeftSound,
    player2JoinSound,
    player2LeftSound,
  ]);

  useEffect(() => {
    if (player1Name) {
      getSpeechPlayer1Left({
        text: t('igrok-player-name-pokinul-igru', { playerName: player1Name }),
        locale,
      })
        .then((data) => {
          player1LeftSoundUrlSet(data.fileUrl);
        })
        .catch(() => {
          player1LeftSoundUrlSet(null);
        });
    } else {
      player1LeftSoundUrlSet(null);
    }
  }, [getSpeechPlayer1Left, player1Name, t, locale]);

  useEffect(() => {
    if (player1Name) {
      getSpeechPlayer1Join({
        text: t('igrok-player-name-prisoedinilsya-k-igre', {
          playerName: player1Name,
        }),
        locale,
      })
        .then((data) => {
          player1JoinSoundUrlSet(data.fileUrl);
        })
        .catch(() => {
          player1JoinSoundUrlSet(null);
        });
    } else {
      player1JoinSoundUrlSet(null);
    }
  }, [getSpeechPlayer1Join, player1Name, t, locale]);

  useEffect(() => {
    if (player2Name) {
      getSpeechPlayer2Left({
        text: t('igrok-player-name-pokinul-igru', { playerName: player2Name }),
        locale,
      })
        .then((data) => {
          player2LeftSoundUrlSet(data.fileUrl);
        })
        .catch(() => {
          player2LeftSoundUrlSet(null);
        });
    } else {
      player2LeftSoundUrlSet(null);
    }
  }, [getSpeechPlayer2Left, player2Name, t, locale]);

  useEffect(() => {
    if (player2Name) {
      getSpeechPlayer2Join({
        text: t('igrok-player-name-prisoedinilsya-k-igre', {
          playerName: player2Name,
        }),
        locale,
      })
        .then((data) => {
          player2JoinSoundUrlSet(data.fileUrl);
        })
        .catch(() => {
          player2JoinSoundUrlSet(null);
        });
    } else {
      player2JoinSoundUrlSet(null);
    }
  }, [getSpeechPlayer2Join, player2Name, t, locale]);

  return null;
};

export default GamePlayer;
