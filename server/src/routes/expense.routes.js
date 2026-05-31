import { Router } from 'express';
import { create, settle, list, remove, balances } from '../controllers/expense.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import requireGroupMember from '../middleware/requireGroupMember.js';
import { createExpenseValidation, settleUpValidation } from '../validators/expense.validators.js';
import validate from '../utils/validate.js';

const router = Router();

router.get('/:groupId/expenses', requireAuth, requireGroupMember(), list);
router.post('/:groupId/expenses', requireAuth, requireGroupMember(), createExpenseValidation, validate, create);
router.delete('/:groupId/expenses/:expenseId', requireAuth, requireGroupMember(), remove);
router.post('/:groupId/settle', requireAuth, requireGroupMember(), settleUpValidation, validate, settle);
router.get('/:groupId/balances', requireAuth, requireGroupMember(), balances);

export default router;
