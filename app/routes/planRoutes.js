import express from 'express';
import PlanController from '../controllers/planController';

const initPlanRoutes = () => {
  const planRoutes = express.Router();

  planRoutes.get('/', PlanController.page);
  planRoutes.get('/:planId', PlanController.show);
  planRoutes.post('/', PlanController.create);
  planRoutes.put('/:planId', PlanController.update);
  planRoutes.delete('/:planId', PlanController.remove);

  return planRoutes;
};

export default initPlanRoutes;
