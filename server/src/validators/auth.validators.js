import { body } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const verifyEmailValidation = [
  body('userId').isUUID().withMessage('Valid user ID is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Valid verification code is required'),
];

export const googleAuthValidation = [
  body('idToken').notEmpty().withMessage('Google ID token is required'),
];

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const resetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Valid code is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('currentPassword').optional(),
  body('newPassword').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
