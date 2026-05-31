import { PrismaClient } from '@prisma/client';
import asyncHandler from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const dashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Fetch all groups for user with expenses and splits
  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    include: {
      group: {
        include: {
          expenses: {
            include: { splits: { select: { userId: true, amount: true } } },
          },
        },
      },
    },
  });

  let netBalance = 0;
  const groups = memberships.map(({ group }) => {
    let userBalance = 0;
    for (const expense of group.expenses) {
      const paid = expense.paidById === userId ? Number(expense.amount) : 0;
      const owed = expense.splits
        .filter((s) => s.userId === userId)
        .reduce((sum, s) => sum + Number(s.amount), 0);
      userBalance += paid - owed;
    }
    netBalance += userBalance;
    return { id: group.id, name: group.name, userBalance };
  });

  res.json({ netBalance, groups });
});
