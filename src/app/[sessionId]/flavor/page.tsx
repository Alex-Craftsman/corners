'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle, XIcon } from 'lucide-react';

import { fakerRU as faker } from '@faker-js/faker';

import PageLoader from '~/components/ui/page-loader';
import { useToast } from '~/components/ui/use-toast';
import {
  colCountConst,
  type GameFlavor,
  initialBoardConst,
  rowCountConst,
} from '~/lib/constant';
import { boardToHash, cn } from '~/lib/util.lib';
import { useSession } from '~/store/session.store';
import { api } from '~/trpc/react';
import type { TBoard } from '~/type/game.type';

const FlavorPage: NextPage = () => {
  const [flavor, setFlavor] = useState<GameFlavor>('standard');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { sessionId } = useSession();

  const { toast } = useToast();

  const { t } = useTranslation();
  const router = useRouter();

  const { data: user, isLoading: isUserLoadinng } =
    api.user.safeIdentity.useQuery();

  const createGame = api.game.create.useMutation({
    onSuccess: (game) => {
      toast({
        description: t('otkryta-igra-game-name', {
          gameName: game?.name ?? '',
        }),
      });

      if (!game) {
        return;
      }

      router.push(`/${sessionId}/game/${game.id}`);
    },
    onError: () => {
      toast({ description: t('ne-udalos-sozdat-igru') });

      setIsLoading(false);
    },
  });

  // https://dev.to/samanthaming/how-to-deep-clone-an-array-in-javascript-3cig
  const boardHash = useMemo(
    () =>
      boardToHash(
        JSON.parse(JSON.stringify(initialBoardConst[flavor])) as TBoard,
      ),
    [flavor],
  );

  const handleGameCreateClick = async () => {
    setIsLoading(true);

    createGame.mutateAsync({
      name: faker.animal.cat(),
      flavor,
    });
  };

  const handleFlavorChange = async (direction: 'left' | 'right') => {
    const flavors: GameFlavor[] = ['standard', 'diagonal', 'line'];

    const currentIndex = flavors.indexOf(flavor);

    let nextIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex < 0) {
      nextIndex = flavors.length - 1;
    }

    if (nextIndex >= flavors.length) {
      nextIndex = 0;
    }

    setFlavor(flavors[nextIndex] ?? 'standard');
  };

  if (isLoading && isUserLoadinng) {
    return <PageLoader />;
  }

  return user ? (
    <>
      <h1 className="flex w-full scroll-m-20 items-center justify-between gap-3 text-base font-thin tracking-tight md:text-6xl lg:text-8xl">
        <span className="invisible">
          <XIcon className="size-8 sm:size-12 md:size-16" />
        </span>
        <span>
          {t('game-flavor', {
            flavor: t(`flavor-${flavor}`),
          })}
        </span>
        <div className="flex">
          <Link href="/">
            <XIcon className="size-12 sm:size-16 md:size-20" />
          </Link>
        </div>
      </h1>
      <div className="relative mt-10 flex items-center justify-center gap-4">
        <ChevronLeft
          className="sm:size-22 size-18 cursor-pointer md:size-24"
          onClick={() => handleFlavorChange('left')}
        />
        <div className="invisible">
          {Array.from({ length: rowCountConst }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex">
              {Array.from({
                length: colCountConst ?? 0,
              }).map((_, colIndex) => {
                const positionId = `position-${rowIndex}-${colIndex}`;

                // find in the board
                const checker = Object.values(boardHash).find(
                  (item) => item.positionId === positionId,
                );

                return (
                  <div
                    key={positionId}
                    className={cn(
                      positionId,
                      `md:size-26 flex size-14 items-center justify-center sm:size-20`,
                      (rowIndex + colIndex) % 2 === 0 && 'bg-rose-600',
                      (rowIndex + colIndex) % 2 !== 0 && 'bg-rose-300',
                    )}
                    id={positionId}
                  >
                    {checker ? (
                      <div className="flex items-center justify-center">
                        <Circle
                          color={
                            checker.player === 'p1' ? '#000000' : '#ffffff'
                          }
                          strokeWidth={3}
                          className={cn(`md:size-22 size-10 sm:size-16`)}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <AnimatePresence>
          <motion.div
            key={flavor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="absolute cursor-pointer"
            onClick={() => handleGameCreateClick()}
          >
            {Array.from({ length: rowCountConst }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex">
                {Array.from({
                  length: colCountConst ?? 0,
                }).map((_, colIndex) => {
                  const positionId = `position-${rowIndex}-${colIndex}`;

                  // find in the board
                  const checker = Object.values(boardHash).find(
                    (item) => item.positionId === positionId,
                  );

                  return (
                    <div
                      key={positionId}
                      className={cn(
                        positionId,
                        `md:size-26 flex size-14 items-center justify-center sm:size-20`,
                        (rowIndex + colIndex) % 2 === 0 && 'bg-rose-600',
                        (rowIndex + colIndex) % 2 !== 0 && 'bg-rose-300',
                      )}
                      id={positionId}
                    >
                      {checker ? (
                        <div className="flex items-center justify-center">
                          <Circle
                            color={
                              checker.player === 'p1' ? '#000000' : '#ffffff'
                            }
                            strokeWidth={3}
                            className={cn(`md:size-22 size-10 sm:size-16`)}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        <ChevronRight
          className="sm:size-22 size-18 cursor-pointer md:size-24"
          onClick={() => handleFlavorChange('right')}
        />
      </div>
    </>
  ) : null;
};

export default FlavorPage;
