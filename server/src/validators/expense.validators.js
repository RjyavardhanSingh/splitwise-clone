import { body } from 'express-validator';

export const createExpenseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01'),
  body('paidById').isUUID().withMessage('Valid payer ID is required'),
  body('splitAmong').isArray({ min: 1 }).withMessage('At least one person must be in the split'),
  body('splitAmong.*').isUUID().withMessage('Valid user ID required in split'),
];

export const settleUpValidation = [
  body('payerId').isUUID().withMessage('Valid payer ID is required'),
  body('payeeId').isUUID().withMessage('Valid payee ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01'),
];
