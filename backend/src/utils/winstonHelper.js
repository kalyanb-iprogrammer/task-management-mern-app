const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, label, printf } = format;

const moment = require('moment');

const myFormat = printf(({ level, message, label }) => {
    return `${moment().utc().format()} [${label}] ${level}: ${message}`;
  });

const formattedDate = `${moment().utc().format('YYYY-MM-DD')}`;


const infoTransport = new transports.DailyRotateFile({
  level: 'info',
  filename: './error/combined-%DATE%.log',
  datePattern: formattedDate,
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: process.env.LOG_RETENTION_TIME
});

const errorTransport = new transports.DailyRotateFile({
  level: 'error',
  filename: './error/error-%DATE%.log',
  datePattern: formattedDate,
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: process.env.LOG_RETENTION_TIME
});

exports.logger = (level = 'info', message, service = 'common-error') =>  createLogger({
    level,
    format: combine(
        label({ label: message }),
        timestamp(),
        myFormat,
    ),
    defaultMeta: { service },
    transports: [
      infoTransport,
      errorTransport,
      new transports.Console({
        level: 'debug', // Only log messages at 'debug' level or higher to the console
      })
    ],
  });
