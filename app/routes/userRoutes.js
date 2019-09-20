import express from 'express';
import UserController from '../controllers/userController';

const initUserRoutes = () => {
  const userRoutes = express.Router();
  
  //Front-end routes
  userRoutes.get('/', UserController.page);
  userRoutes.get('/login', UserController.login);
  userRoutes.get('/logout', UserController.logout);
  userRoutes.get('/register', UserController.register);

  //Back-end routes
  userRoutes.get('/users', UserController.showAll);
  userRoutes.get('/codes', UserController.myCodes);
  userRoutes.get('/records', UserController.sharedWithMe);
  userRoutes.get('/code', UserController.filterCode);
  userRoutes.get('/google-token', UserController.googleConsent);
  userRoutes.get('/google-profile', UserController.googleAuthRedirect);
  userRoutes.put('/code/shared-with', UserController.share);
  userRoutes.post('/loggingIn', UserController.loggingIn);
  userRoutes.post('/code/compileAndRun', UserController.compile);
  userRoutes.post('/registration', UserController.registration);

  userRoutes.delete('/delete/record', UserController.delete);
  
  return userRoutes;
};

export default initUserRoutes;
