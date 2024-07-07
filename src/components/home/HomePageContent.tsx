'use client';

import { type FC, type MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, XIcon } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import PageLoader from '~/components/ui/page-loader';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { useToast } from '~/components/ui/use-toast';
import { latinize } from '~/lib/latinize.lib';
import { useLocale } from '~/store/locale.store';
import { useSession } from '~/store/session.store';
import { api } from '~/trpc/react';
import type { TGameWithPlayer } from '~/type/game.type';
import { LocaleEnum } from '~/type/i18n.type';
import type { User } from '~prisma';

const HomePageContent: FC<{
  user: User;
}> = ({ user }) => {
  const { toast } = useToast();

  const { sessionId } = useSession();

  const router = useRouter();

  const { t } = useTranslation();

  const { locale } = useLocale();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMyEmptyGameAvailable, setMyEmptyGameAvailable] =
    useState<boolean>(false);

  const gamesToJoin = api.game.getGamesToJoin.useQuery(void {}, {
    refetchOnMount: true,
    refetchInterval: 1000,
  }).data;

  const joinGame = api.game.join.useMutation({
    onSuccess: (g) => {
      toast({
        description: t('prisoedinenie-k-igre', {
          gameName: g.name,
        }),
      });

      router.push(`/${sessionId}/game/${g.id}`);
    },
    onError: () => {
      toast({ description: t('ne-udalos-prisoedinitsya-k-igre') });

      setIsLoading(false);
    },
  });

  const cancelGame = api.game.cancel.useMutation({
    onSuccess: () => {
      toast({ description: t('igra-otmenena') });

      setIsLoading(false);
    },
    onError: () => {
      toast({ description: t('ne-udalos-otmenit-igru') });

      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (gamesToJoin) {
      setMyEmptyGameAvailable(gamesToJoin.some((g) => !g.p2Id));
    } else {
      setMyEmptyGameAvailable(false);
    }
  }, [gamesToJoin]);

  const handleGameClick = async (gameId: string) => {
    setIsLoading(true);

    joinGame.mutate({
      gameId,
      playerId: user.id,
    });
  };

  const handleGameCancelClick = async (e: MouseEvent, gameId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    cancelGame.mutate({
      gameId,
    });
  };

  const getGameDescription = (game: TGameWithPlayer) => {
    const player1NameLocalized =
      locale === LocaleEnum.en
        ? latinize(game?.p1?.name ?? '')
        : game?.p1?.name;

    const player2NameLocalized =
      locale === LocaleEnum.en
        ? latinize(game?.p2?.name ?? '')
        : game?.p2?.name;

    if (game.p1Id === user.id && game.p2) {
      return (
        <>
          {t('vasha-igra-s')} <b>{player2NameLocalized}</b>
        </>
      );
    }

    if (game.p1Id === user.id) {
      return <>{t('vasha-igra')}</>;
    }

    if (game.p2Id === user.id && game.p1) {
      return (
        <>
          {t('igra-s')} <b>{player1NameLocalized}</b>
        </>
      );
    }

    if (game.p1Id && game.p1) {
      return (
        <>
          {t('igra-igroka')} <b>{player1NameLocalized}</b>
        </>
      );
    }

    return <>{t('neizvestnaya-igra')}</>;
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex h-full gap-3">
      <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-col items-center gap-5 md:flex-row">
          <div className="grid w-full gap-2">
            <CardTitle className="text-5xl font-thin md:text-7xl">
              {t('games-available')}
            </CardTitle>
            <CardDescription className="text-xl md:text-2xl">
              {t('games-to-join')}
            </CardDescription>
          </div>
          {isMyEmptyGameAvailable ? null : (
            <Link href={`/${sessionId}/flavor`} className="w-4/5 md:w-auto">
              <Button
                type="button"
                className="ml-auto w-full gap-1 text-2xl md:p-10 md:text-5xl"
              >
                {t('sozdat')}
                <ArrowUpRight className="size-8 md:size-16" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {gamesToJoin && gamesToJoin.length > 0 ? null : (
            <div className="text-center">{t('no-suitable-game')}</div>
          )}

          {gamesToJoin && gamesToJoin.length > 0 ? (
            <Table>
              <TableBody>
                {gamesToJoin?.map((game) => (
                  <TableRow
                    key={game.id}
                    onClick={() => handleGameClick(game.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="align-left flex flex-col gap-4 text-left">
                      <div className="text-4xl md:text-6xl">
                        {getGameDescription(game)}
                      </div>
                      <div className="flex flex-row gap-2 text-xl text-muted-foreground">
                        <div>{game.name}</div>

                        <Badge
                          className="text-xs"
                          variant={
                            (game.state === 'ACTIVE' && 'default') ||
                            (game.state === 'PENDING' && 'secondary') ||
                            (game.state === 'ABORTED' && 'outline') ||
                            (game.state === 'EXPIRED' && 'destructive') ||
                            (game.state === 'FINISHED' && 'outline') ||
                            'destructive'
                          }
                        >
                          {t(game.state)}
                        </Badge>
                        <Badge className="text-xs" variant="outline">
                          {t(`flavor-${game.flavor}`)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {['FINISHED', 'ABORTED'].includes(
                              game.state,
                            ) ? null : (
                              <Button
                                variant="ghost"
                                disabled={game.p1Id !== user.id}
                                onClick={(e) =>
                                  handleGameCancelClick(e, game.id)
                                }
                              >
                                <XIcon className="size-8 md:size-16" />
                              </Button>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('otmenit-igru')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePageContent;
