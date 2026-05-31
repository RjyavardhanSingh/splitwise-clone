import { body } from 'express-validator';

export const createGroupValidation = [
  body('name').trim().notEmpty().withMessage('Group name is required'),
  body('memberEmails').isArray({ min: 1 }).withMessage('At least one member email is required'),
  body('memberEmails.*').isEmail().withMessage('Each member must have a valid email'),
];

export const addMemberValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const acceptInviteValidation = [
  body('token').trim().notEmpty().withMessage('Token is required'),
];
