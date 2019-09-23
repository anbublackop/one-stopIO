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

  // userRoutes.get('/codes', UserController.myCodes);
  userRoutes.get('/codes', UserController.fetchCodes);

  // userRoutes.get('/records', UserController.sharedWithMe);
  userRoutes.get('/records', UserController.shared);

  // userRoutes.get('/code', UserController.filterCode);
  userRoutes.get('/code', UserController.getCode);

  userRoutes.get('/google-token', UserController.googleConsent);

  // userRoutes.get('/google-profile', UserController.googleAuthRedirect);
  userRoutes.get('/google-profile', UserController.getProfile);

  userRoutes.put('/code/shared-with', UserController.share);

  // userRoutes.post('/loggingIn', UserController.loggingIn);
  userRoutes.post('/loggingIn', UserController.createLogin);

  userRoutes.post('/code/compileAndRun', UserController.compile);

  // userRoutes.post('/registration', UserController.registration);
  userRoutes.post('/registration', UserController.createUser);

  // userRoutes.delete('/delete/record', UserController.delete);
  userRoutes.delete('/delete/record', UserController.deleteRecord);

  return userRoutes;
};

export default initUserRoutes;
