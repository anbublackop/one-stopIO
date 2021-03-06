import config from 'config';
import mongoose from 'mongoose';

import logger from './logger';

export function connect(cb) {
  
  const db = mongoose.connect(config.db.uri, (err) => {
    if (err) {
      logger.error('Could not connect to MongoDB!');
      logger.error(err);
    } else {
      mongoose.set('debug', config.db.debug);
      console.log('Connected to DB!');
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
