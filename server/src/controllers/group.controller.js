import asyncHandler from '../utils/asyncHandler.js';
import * as groupService from '../services/group.service.js';

export const create = asyncHandler(async (req, res) => {
  const group = await groupService.createGroup({
    ...req.body,
    createdById: req.user.id,
    createdByName: req.user.name,
  });
  res.status(201).json(group);
});

export const list = asyncHandler(async (req, res) => {
  const groups = await groupService.getGroupsForUser(req.user.id);
  res.json(groups);
});

export const getById = asyncHandler(async (req, res) => {
  const group = await groupService.getGroupById(req.params.id);
  res.json(group);
});

export const inviteMember = asyncHandler(async (req, res) => {
  const result = await groupService.inviteMember({
    groupId: req.params.id,
    email: req.body.email,
    invitedByName: req.user.name,
  });
  res.status(201).json(result);
});

export const acceptInvite = asyncHandler(async (req, res) => {
  const result = await groupService.acceptInvite({
    token: req.body.token,
    userId: req.user.id,
  });
  res.json(result);
});

export const getPendingInvites = asyncHandler(async (req, res) => {
  const invites = await groupService.getPendingInvites(req.user.id);
  res.json(invites);
});
