import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getGroupBalances(groupId) {
  // Fetch all expenses with splits for the group in one query
  // This avoids N+1 and gives us all data needed for the matrix calculation
  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: {
      paidBy: { select: { id: true, name: true } },
      splits: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });

  return calculateBalances(expenses);
}

export function calculateBalances(expenses) {
  // Build net matrix: net[A][B] = amount B owes A
  // Iterate each expense: payer paid, each debtor owes split amount
  // net[debtor][payer] += splitAmount
  const net = {};

  for (const expense of expenses) {
    const payerId = expense.paidById;
    for (const split of expense.splits) {
      const debtorId = split.userId;
      if (debtorId === payerId) continue;

      if (!net[debtorId]) net[debtorId] = {};
      if (!net[debtorId][payerId]) net[debtorId][payerId] = 0;
      net[debtorId][payerId] += Number(split.amount);
    }
  }

  // Simplify: for each pair, net to one direction
  const result = [];
  const seen = new Set();

  for (const debtorId of Object.keys(net)) {
    for (const creditorId of Object.keys(net[debtorId])) {
      const pairKey = [debtorId, creditorId].sort().join(':');
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);

      const aOwesB = net[debtorId]?.[creditorId] || 0;
      const bOwesA = net[creditorId]?.[debtorId] || 0;
      const netAmount = aOwesB - bOwesA;

      if (Math.abs(netAmount) < 0.01) continue;

      // Find user names from expense data
      const fromUser = findUser(expenses, netAmount > 0 ? debtorId : creditorId);
      const toUser = findUser(expenses, netAmount > 0 ? creditorId : debtorId);

      result.push({
        from: fromUser,
        to: toUser,
        amount: Math.abs(netAmount).toFixed(2),
      });
    }
  }

  return result;
}

function findUser(expenses, userId) {
  for (const expense of expenses) {
    if (expense.paidBy.id === userId) {
      return { id: expense.paidBy.id, name: expense.paidBy.name };
    }
    for (const split of expense.splits) {
      if (split.user.id === userId) {
        return { id: split.user.id, name: split.user.name };
      }
    }
  }
  return { id: userId, name: 'Unknown' };
}
