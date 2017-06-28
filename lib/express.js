import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import logger from './logger';
import initRoutes from './../app/routes';
import Responder from './expressResponder';

// Initialize express app
const app = express();

function initMiddleware() {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Enable logger (morgan)
  app.use(morgan('combined', { stream: logger.stream }));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(methodOverride());
}

function initErrorRoutes() {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      next();
    }

    // Return error
    return Responder.operationFailed(res, err);
  });
}

export function init() {

  // Initialize Express middleware
  initMiddleware();

  // Initialize modules server routes
  initRoutes(app);

  // Initialize error routes
  initErrorRoutes();

  return app;
}
