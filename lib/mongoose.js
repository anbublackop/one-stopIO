import config from 'config';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import logger from './logger';

export function connect(cb) {
  mongoose.Promise = bluebird;
  const db = mongoose.connect(config.db.uri, config.db.options, (err) => {
    if (err) {
      logger.error('Could not connect to MongoDB!');
      logger.error(err);
    } else {
      mongoose.set('debug', config.db.debug);
      if (cb) cb(db);
    }
  });
}

export const disconnect = (cb) => {
  mongoose.disconnect((err) => {
    logger.info('Disconnected from MongoDB.');
    cb(err);
  });
};
