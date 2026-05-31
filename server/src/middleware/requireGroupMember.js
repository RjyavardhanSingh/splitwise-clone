import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

export default function requireGroupMember(paramName = 'groupId') {
  return async (req, _res, next) => {
    const groupId = req.params[paramName];
    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: req.user.id } },
    });
    if (!membership) {
      throw new AppError('Forbidden', 403);
    }
    next();
  };
}
