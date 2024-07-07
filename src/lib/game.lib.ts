import { type GameFlavor, loserBoardConst, winnerBoardConst } from './constant';

import {
  maxMoveCountOverallAppConfig,
  maxMoveCountRemainingCheckersAppConfig,
} from '~/config/game.config';
import type {
  TAvailablePositionList,
  TBoard,
  TBoardHash,
} from '~/type/game.type';

function canJumpOverNeighbourChecker(
  currentBoard: TBoardHash,
  checkerIdSource: string,
  checkerIdTarget: string,
): string | null {
  const sourcePositionId = currentBoard[checkerIdSource]?.positionId;
  const targetPositionId = currentBoard[checkerIdTarget]?.positionId;

  const [_source, sourceRow, sourceCol] =
    sourcePositionId?.split('-').map((item) => +item) ?? [];
  const [_target, targetRow, targetCol] =
    targetPositionId?.split('-').map((item) => +item) ?? [];

  if (sourceRow === undefined || sourceCol === undefined) {
    return null;
  }

  if (targetRow === undefined || targetCol === undefined) {
    return null;
  }

  // check if target checker is next to the source checker by north, south, west or east
  if (
    sourceRow === targetRow &&
    (sourceCol === targetCol - 1 || sourceCol === targetCol + 1)
  ) {
    const targetColNext =
      sourceCol === targetCol - 1 ? targetCol + 1 : targetCol - 1;

    if (targetColNext < 0 || targetColNext >= 8) {
      return null;
    }

    // check if position next to the target checker by the same direction is empty
    const nextPositionId = `position-${targetRow}-${targetColNext}`;
    const isNextPositionTaken = Object.values(currentBoard).find(
      (item) => item.positionId === nextPositionId,
    );

    if (!isNextPositionTaken) {
      return nextPositionId;
    }
  }

  if (
    sourceCol === targetCol &&
    (sourceRow === targetRow - 1 || sourceRow === targetRow + 1)
  ) {
    const targetRowNext =
      sourceRow === targetRow - 1 ? targetRow + 1 : targetRow - 1;

    if (targetRowNext < 0 || targetRowNext >= 8) {
      return null;
    }

    // check if position next to the target checker by the same direction is empty
    const nextPositionId = `position-${targetRowNext}-${targetCol}`;
    const isNextPositionTaken = Object.values(currentBoard).find(
      (item) => item.positionId === nextPositionId,
    );

    if (!isNextPositionTaken) {
      return nextPositionId;
    }
  }

  return null;
}

function getNeighbourCheckers(
  currentBoard: TBoardHash,
  checkerId: string,
): string[] {
  const positionId = currentBoard[checkerId]?.positionId;

  const [_pos, row, col] = positionId?.split('-').map((item) => +item) ?? [];

  if (row === undefined || col === undefined) {
    return [];
  }

  const neighbourCheckers: string[] = [];

  // check nothern position
  if (row - 1 >= 0) {
    const northPosition = `position-${row - 1}-${col}`;

    // check if position is taken
    const isPositionTaken = Object.values(currentBoard).find(
      (item) => item.positionId === northPosition,
    );

    if (isPositionTaken) {
      neighbourCheckers.push(isPositionTaken.checkerId);
    }
  }

  // check southern position
  if (row + 1 < 8) {
    const southPosition = `position-${row + 1}-${col}`;

    // check if position is taken
    const isPositionTaken = Object.values(currentBoard).find(
      (item) => item.positionId === southPosition,
    );

    if (isPositionTaken) {
      neighbourCheckers.push(isPositionTaken.checkerId);
    }
  }

  // check western position
  if (col - 1 >= 0) {
    const westPosition = `position-${row}-${col - 1}`;

    // check if position is taken
    const isPositionTaken = Object.values(currentBoard).find(
      (item) => item.positionId === westPosition,
    );

    if (isPositionTaken) {
      neighbourCheckers.push(isPositionTaken.checkerId);
    }
  }

  // check eastern position
  if (col + 1 < 8) {
    const eastPosition = `position-${row}-${col + 1}`;

    // check if position is taken
    const isPositionTaken = Object.values(currentBoard).find(
      (item) => item.positionId === eastPosition,
    );

    if (isPositionTaken) {
      neighbourCheckers.push(isPositionTaken.checkerId);
    }
  }

  return neighbourCheckers;
}

function traverseBoard(
  currentBoard: TBoardHash,
  checkerId: string,
  currentPath: string[],
  collector: string[][],
): void {
  const checkerData = currentBoard[checkerId];

  if (!checkerData) {
    return;
  }

  const neighbourCheckers = getNeighbourCheckers(currentBoard, checkerId);

  const newPath = [...currentPath];

  newPath.push(checkerData.positionId ?? '');

  let isNextPositionFound = false;

  for (const neighbourCheckerId of neighbourCheckers) {
    const nextPositionId = canJumpOverNeighbourChecker(
      currentBoard,
      checkerId,
      neighbourCheckerId,
    );

    if (nextPositionId && !currentPath.includes(nextPositionId)) {
      const newBoard = {
        ...currentBoard,
        [checkerId]: {
          ...checkerData,
          positionId: nextPositionId,
        },
      };

      isNextPositionFound = true;

      traverseBoard(newBoard, checkerId, newPath, collector);
    }
  }

  if (!isNextPositionFound) {
    if (newPath.length > 1) {
      collector.push(newPath);
    }
  }
}

export function calculateAvailablePositions(
  currentBoard: TBoardHash,
  checkerId: string,
): TAvailablePositionList {
  const availablePositions: TAvailablePositionList = [];

  const checkerData = currentBoard[checkerId];

  if (!checkerData) {
    return availablePositions;
  }

  const positionId = checkerData.positionId;

  const [_pos, row, col] = positionId.split('-').map((item) => +item);

  if (row === undefined || col === undefined) {
    return availablePositions;
  }

  traverseBoard(currentBoard, checkerId, [], availablePositions);

  // check nothern position
  if (row - 1 >= 0) {
    const northPosition = `position-${row - 1}-${col}`;

    // check if position is taken
    const isPositionTaken = Object.values(currentBoard).find(
      (item) => item.positionId === northPosition,
    );

    if (!isPositionTaken) {
      availablePositions.push([positionId, northPosition]);
    }
  }

  // check southern position
  if (row + 1 < 8) {
    const southPosition = `position-${row + 1}-${col}`;

    // check if position is taken
    const isPositionTaken = Object.values(currentBoard).find(
      (item) => item.positionId === southPosition,
    );

    if (!isPositionTaken) {
      availablePositions.push([positionId, southPosition]);
    }
  }

  // check western position
  if (col - 1 >= 0) {
    const westPosition = `position-${row}-${col - 1}`;

    // check if position is taken
    const isPositionTaken = Object.values(currentBoard).find(
      (item) => item.positionId === westPosition,
    );

    if (!isPositionTaken) {
      availablePositions.push([positionId, westPosition]);
    }
  }

  // check eastern position
  if (col + 1 < 8) {
    const eastPosition = `position-${row}-${col + 1}`;

    // check if position is taken
    const isPositionTaken = Object.values(currentBoard).find(
      (item) => item.positionId === eastPosition,
    );

    if (!isPositionTaken) {
      availablePositions.push([positionId, eastPosition]);
    }
  }

  return availablePositions;
}

export function checkWinner(
  board: TBoard,
  movesCount: number,
  flavor: GameFlavor,
): 'p1' | 'p2' | null | false {
  if (movesCount % 2 !== 0) {
    return false;
  }

  let isDraw = false;
  let isP1Winner = false;
  let isP2Winner = false;

  let p1Count = 0;
  let p2Count = 0;

  // https://dev.to/samanthaming/how-to-deep-clone-an-array-in-javascript-3cig
  const winnerBoard = JSON.parse(
    JSON.stringify(winnerBoardConst[flavor]),
  ) as TBoard;

  for (let row = 0; row < board.length; row++) {
    const rowData = board[row] ?? [];

    for (let col = 0; col < rowData.length; col++) {
      if (!rowData[col]) {
        continue;
      }

      const [_checker, player, _id] = rowData[col]?.split('-') ?? [];

      if (winnerBoard[row]?.[col] === player) {
        const winnerBoardRow = winnerBoard[row] ?? [];

        winnerBoardRow[col] = '';

        if (player === 'p1') {
          p1Count++;
        }

        if (player === 'p2') {
          p2Count++;
        }
      }
    }
  }

  const flatBoard = winnerBoard.flat();

  if (!flatBoard.some((i) => i === 'p1')) {
    isP1Winner = true;
  }

  if (!flatBoard.some((i) => i === 'p2')) {
    isP2Winner = true;
  }

  if (isP1Winner && isP2Winner) {
    isDraw = true;
  }

  if (isDraw) {
    return null;
  }

  if (isP1Winner) {
    return 'p1';
  }

  if (isP2Winner) {
    return 'p2';
  }

  if (movesCount >= maxMoveCountOverallAppConfig) {
    if (p1Count > p2Count) {
      return 'p1';
    }

    if (p2Count > p1Count) {
      return 'p2';
    }

    return null;
  }

  return false;
}

export function checkLoser(
  board: TBoard,
  movesCount: number,
  flavor: GameFlavor,
): 'p1' | 'p2' | null | false {
  if (movesCount < maxMoveCountRemainingCheckersAppConfig) {
    return false;
  }

  let p1Count = 0;
  let p2Count = 0;

  // https://dev.to/samanthaming/how-to-deep-clone-an-array-in-javascript-3cig
  const loserBoard = JSON.parse(
    JSON.stringify(loserBoardConst[flavor]),
  ) as TBoard;

  for (let row = 0; row < board.length; row++) {
    const rowData = board[row] ?? [];

    for (let col = 0; col < rowData.length; col++) {
      if (!rowData[col]) {
        continue;
      }

      const [_checker, player, _id] = rowData[col]?.split('-') ?? [];

      if (loserBoard[row]?.[col] === player) {
        const loserBoardRow = loserBoard[row] ?? [];

        loserBoardRow[col] = '';

        if (player === 'p1') {
          p1Count++;
        }

        if (player === 'p2') {
          p2Count++;
        }
      }
    }
  }

  if (p1Count > 0 && p2Count > 0) {
    return null;
  }

  if (p1Count > 0) {
    return 'p2'; // Reverse the winner
  }

  if (p2Count > 0) {
    return 'p1'; // Reverse the winner
  }

  return false;
}
