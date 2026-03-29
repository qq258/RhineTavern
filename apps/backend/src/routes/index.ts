import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';
import foodController from '../controllers/food.controller';
import exerciseController from '../controllers/exercise.controller';
import dietController from '../controllers/diet.controller';
import workoutController from '../controllers/workout.controller';

const router = Router();

router.post('/auth/login', authController.login);
router.post('/auth/register', authMiddleware, authController.register);
router.get('/auth/profile', authMiddleware, (req, res) => {
  res.success((req as any).user);
});

router.get('/foods', authMiddleware, foodController.findAll);
router.get('/foods/:id', authMiddleware, foodController.findById);
router.post('/foods', authMiddleware, foodController.create);
router.put('/foods/:id', authMiddleware, foodController.update);
router.delete('/foods/:id', authMiddleware, foodController.delete);

router.get('/exercises', authMiddleware, exerciseController.findAll);
router.get('/exercises/:id', authMiddleware, exerciseController.findById);
router.post('/exercises', authMiddleware, exerciseController.create);
router.put('/exercises/:id', authMiddleware, exerciseController.update);
router.delete('/exercises/:id', authMiddleware, exerciseController.delete);

router.get('/diet-logs', authMiddleware, dietController.findAll);
router.get('/diet-logs/:id', authMiddleware, dietController.findById);
router.post('/diet-logs', authMiddleware, dietController.create);
router.delete('/diet-logs/:id', authMiddleware, dietController.delete);

router.get('/workout-logs', authMiddleware, workoutController.findAll);
router.get('/workout-logs/:id', authMiddleware, workoutController.findById);
router.post('/workout-logs', authMiddleware, workoutController.create);
router.put('/workout-logs/:id', authMiddleware, workoutController.update);
router.delete('/workout-logs/:id', authMiddleware, workoutController.delete);

router.get('/health', (req, res) => {
  res.success({ status: 'ok' });
});

export default router;