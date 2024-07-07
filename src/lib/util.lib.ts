import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { isRouteLeaf } from './guard.lib';

import type { TBoard, TBoardHash } from '~/type/game.type';
import type { Nullable } from '~/type/helper.type';
import type { RouteLeaf, RouteProtectedObject } from '~/type/route.type';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function convertEnumToArray<T>(enumObj: { [s: string]: T }): T[] {
  return Object.keys(enumObj).map((key) => enumObj[key] as T);
}

export function extractRoutes(routes: RouteProtectedObject): string[] {
  const result: string[] = [];

  // Iterate over the keys of the object
  for (const key in routes) {
    if (isRouteLeaf(routes[key as keyof RouteProtectedObject])) {
      const leaf: RouteLeaf = routes[
        key as keyof RouteProtectedObject
      ] as RouteLeaf;

      for (const subKey in leaf) {
        result.push(leaf[subKey] as string);
      }
    } else {
      result.push(routes[key as keyof RouteProtectedObject] as string);
    }
  }

  return result;
}

export function numberCommasSeparator(value?: Nullable<number>): string {
  return value ? Intl.NumberFormat('en-EN').format(value) : '';
}

export function formatPhoneNumber(inputNumber: number): string {
  const numStr = inputNumber.toString();
  const countryCode = numStr.substring(0, 1);
  const areaCode = numStr.substring(1, 4);
  const part1 = numStr.substring(4, 7);
  const part2 = numStr.substring(7, 9);
  const part3 = numStr.substring(9, 11);

  return `+${countryCode} (${areaCode}) ${part1}-${part2}-${part3}`;
}

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const isBrowser = typeof window !== 'undefined';

export const boardToHash = (board: TBoard): TBoardHash => {
  const boardHash: TBoardHash = {};

  for (let row = 0; row < board.length; row++) {
    const boardRow = board[row];

    if (!boardRow) {
      continue;
    }

    for (let col = 0; col < boardRow.length; col++) {
      const positionId = `position-${row}-${col}`;
      const checkerId = boardRow[col]; // checker-pX-N

      if (checkerId) {
        const [_checker, player, _n] = checkerId.split('-');

        boardHash[checkerId] = {
          positionId,
          checkerId,
          player: player as 'p1' | 'p2',
          row,
          col,
        };
      }
    }
  }

  return boardHash;
};
