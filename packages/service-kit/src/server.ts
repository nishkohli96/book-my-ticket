import { createServer } from 'node:http';
import os from 'node:os';
import type { Express } from 'express';
import { logger } from './logger';

type StartServerOptions = {
  app: Express;
  port: string | number;
  /** Runs before listening, e.g. connect to the database. */
  onStart: () => Promise<unknown>;
  /** Runs on SIGTERM/SIGINT, e.g. close the database pool. */
  onStop: () => Promise<unknown>;
};

export async function startServer({ app, port, onStart, onStop }: StartServerOptions) {
  const handleExit = async (signal: string) => {
    logger.info(`Received ${signal}`);
    try {
      await onStop();
    } catch (error) {
      logger.error('Error during shutdown:', error);
    } finally {
      process.exit(0);
    }
  };
  process.on('SIGTERM', () => void handleExit('SIGTERM'));
  process.on('SIGINT', () => void handleExit('SIGINT'));

  try {
    await onStart();
    createServer(app).listen(port, () => {
      logger.info(
        `[⚡️ ${process.env.NODE_ENV ?? 'development'}@${os.hostname()} ⚡️] - Server running on port ${port}`
      );
    });
  } catch (error) {
    logger.error('Error in starting server: ', error);
    process.exit(1);
  }
}
