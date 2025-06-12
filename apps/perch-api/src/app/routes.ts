// apps/perch-api/src/app/routes.ts
import { Router } from 'express';
import { taskRoutes } from './modules/task/task.routes';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from Perch API!' });
});

router.use('/tasks', taskRoutes);

export default router;
