import asyncHandler from '../utils/asyncHandler.js';
import * as expenseService from '../services/expense.service.js';
import * as balanceService from '../services/balance.service.js';

export const create = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense({
    groupId: req.params.groupId,
    ...req.body,
    createdById: req.user.id,
  });
  res.status(201).json(expense);
});

export const settle = asyncHandler(async (req, res) => {
  const expense = await expenseService.createSettlement({
    groupId: req.params.groupId,
    ...req.body,
    createdById: req.user.id,
  });
  res.status(201).json(expense);
});

export const list = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getExpenses(req.params.groupId);
  res.json(expenses);
});

export const remove = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.params.expenseId, req.user.id);
  res.json({ message: 'Expense deleted' });
});

export const balances = asyncHandler(async (req, res) => {
  const result = await balanceService.getGroupBalances(req.params.groupId);
  res.json(result);
});
