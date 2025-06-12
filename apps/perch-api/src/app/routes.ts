// apps/perch-api/src/app/routes.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from Perch API!' });
});

export default router;
