import asyncHandler from '../utils/asyncHandler.js';
import { getAllTransactions, getAllSettlements, getAnalytics } from '../services/misc.service.js';

export const transactions = asyncHandler(async (req, res) => {
  const data = await getAllTransactions(req.user.id);
  res.json(data);
});

export const settlements = asyncHandler(async (req, res) => {
  const data = await getAllSettlements(req.user.id);
  res.json(data);
});

export const analytics = asyncHandler(async (req, res) => {
  const data = await getAnalytics(req.user.id);
  res.json(data);
});
