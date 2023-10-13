import cors, { CorsOptions } from 'cors';
import express, { RequestHandler } from 'express';
import helmet from 'helmet';
import { createServer, Server } from 'http';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';

import 'dotenv/config';

import setUpIo from './socket';

const corsOptions: CorsOptions = {
  origin: '*',
};

export class ApiServer {
  public server: Server | null = null;

  public io: SocketServer | null = null;

  async initialize(port = process.env.MATCHING_PORT): Promise<void> {
    console.log(process.env.SUPABASE_URL);
    const app = express();
    app.use(express.json({ limit: '20mb' }) as RequestHandler);
    app.use(
      express.urlencoded({ extended: true, limit: '20mb' }) as RequestHandler,
    );
    app.use(cors(corsOptions));
    app.use(helmet() as RequestHandler);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Express server has started on port ${port}.`);
      app.use(morgan('dev') as RequestHandler);
    }

    const httpServer = createServer(app);

    const io = new SocketServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      maxHttpBufferSize: 1e8,
      pingTimeout: 60000,
      allowEIO3: true,
    });

    httpServer.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
    setUpIo(io);

    this.server = httpServer;
    this.io = io;
  }

  async close(): Promise<void> {
    console.log('\nShutting down...');
    this.server?.close();
    this.io?.close();
  }
}

export default ApiServer;
