import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const getLoggerInstance = (logsDir) => winston.createLogger({
  level: process.env.LOG_LEVEL?.toLowerCase() || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}][${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // new winston.transports.Console(),
    new DailyRotateFile({
      filename: `${logsDir}/lambdadyn-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d'
    })
  ]
});