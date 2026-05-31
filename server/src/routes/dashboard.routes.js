import { Router } from 'express';
import { dashboard } from '../controllers/dashboard.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.get('/balances', requireAuth, dashboard);

export default router;
