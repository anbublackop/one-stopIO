import initUserRoutes from './userRoutes';

const userRoutes = (app) => {
  app.use(`/user`, initUserRoutes());
};

export default initUserRoutes;
