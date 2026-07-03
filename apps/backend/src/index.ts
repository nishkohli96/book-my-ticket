import 'dotenv/config';
import os from 'os';
import { createServer } from 'node:http';
import { ENV_CONFIG } from '@/constants';
import { connectPostgresDB, disconnectPostgresDB } from '@/db';
import { winstonLogger } from '@/middleware';
import app from './app';

const hostName = os.hostname();
const { port, env } = ENV_CONFIG;

async function bootstrap() {
  try{
    await connectPostgresDB();
    const server = createServer(app);
    server.listen(port, () => {
      winstonLogger.info(
        `[⚡️ ${env}@${hostName} ⚡️] - Server running on port ${port}`
      );
    });
  } catch (err) {
    winstonLogger.error('Error in starting server: ', err);
    process.exit(1);
  }
}

async function handleExit(signal: string) {
  winstonLogger.info(`Received ${signal}`);
  try {
    await disconnectPostgresDB();
  } catch (error) {
    winstonLogger.error('Error while disconnecting from the database:', error);
  } finally {
    process.exit(0);
  }
}

process.on('SIGTERM', () => handleExit('SIGTERM'));
process.on('SIGINT', () => handleExit('SIGINT'));

bootstrap();
