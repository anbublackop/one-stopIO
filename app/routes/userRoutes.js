import express from 'express';
import UserController from '../controllers/userController';

const initUserRoutes = () => {
  const userRoutes = express.Router();
  userRoutes.get('/', UserController.page);
  userRoutes.get('/login', UserController.login);
  userRoutes.get('/logout', UserController.logout);
  userRoutes.get('/show_all', UserController.show_all);
  userRoutes.post('/share', UserController.share);
  userRoutes.get('/delete', UserController.delete);
  userRoutes.get('/my_codes', UserController.my_codes);
  userRoutes.get('/register', UserController.register);
  userRoutes.get('/filterCode', UserController.filterCode);
  userRoutes.get('/googleConsent', UserController.googleConsent);
  userRoutes.post('/auth/google', UserController.googleAuthRedirect);
  userRoutes.post('/logging_in', UserController.logging_in);
  userRoutes.post('/compile_and_run', UserController.compile);
  userRoutes.post('/registration', UserController.registration);
  return userRoutes;
};

export default initUserRoutes;
