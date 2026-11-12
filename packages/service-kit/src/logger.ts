/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { NextFunction, Request, Response } from 'express';
import { addColors, createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const customLevels = {
  levels: { error: 0, warn: 1, info: 2, http: 3, success: 4 },
  colors: {
    error: 'bold red blackBG',
    warn: 'italic yellow',
    info: 'blue',
    http: 'magenta',
    success: 'green'
  }
};

export const logger = createLogger({
  levels: customLevels.levels,
  format: combine(
    timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    format.splat(),
    printf(({ level, message, timestamp }) => `[ ${level} ]:: ${timestamp} - ${message}`)
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info-warning.log' })
  ]
});

addColors(customLevels.colors);

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: format.colorize({ all: true }) }));
}

export function requestLogger(request: Request, response: Response, next: NextFunction) {
  logger.info(`${request.method} ${request.url}`);
  response.on('finish', () => {
    logger.log(
      response.statusCode < 400 ? 'info' : 'error',
      `${response.statusCode} ${response.statusMessage}`
    );
  });
  next();
}
