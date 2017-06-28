import winston from 'winston';
import fs from 'fs';
import config from 'config';

const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

winston.emitErrs = true;

let logLevel = config.loglevel || 'error';

const transports = [
  new winston.transports.File({
    level: logLevel,
    filename: `${logDir}/${logLevel}.log`,
    handleExceptions: true,
    json: true,
    maxsize: 10485760, // 10MB
    maxFiles: 5,
    colorize: false,
  })
];

if(!process.env.NODE_ENV || process.env.NODE_ENV==='development')
  transports.push(new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  }));

const logger = new winston.Logger({transports: transports, exitOnError: false});

module.exports = logger;

module.exports.stream = {
  write: (message) => {
    logger.info(message);
  }
};
