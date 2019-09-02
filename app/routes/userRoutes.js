import express from 'express';
import UserController from '../controllers/userController';

const initUserRoutes = () => {
  const userRoutes = express.Router();
  userRoutes.get('/', UserController.page);
  userRoutes.get('/login', UserController.login);
  userRoutes.get('/logout', UserController.logout);
  userRoutes.get('/register', UserController.register);
  userRoutes.post('/loggingIn', UserController.postLogin);
  userRoutes.post('/registration', UserController.registration);
  userRoutes.get('/showAll', UserController.showAll);
  return userRoutes;
};

export default initUserRoutes;
