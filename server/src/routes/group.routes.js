import { Router } from 'express';
import { create, list, getById, inviteMember, acceptInvite, getPendingInvites } from '../controllers/group.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import requireGroupMember from '../middleware/requireGroupMember.js';
import { createGroupValidation, addMemberValidation, acceptInviteValidation } from '../validators/group.validators.js';
import validate from '../utils/validate.js';

const router = Router();

router.get('/', requireAuth, list);
router.post('/', requireAuth, createGroupValidation, validate, create);
router.get('/invites', requireAuth, getPendingInvites);
router.post('/accept-invite', requireAuth, acceptInviteValidation, validate, acceptInvite);
router.get('/:id', requireAuth, requireGroupMember('id'), getById);
router.post('/:id/members', requireAuth, requireGroupMember('id'), addMemberValidation, validate, inviteMember);

export default router;
