import express from 'express';
import UserController from '../controllers/userController';

const initUserRoutes = () => {
  const userRoutes = express.Router();
  userRoutes.get('/', UserController.page);
  userRoutes.get('/login', UserController.login);
  userRoutes.get('/logout', UserController.logout);
  userRoutes.get('/showAll', UserController.showAll);
  userRoutes.get('/register', UserController.register);
  userRoutes.post('/loggingIn', UserController.loggingIn);
  userRoutes.post('/compile_and_run', UserController.compile);
  userRoutes.post('/registration', UserController.registration);
  return userRoutes;
};

export default initUserRoutes;
