import type { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { TFunction } from 'i18next';
import { Circle, Undo2, XIcon } from 'lucide-react';

import {
  DndContext,
  type DragCancelEvent,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import GameWinner from './GameWinner';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { maxMoveCountOverallAppConfig } from '~/config/game.config';
import {
  colCountConst,
  colLabelConst,
  rowCountConst,
  rowLabelConst,
} from '~/lib/constant';
import { latinize } from '~/lib/latinize.lib';
import { cn } from '~/lib/util.lib';
import type {
  TBoardHash,
  TGameWithPlayer,
  TMovingState,
} from '~/type/game.type';
import type { Nullable } from '~/type/helper.type';
import { type Locale, LocaleEnum } from '~/type/i18n.type';

const GameBoard: FC<{
  game: TGameWithPlayer;
  boardHash: TBoardHash;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragCancel: (event: DragCancelEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleCancelRequest: Nullable<() => void>;
  handleCancelConfirm: Nullable<() => void>;
  movingState: TMovingState;
  handleAnimationComplete: () => void;
  droppablePositions: string[];
  draggableCheckers: string[];
  highlightedPath: string[];
  highlightedHint: string[];
  reversedBoard: boolean;
  movesCount: number;
  t: TFunction;
  locale: Locale;
}> = ({
  game,
  boardHash,
  handleDragEnd,
  handleDragStart,
  handleDragCancel,
  handleDragOver,
  handleCancelRequest,
  handleCancelConfirm,
  movingState,
  handleAnimationComplete,
  droppablePositions,
  draggableCheckers,
  highlightedPath,
  highlightedHint,
  reversedBoard,
  movesCount,
  t,
  locale,
}) => {
  const playerName =
    game.turn === 'p1'
      ? game.p1?.name || t('anonim')
      : game.p2?.name || t('anonim');

  const playerNameLocalized =
    locale === LocaleEnum.en ? latinize(playerName) : playerName;

  return (
    <>
      <h1 className="flex w-full scroll-m-20 items-center justify-between gap-3 text-base font-extrabold tracking-tight md:text-4xl lg:text-5xl">
        <span className="invisible">
          <XIcon className="size-8 sm:size-12 md:size-16" />
        </span>
        {game.state === 'FINISHED' ? (
          <GameWinner game={game} />
        ) : (
          <>
            {t('khodit')} {playerNameLocalized}, {movesCount.toString()} •{' '}
            {maxMoveCountOverallAppConfig.toString()}
          </>
        )}
        <div className="flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Undo2
                  className={cn(
                    'size-8 sm:size-12 md:size-16',
                    handleCancelConfirm || handleCancelRequest
                      ? 'cursor-pointer hover:opacity-70'
                      : 'cursor-not-allowed opacity-50',
                    handleCancelConfirm && 'text-rose-600',
                  )}
                  onClick={
                    handleCancelConfirm || handleCancelRequest || (() => {})
                  }
                />
              </TooltipTrigger>
              <TooltipContent>{t('otmenit-poslednii-khod')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Link href="/">
            <XIcon className="size-8 sm:size-12 md:size-16" />
          </Link>
        </div>
      </h1>
      <div className="relative flex items-center justify-center">
        <div>
          <div className="flex justify-center">
            {/* Column labels */}
            {[
              '',
              ...(reversedBoard
                ? colLabelConst.slice(0).reverse()
                : colLabelConst),
              '',
            ].map((col, index) => (
              <div
                key={index}
                className="flex size-9 items-center justify-center text-3xl font-thin sm:size-16 md:size-20 md:text-5xl"
              >
                {col}
              </div>
            ))}
          </div>
          <div className="flex">
            <div>
              {/* Row labels */}
              {Array.from({ length: rowCountConst }).map((_, index) => (
                <div
                  key={index}
                  className="flex size-9 items-center justify-center text-3xl font-thin sm:size-16 md:size-20 md:text-5xl"
                >
                  {
                    rowLabelConst[
                      reversedBoard ? rowCountConst - index - 1 : index
                    ]
                  }
                </div>
              ))}
            </div>
            <DndContext
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              onDragCancel={handleDragCancel}
              onDragOver={handleDragOver}
            >
              <div>
                {Array.from({ length: rowCountConst }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {Array.from({
                      length: colCountConst ?? 0,
                    }).map((_, colIndex) => {
                      const reversedOrNotRowIndex = reversedBoard
                        ? rowCountConst - rowIndex - 1
                        : rowIndex;
                      const reversedOrNotColIndex = reversedBoard
                        ? colCountConst - colIndex - 1
                        : colIndex;

                      const positionId = `position-${reversedOrNotRowIndex}-${reversedOrNotColIndex}`;

                      // find in the board
                      const checker = Object.values(boardHash).find(
                        (item) => item.positionId === positionId,
                      );

                      return (
                        <Droppable
                          key={positionId}
                          className={cn(
                            positionId,
                            `flex size-9 items-center justify-center sm:size-16 md:size-20`,
                            (reversedOrNotRowIndex + reversedOrNotColIndex) %
                              2 ===
                              0 && 'bg-rose-600',
                            (reversedOrNotRowIndex + reversedOrNotColIndex) %
                              2 !==
                              0 && 'bg-rose-300',
                            droppablePositions.includes(positionId)
                              ? 'cursor-pointer'
                              : 'cursor-not-allowed',
                            highlightedPath.includes(positionId) &&
                              (reversedOrNotRowIndex + reversedOrNotColIndex) %
                                2 ===
                                0 &&
                              'bg-gray-600',
                            highlightedPath.includes(positionId) &&
                              (reversedOrNotRowIndex + reversedOrNotColIndex) %
                                2 !==
                                0 &&
                              'bg-gray-500',
                            highlightedHint.includes(positionId) &&
                              (reversedOrNotRowIndex + reversedOrNotColIndex) %
                                2 ===
                                0 &&
                              'bg-gray-600',
                            highlightedHint.includes(positionId) &&
                              (reversedOrNotRowIndex + reversedOrNotColIndex) %
                                2 !==
                                0 &&
                              'bg-gray-500',
                          )}
                          id={positionId}
                          disabled={!droppablePositions.includes(positionId)}
                        >
                          {checker ? (
                            <motion.div
                              initial={false} // Avoid initial animation on mount
                              layout
                              animate={{
                                x: [
                                  null,
                                  ...(movingState[checker.checkerId]?.x ?? []),
                                ],
                                y: [
                                  null,
                                  ...(movingState[checker.checkerId]?.y ?? []),
                                ],
                              }}
                              onAnimationComplete={handleAnimationComplete}
                              transition={{
                                duration:
                                  movingState[checker.checkerId]?.x.length ?? 0,
                              }} // Optional: adjust timing
                              className="flex items-center justify-center"
                            >
                              <Draggable
                                id={checker.checkerId}
                                disabled={
                                  !draggableCheckers.includes(checker.checkerId)
                                }
                              >
                                <Circle
                                  color={
                                    checker.player === 'p1'
                                      ? '#000000'
                                      : '#ffffff'
                                  }
                                  strokeWidth={3}
                                  className={cn(
                                    `size-8 sm:size-14 md:size-16`,
                                    draggableCheckers.includes(
                                      checker.checkerId,
                                    )
                                      ? 'cursor-pointer'
                                      : 'cursor-not-allowed',
                                  )}
                                />
                              </Draggable>
                            </motion.div>
                          ) : null}
                        </Droppable>
                      );
                    })}
                  </div>
                ))}
              </div>
            </DndContext>
            <div>
              {/* Row labels */}
              {Array.from({ length: rowCountConst }).map((_, index) => (
                <div
                  key={index}
                  className="flex size-9 items-center justify-center text-3xl font-thin sm:size-16 md:size-20 md:text-5xl"
                >
                  {
                    rowLabelConst[
                      reversedBoard ? rowCountConst - index - 1 : index
                    ]
                  }
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            {/* Column labels */}
            {[
              '',
              ...(reversedBoard
                ? colLabelConst.slice(0).reverse()
                : colLabelConst),
              '',
            ].map((col, index) => (
              <div
                key={index}
                className="flex size-9 items-center justify-center text-3xl font-thin sm:size-16 md:size-20 md:text-5xl"
              >
                {col}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameBoard;
