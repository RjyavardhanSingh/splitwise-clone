import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllTransactions(userId) {
  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    select: { groupId: true },
  });

  const groupIds = memberships.map((m) => m.groupId);
  if (groupIds.length === 0) return [];

  const expenses = await prisma.expense.findMany({
    where: { groupId: { in: groupIds } },
    include: {
      paidBy: { select: { id: true, name: true } },
      group: { select: { id: true, name: true } },
      splits: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return expenses.map((e) => ({
    id: e.id,
    title: e.title,
    amount: e.amount.toString(),
    isSettlement: e.isSettlement,
    createdAt: e.createdAt,
    paidBy: e.paidBy,
    group: e.group,
    splits: e.splits.map((s) => ({
      user: s.user,
      amount: s.amount.toString(),
    })),
  }));
}

export async function getAllSettlements(userId) {
  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    select: { groupId: true },
  });

  const groupIds = memberships.map((m) => m.groupId);
  if (groupIds.length === 0) return [];

  const settlements = await prisma.expense.findMany({
    where: { groupId: { in: groupIds }, isSettlement: true },
    include: {
      paidBy: { select: { id: true, name: true } },
      group: { select: { id: true, name: true } },
      splits: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return settlements.map((e) => ({
    id: e.id,
    title: e.title,
    amount: e.amount.toString(),
    createdAt: e.createdAt,
    paidBy: e.paidBy,
    group: e.group,
    splits: e.splits.map((s) => ({
      user: s.user,
      amount: s.amount.toString(),
    })),
  }));
}

export async function getAnalytics(userId) {
  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    include: {
      group: {
        include: {
          members: { select: { userId: true } },
          expenses: {
            include: {
              splits: { select: { userId: true, amount: true } },
              paidBy: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  let totalSpent = 0;
  let totalOwed = 0;
  let expenseCount = 0;
  let settlementCount = 0;
  const groupBreakdown = [];
  const monthlyData = {};

  for (const { group } of memberships) {
    let groupSpent = 0;
    let groupOwed = 0;

    for (const expense of group.expenses) {
      const amount = Number(expense.amount);
      expenseCount++;
      if (expense.isSettlement) settlementCount++;

      const paid = expense.paidById === userId ? amount : 0;
      const owed = expense.splits
        .filter((s) => s.userId === userId)
        .reduce((sum, s) => sum + Number(s.amount), 0);

      groupSpent += paid;
      groupOwed += owed;

      const month = new Date(expense.createdAt).toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      monthlyData[month] = (monthlyData[month] || 0) + amount;
    }

    totalSpent += groupSpent;
    totalOwed += groupOwed;

    groupBreakdown.push({
      groupId: group.id,
      groupName: group.name,
      memberCount: group.members.length,
      totalExpenses: group.expenses.length,
      netBalance: groupSpent - groupOwed,
    });
  }

  const topMonths = Object.entries(monthlyData)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  return {
    totalSpent,
    totalOwed,
    netBalance: totalSpent - totalOwed,
    expenseCount,
    settlementCount,
    groupCount: memberships.length,
    groupBreakdown,
    topMonths,
  };
}
