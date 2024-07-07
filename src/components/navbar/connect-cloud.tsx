'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Icons } from '~/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { socket } from '~/socket';
import type { Nullable } from '~/type/helper.type';
import type { User } from '~prisma';

export const ConnectCloud = ({ user }: { user: Nullable<User> }) => {
  const pathName = usePathname();

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');

  useEffect(() => {
    if (pathName?.includes('/game/')) {
      const gameId = pathName.split('/').pop();

      socket.emit('join', { gameId, userId: user?.id ?? null });
    }

    return () => {
      if (pathName?.includes('/game/')) {
        const gameId = pathName.split('/').pop();

        socket.emit('leave', { gameId, userId: user?.id ?? null });
      }
    };
  }, [pathName, user?.id]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {isConnected ? <Icons.online /> : <Icons.offline />}
        </TooltipTrigger>
        <TooltipContent>
          <p>{transport}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
