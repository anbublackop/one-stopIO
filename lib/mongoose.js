import config from 'config';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import logger from './logger';

export function connect(cb) {
  
  // mongoose.Promise = bluebird;
  
  // const db = mongoose.connect(config.db.uri, () => {
  //   console.log('Connected to mongo DB...');
  // });
  
  const db = mongoose.createConnection(config.db.uri, (err) => {
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
