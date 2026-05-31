import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';
import roundCurrency from '../utils/roundCurrency.js';
import { sendExpenseNotificationEmail } from '../utils/mail.js';

const prisma = new PrismaClient();

export async function createExpense({ groupId, title, amount, paidById, splitAmong, createdById }) {
  const members = await prisma.groupMember.findMany({
    where: { groupId, userId: { in: splitAmong } },
    select: { userId: true },
  });

  if (members.length !== splitAmong.length) {
    throw new AppError('One or more split members are not in the group', 422);
  }

  // Equal split with rounding: remainder goes to payer
  const share = roundCurrency(amount / splitAmong.length);
  const remainder = roundCurrency(amount - share * splitAmong.length);

  const expense = await prisma.expense.create({
    data: {
      title,
      amount,
      paidById,
      createdById,
      groupId,
      splits: {
        create: splitAmong.map((userId) => {
          let splitAmount = share;
          if (userId === paidById) {
            splitAmount = roundCurrency(share + remainder);
          }
          return { userId, amount: splitAmount };
        }),
      },
    },
    include: {
      paidBy: { select: { id: true, name: true } },
      group: { select: { name: true } },
      splits: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  // Send email notifications to all split members
  const paidByName = expense.paidBy.name;
  const groupName = expense.group.name;
  const totalAmount = Number(expense.amount).toFixed(2);
  for (const split of expense.splits) {
    if (split.user.email) {
      sendExpenseNotificationEmail(
        split.user.email,
        split.user.name,
        groupName,
        title,
        totalAmount,
        paidByName,
        Number(split.amount).toFixed(2),
      ).catch(() => {});
    }
  }

  return formatExpense(expense);
}

export async function createSettlement({ groupId, payerId, payeeId, amount, createdById }) {
  const expense = await prisma.expense.create({
    data: {
      title: 'Settlement',
      amount,
      paidById: payerId,
      createdById,
      groupId,
      isSettlement: true,
      splits: {
        create: { userId: payeeId, amount },
      },
    },
    include: {
      paidBy: { select: { id: true, name: true } },
      group: { select: { name: true } },
      splits: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  // Notify both payer and payee
  const groupName = expense.group.name;
  const totalAmount = Number(expense.amount).toFixed(2);
  const paidByName = expense.paidBy.name;

  // Notify payer
  if (expense.paidBy.email) {
    sendExpenseNotificationEmail(
      expense.paidBy.email,
      expense.paidBy.name,
      groupName,
      'Settlement',
      totalAmount,
      paidByName,
      totalAmount,
      'settlement',
    ).catch(() => {});
  }

  // Notify payee
  for (const split of expense.splits) {
    if (split.user.email && split.user.id !== payerId) {
      sendExpenseNotificationEmail(
        split.user.email,
        split.user.name,
        groupName,
        'Settlement',
        totalAmount,
        paidByName,
        totalAmount,
        'settlement',
      ).catch(() => {});
    }
  }

  return formatExpense(expense);
}

export async function getExpenses(groupId) {
  const expenses = await prisma.expense.findMany({
    where: { groupId },
    orderBy: { createdAt: 'desc' },
    include: {
      paidBy: { select: { id: true, name: true } },
      splits: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  return expenses.map(formatExpense);
}

export async function deleteExpense(expenseId, userId) {
  const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!expense) throw new AppError('Expense not found', 404);
  if (expense.createdById !== userId) throw new AppError('Forbidden', 403);

  await prisma.expense.delete({ where: { id: expenseId } });
}

function formatExpense(expense) {
  return {
    id: expense.id,
    title: expense.title,
    amount: expense.amount.toString(),
    isSettlement: expense.isSettlement,
    createdAt: expense.createdAt,
    paidBy: expense.paidBy,
    splits: expense.splits.map((s) => ({
      user: s.user,
      amount: s.amount.toString(),
    })),
  };
}
