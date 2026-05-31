import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../utils/AppError.js';
import { sendGroupInviteEmail } from '../utils/mail.js';

const prisma = new PrismaClient();

export async function createGroup({ name, memberEmails, createdById, createdByName }) {
  const group = await prisma.group.create({
    data: {
      name,
      createdById,
      members: {
        create: { userId: createdById },
      },
    },
  });

  const invites = [];
  const uniqueEmails = [...new Set(memberEmails.filter((e) => e))];

  for (const email of uniqueEmails) {
    const token = uuidv4();
    const invite = await prisma.groupInvite.create({
      data: {
        groupId: group.id,
        email,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const acceptLink = `${process.env.CLIENT_URL || 'http://localhost:5174'}/invite?token=${token}`;
    await sendGroupInviteEmail(email, createdByName, name, acceptLink).catch(() => {});
    invites.push({ email, token: invite.token });
  }

  return { id: group.id, name: group.name, invites };
}

export async function getGroupsForUser(userId) {
  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    include: {
      group: {
        include: {
          members: { select: { userId: true } },
          expenses: {
            select: { id: true, paidById: true, amount: true, splits: { select: { userId: true, amount: true } } },
          },
        },
      },
    },
  });

  return memberships.map(({ group }) => {
    let userNetBalance = 0;
    for (const expense of group.expenses) {
      const paid = expense.paidById === userId ? Number(expense.amount) : 0;
      const owed = expense.splits
        .filter((s) => s.userId === userId)
        .reduce((sum, s) => sum + Number(s.amount), 0);
      userNetBalance += paid - owed;
    }

    return {
      id: group.id,
      name: group.name,
      createdAt: group.createdAt,
      memberCount: group.members.length,
      userNetBalance,
    };
  });
}

export async function getGroupById(groupId) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!group) throw new AppError('Group not found', 404);

  return {
    id: group.id,
    name: group.name,
    createdAt: group.createdAt,
    members: group.members.map((m) => m.user),
  };
}

export async function inviteMember({ groupId, email, invitedByName }) {
  const existingMember = await prisma.user.findUnique({ where: { email } });
  if (existingMember) {
    const alreadyMember = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: existingMember.id } },
    });
    if (alreadyMember) throw new AppError('User is already a member', 409);
  }

  const existingInvite = await prisma.groupInvite.findUnique({
    where: { groupId_email: { groupId, email } },
  });
  if (existingInvite && !existingInvite.accepted) {
    throw new AppError('Invite already sent to this email', 409);
  }

  const group = await prisma.group.findUnique({ where: { id: groupId }, select: { name: true } });

  const token = uuidv4();
  await prisma.groupInvite.create({
    data: {
      groupId,
      email,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const acceptLink = `${process.env.CLIENT_URL || 'http://localhost:5174'}/invite?token=${token}`;
  await sendGroupInviteEmail(email, invitedByName, group.name, acceptLink).catch(() => {});

  return { message: 'Invite sent', email };
}

export async function acceptInvite({ token, userId }) {
  const invite = await prisma.groupInvite.findUnique({ where: { token } });
  if (!invite) throw new AppError('Invalid or expired invite', 404);
  if (invite.accepted) throw new AppError('Invite already accepted', 409);
  if (new Date() > invite.expiresAt) throw new AppError('Invite has expired', 410);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.email !== invite.email) {
    throw new AppError('This invite was sent to a different email', 403);
  }

  const existingMember = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: invite.groupId, userId } },
  });
  if (existingMember) throw new AppError('Already a member', 409);

  await prisma.$transaction([
    prisma.groupMember.create({
      data: { groupId: invite.groupId, userId },
    }),
    prisma.groupInvite.update({
      where: { id: invite.id },
      data: { accepted: true },
    }),
  ]);

  const group = await prisma.group.findUnique({
    where: { id: invite.groupId },
    select: { id: true, name: true },
  });

  return { message: 'Joined group', group };
}

export async function getPendingInvites(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  const invites = await prisma.groupInvite.findMany({
    where: {
      email: user.email,
      accepted: false,
      expiresAt: { gt: new Date() },
    },
    include: {
      group: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return invites.map((i) => ({
    id: i.id,
    token: i.token,
    groupId: i.group.id,
    groupName: i.group.name,
    createdAt: i.createdAt,
  }));
}
