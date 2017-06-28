import initPlanRoutes from './planRoutes';

const initRoutes = (app) => {
  app.use(`/foos`, initPlanRoutes());
};

export default initRoutes;
