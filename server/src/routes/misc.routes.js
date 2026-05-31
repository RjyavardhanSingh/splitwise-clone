import { Router } from 'express';
import { transactions, settlements, analytics } from '../controllers/misc.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.get('/transactions', requireAuth, transactions);
router.get('/settlements', requireAuth, settlements);
router.get('/analytics', requireAuth, analytics);

export default router;
