import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import path from 'path';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import logger from './logger';
import initUserRoutes from './../app/routes';
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

  app.set('views', path.join(__dirname,'../app/views'));
  
  app.use(express.static('../app/views/images'));

  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  
  app.set('view engine', 'handlebars');
  
  app.use(cookieParser());
  
  app.use(session({secret: 'Thisisarandomstring'}));

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(methodOverride());

  app.get('/', function(req, res){
    res.redirect('/user');
  })
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
  initUserRoutes(app);

  // Initialize error routes
  initErrorRoutes();

  return app;
}
