import { type NextApiRequest, type NextApiResponse } from 'next';
import { type Server as NetServer } from 'http';
import { type Socket } from 'net';
import { Server as ServerIO } from 'socket.io';

// Define the type for the custom NextApiResponse with the ServerIO instance
export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

// Configuration for the API route
export const config = {
  api: {
    bodyParser: false,
  },
};

// The handler function for the API route
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path: path,
    });

    io.on('connection', (socket) => {
      socket.on('join', function (room) {
        socket
          .to(room.gameId)
          .emit('user-joined-room', { userId: room.userId });

        socket.join(room.gameId);
      });

      socket.on('leave', function (room) {
        socket.leave(room.gameId);

        socket.to(room.gameId).emit('user-left-room', { userId: room.userId });
      });

      socket.on('send-hint', function (room) {
        socket.to(room.gameId).emit('show-hint', { ...room });
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
