import type { AsyncReturnType } from 'type-fest';

import type { api } from '~/trpc/server';

export type TBoard = string[][];

export type TBoardHash = Record<
  string,
  {
    positionId: string;
    checkerId: string;
    player: 'p1' | 'p2';
    row: number;
    col: number;
  }
>;

export type TBoardState =
  | 'loading'
  | 'fetching'
  | 'pending-move'
  | 'start-drag'
  | 'end-drag'
  | 'start-transition'
  | 'end-transition'
  | 'switch-turn';

export type TGameInfo = AsyncReturnType<typeof api.game.getGameInfo>;

export type TAvailablePositionList = string[][];

export type TMovingState = Record<
  string,
  {
    checkerId: string;
    x: number[];
    y: number[];
  }
>;

export type TGameWithPlayer = TGameInfo['game'];
