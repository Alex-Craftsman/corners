'use client';

import { type FC, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAudio } from '@crfmn/use-audio';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';

import GameBoard from './GameBoard';
import GameCount from './GameCount';
import GameFinished from './GameFinished';
import GamePlayer from './GamePlayer';
import GameStarted from './GameStarted';
import GameWaiting from './GameWaiting';

import PageLoader from '~/components/ui/page-loader';
import { useToast } from '~/components/ui/use-toast';
import { calculateAvailablePositions } from '~/lib/game.lib';
import { socket } from '~/socket';
import { useLocale } from '~/store/locale.store';
import { api } from '~/trpc/react';
import type {
  TAvailablePositionList,
  TBoardHash,
  TBoardState,
  TMovingState,
} from '~/type/game.type';
import type { Nullable } from '~/type/helper.type';
import { type Game, GameState, type User } from '~prisma';

const GameInner: FC<{
  game: Game;
  user: User;
}> = ({ game: initialGame, user }) => {
  const { toast } = useToast();

  const { t } = useTranslation();

  const { locale } = useLocale();

  const { play: playClap } = useAudio('/s/clap.mp3');

  const [moveCancelSound, moveCancelSoundSet] = useState<string>('/s/clap.mp3');

  const [player1TurnSound, player1TurnSoundSet] =
    useState<Nullable<string>>(null);

  const [player2TurnSound, player2TurnSoundSet] =
    useState<Nullable<string>>(null);

  const { play: playMoveCancelSound } = useAudio(moveCancelSound);
  const { play: play1TurnSound } = useAudio(player1TurnSound);
  const { play: play2TurnSound } = useAudio(player2TurnSound);

  const [availablePositions, setAvailablePositions] =
    useState<TAvailablePositionList>([]);

  const [droppablePositions, setDroppablePositions] = useState<string[]>([]);

  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [highlightedHint, setHighlightedHint] = useState<string[]>([]);

  const [draggableCheckers, setDraggableCheckers] = useState<string[]>([]);

  const [boardState, setBoardState] = useState<TBoardState>('loading');

  const [boardHashUI, setBoardHashUI] = useState<TBoardHash>({});

  const [movingState, setMovingState] = useState<TMovingState>({});

  const { data: gameInfo, isLoading } = api.game.getGameInfo.useQuery(
    { gameId: initialGame.id },
    {
      refetchInterval: 2000,
      retry: 1,
    },
  );

  const { mutateAsync: getSpeech } = api.speech.getSpeech.useMutation({});

  const createMove = api.move.create.useMutation({
    onSuccess: () => {
      setBoardState('fetching');

      if (gameInfo?.game.p1Id === user.id) {
        play2TurnSound();
      } else {
        play1TurnSound();
      }

      toast({ description: t('sdelan-khod') });
    },
    onError: () => {
      setBoardState('pending-move');

      toast({ description: t('oshibka-khoda') });
    },
  });

  const requestMoveCancellation = api.game.requestMoveCancellation.useMutation({
    onSuccess: () => {
      toast({ description: t('zaproshena-otmena-khoda') });
    },
    onError: () => {
      toast({ description: t('oshibka-zaprosa-otmeny-khoda') });
    },
  });

  const cancelMoveConfirm = api.game.cancelMoveConfirmation.useMutation({
    onSuccess: () => {
      toast({ description: t('otmena-khoda-zavershena') });

      setBoardState('pending-move');
    },
    onError: () => {
      toast({ description: t('oshibka-podtverzhdeniya-otmeny-khoda') });
    },
  });

  useEffect(() => {
    getSpeech({
      text: t('net'),
      locale,
    }).then((res) => {
      moveCancelSoundSet(res.fileUrl);
    });
  }, [getSpeech, t, locale]);

  useEffect(() => {
    const promisePlayer1 = gameInfo?.game.p1?.name
      ? getSpeech({
          text: t('khodit-player-name', { playerName: gameInfo.game.p1.name }),
          locale,
        })
      : getSpeech({
          text: t('khodit-pervyi-igrok'),
          locale,
        });

    const promisePlayer2 = gameInfo?.game.p2?.name
      ? getSpeech({
          text: t('khodit-player-name', { playerName: gameInfo.game.p2.name }),
          locale,
        })
      : getSpeech({
          text: t('khodit-vtoroi-igrok'),
          locale,
        });

    promisePlayer1
      .then((res) => {
        player1TurnSoundSet(res.fileUrl);
      })
      .catch(() => {
        player1TurnSoundSet(null);
      });

    promisePlayer2
      .then((res) => {
        player2TurnSoundSet(res.fileUrl);
      })
      .catch(() => {
        player2TurnSoundSet(null);
      });
  }, [gameInfo?.game, getSpeech, t, locale]);

  useEffect(() => {
    if (!gameInfo?.game.turn) {
      return;
    }

    if (
      (gameInfo.game.turn === 'p1' && gameInfo.game.p1Id === user.id) ||
      (gameInfo.game.turn === 'p2' && gameInfo.game.p2Id === user.id)
    ) {
      setBoardState((prev) => {
        if (prev === 'loading' || prev === 'fetching') {
          return 'pending-move';
        }

        return prev;
      });
    } else {
      setBoardState((prev) => {
        if (prev === 'loading' || prev === 'fetching') {
          return 'pending-move';
        }

        return prev;
      });
    }
  }, [gameInfo?.game.turn, gameInfo?.game.p1Id, gameInfo?.game.p2Id, user.id]);

  useEffect(() => {
    if (!gameInfo) {
      return;
    }

    if (gameInfo.game.state !== 'ACTIVE') {
      setDraggableCheckers([]);

      return;
    }

    if (boardState === 'pending-move') {
      setDraggableCheckers(
        Object.values(gameInfo.boardHash)
          .filter((item) => item.player === gameInfo.game.turn)
          .map((item) => item.checkerId),
      );
    } else {
      setDraggableCheckers([]);
    }
  }, [boardState, gameInfo, user.id]);

  useEffect(() => {
    setDroppablePositions(availablePositions.flat());
  }, [availablePositions]);

  useEffect(() => {
    if (boardState !== 'start-drag') {
      setAvailablePositions([]);
    }
  }, [boardState]);

  useEffect(() => {
    if (!gameInfo) {
      return;
    }

    if (!['loading', 'pending-move'].includes(boardState)) {
      return;
    }

    const newMovingState: TMovingState = {};

    Object.values(gameInfo.boardHash).forEach((item) => {
      if (!boardHashUI[item.checkerId]) {
        return;
      }

      const { checkerId, positionId } = item;
      const { positionId: currentPositionId } = boardHashUI[checkerId] ?? {
        positionId: null,
      };

      if (!currentPositionId) {
        return;
      }

      if (currentPositionId === positionId) {
        return;
      }

      const availablePositions =
        calculateAvailablePositions(boardHashUI, checkerId) ?? [];

      let possiblePath: string[] | null = null;

      for (let i = 0; i < availablePositions.length; i++) {
        if (
          availablePositions[i] &&
          Array.isArray(availablePositions[i]) &&
          availablePositions[i]?.includes(positionId)
        ) {
          possiblePath = availablePositions[i] ?? null;

          break;
        }
      }

      if (possiblePath) {
        // slice the path to the current position
        const currentIndex = possiblePath.lastIndexOf(positionId);

        possiblePath = possiblePath.slice(0, currentIndex + 1);
      } else {
        possiblePath = [currentPositionId, positionId];
      }

      const x: number[] = [];
      const y: number[] = [];

      for (let i = 1; i < possiblePath.length; i++) {
        const intermediatePositionId = possiblePath[i];

        // get DOM coordinates of the new position by class name "cell-${positionId}"
        const rectPosition = document
          .querySelector(`.${intermediatePositionId}`)
          ?.getBoundingClientRect();

        // get DOM coordinates of the current position by class name "cell-${currentPositionId}"
        const rectCurrentPosition = document
          .querySelector(`.${currentPositionId}`)
          ?.getBoundingClientRect();

        if (!rectPosition || !rectCurrentPosition) {
          return;
        }

        const x1 = rectPosition.x - rectCurrentPosition.x;
        const y1 = rectPosition.y - rectCurrentPosition.y;

        x.push(x1);
        y.push(y1);
      }

      if (x.length > 0 && y.length > 0) {
        newMovingState[checkerId] = {
          checkerId,
          x,
          y,
        };
      }
    });

    if (Object.keys(newMovingState).length > 0) {
      setBoardState('start-transition');

      setMovingState(newMovingState);
    } else {
      setBoardHashUI(gameInfo.boardHash);
    }
  }, [boardHashUI, boardState, gameInfo]);

  useEffect(() => {
    function onShowHint(hint: {
      savedHintPath: string[];
      gameId: string;
      userId: string;
      checkerId: string;
      positionId: string;
      currentPositionId: string;
    }) {
      setHighlightedHint(hint.savedHintPath);
    }

    if (socket.connected && gameInfo?.game.state === GameState.ACTIVE) {
      socket.on('show-hint', onShowHint);
    }

    return () => {
      socket.off('show-hint', onShowHint);
    };
  }, [gameInfo?.game.state]);

  function handleDragCancel() {
    playMoveCancelSound();

    setBoardState('pending-move');
  }

  function handleDragStart(event: DragStartEvent) {
    setBoardState('start-drag');

    setHighlightedHint([]);

    const checkerId = event.active.id;

    if (gameInfo?.boardHash) {
      const availablePositions = calculateAvailablePositions(
        gameInfo.boardHash,
        checkerId.toString(),
      );

      setAvailablePositions(availablePositions);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    const checkerId = active.id.toString() ?? null;
    const positionId = over ? over.id.toString() : null;

    const savedHintPath = highlightedPath;

    setHighlightedPath([]);

    if (
      !positionId ||
      !gameInfo?.boardHash ||
      !gameInfo?.boardHash[checkerId]
    ) {
      playMoveCancelSound();

      setBoardState('pending-move');
      return;
    }

    const currentPositionId =
      gameInfo?.boardHash[checkerId]?.positionId.toString() ?? null;

    if (currentPositionId === positionId) {
      setBoardState('pending-move');

      return;
    }

    if (
      (gameInfo.game.turn === 'p1' && gameInfo.game.p1Id === user.id) ||
      (gameInfo.game.turn === 'p2' && gameInfo.game.p2Id === user.id)
    ) {
      setBoardHashUI((prev) => {
        const [_position, row, col] = positionId.split('-').map(Number);

        if (!checkerId) {
          return prev;
        }

        return {
          ...prev,
          [checkerId]: {
            checkerId,
            positionId,
            player: prev[checkerId]?.player ?? 'p1',
            row: row ?? 0,
            col: col ?? 0,
          },
        };
      });

      setBoardState('end-drag');

      if (currentPositionId) {
        playClap();

        handleGameMove(checkerId.toString(), currentPositionId, positionId);
      }
    } else {
      socket.emit('send-hint', {
        savedHintPath,
        gameId: gameInfo.game.id,
        userId: user.id,
        checkerId,
        positionId,
        currentPositionId,
      });

      setBoardState('pending-move');

      return;
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const positionId = event.over?.id;

    if (!positionId) {
      setHighlightedPath([]);

      return;
    }

    const availablePath = availablePositions.find((path) =>
      path.includes(positionId.toString()),
    );

    if (!availablePath) {
      setHighlightedPath([]);

      return;
    }

    const pathSegment = availablePath.slice(
      0,
      availablePath.indexOf(positionId.toString()) + 1,
    );

    const fullPath: string[] = [];

    for (let i = 0; i < pathSegment.length; i++) {
      const currentPositionId = pathSegment[i];

      if (!currentPositionId) {
        continue;
      }

      fullPath.push(currentPositionId);

      if (i > 0) {
        const previousPositionId = pathSegment[i - 1];

        if (!previousPositionId) {
          continue;
        }

        const [_1, currentRow, currentCol] = currentPositionId
          .split('-')
          .map(Number);
        const [_2, rowPrev, colPrev] = previousPositionId
          .split('-')
          .map(Number);

        if (
          currentRow === undefined ||
          currentCol === undefined ||
          rowPrev === undefined ||
          colPrev === undefined
        ) {
          continue;
        }

        if (currentRow === rowPrev) {
          if (currentCol > colPrev) {
            fullPath.push(`position-${currentRow}-${currentCol - 1}`);
          } else {
            fullPath.push(`position-${currentRow}-${currentCol + 1}`);
          }
        }

        if (currentCol === colPrev) {
          if (currentRow > rowPrev) {
            fullPath.push(`position-${currentRow - 1}-${currentCol}`);
          } else {
            fullPath.push(`position-${currentRow + 1}-${currentCol}`);
          }
        }
      }
    }

    setHighlightedPath(fullPath);
  }

  function handleAnimationComplete() {
    if (!gameInfo) {
      return;
    }

    setBoardState('end-transition');

    setMovingState({});
    setBoardHashUI(gameInfo.boardHash);

    if (
      (gameInfo.game.turn === 'p1' && gameInfo.game.p1Id === user.id) ||
      (gameInfo.game.turn === 'p2' && gameInfo.game.p2Id === user.id)
    ) {
      setBoardState('pending-move');

      if (gameInfo?.game.p1Id === user.id) {
        play1TurnSound();
      } else {
        play2TurnSound();
      }
    } else {
      setBoardState('pending-move');

      if (gameInfo?.game.p1Id === user.id) {
        play2TurnSound();
      } else {
        play1TurnSound();
      }
    }
  }

  const handleGameMove = async (
    checkerId: string,
    positionIdFrom: string,
    positionIdTo: string,
  ) => {
    setBoardState('switch-turn');

    createMove.mutate({
      gameId: gameInfo?.game.id ?? '',
      checkerId,
      positionIdFrom,
      positionIdTo,
    });
  };

  const handleCancelRequest =
    (gameInfo?.movesCount ?? 0) > 1 &&
    (gameInfo?.game.p1Id === user.id || gameInfo?.game.p2Id === user.id) &&
    !gameInfo?.game.p1CancelRequest &&
    !gameInfo?.game.p2CancelRequest
      ? async () => {
          if (!gameInfo) {
            return;
          }

          requestMoveCancellation.mutate({
            gameId: gameInfo?.game.id ?? '',
          });
        }
      : null;

  const handleCancelConfirm =
    (gameInfo?.movesCount ?? 0) > 1 &&
    ((gameInfo?.game.p1Id === user.id && gameInfo?.game.p2CancelRequest) ||
      (gameInfo?.game.p2Id === user.id && gameInfo?.game.p1CancelRequest))
      ? async () => {
          if (!gameInfo) {
            return;
          }

          cancelMoveConfirm.mutate({
            gameId: gameInfo?.game.id ?? '',
          });
        }
      : null;

  if (boardState === 'loading' || isLoading) {
    return <PageLoader />;
  }

  if (!gameInfo?.game.p1Id || !gameInfo?.game.p2Id) {
    return <GameWaiting />;
  }

  return (
    <Fragment>
      <GameCount moveCount={gameInfo.movesCount} />
      <GameStarted game={gameInfo.game} moveCount={gameInfo.movesCount} />
      <GameFinished game={gameInfo.game} />
      <GamePlayer game={gameInfo.game} />
      <GameBoard
        droppablePositions={droppablePositions}
        highlightedPath={highlightedPath}
        highlightedHint={highlightedHint}
        game={gameInfo.game}
        boardHash={boardHashUI}
        draggableCheckers={draggableCheckers}
        handleAnimationComplete={handleAnimationComplete}
        handleDragEnd={handleDragEnd}
        handleDragStart={handleDragStart}
        handleDragCancel={handleDragCancel}
        handleDragOver={handleDragOver}
        movingState={movingState}
        handleCancelRequest={handleCancelRequest}
        handleCancelConfirm={handleCancelConfirm}
        reversedBoard={gameInfo.game.p1Id === user.id}
        movesCount={gameInfo.movesCount}
        t={t}
        locale={locale}
      />
    </Fragment>
  );
};

export default GameInner;
