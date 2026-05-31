import { Router } from 'express';
import { register, login, googleAuth, verifyEmail, me, updateProfile, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import validate from '../utils/validate.js';
import {
  registerValidation,
  loginValidation,
  googleAuthValidation,
  verifyEmailValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
} from '../validators/auth.validators.js';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/verify-email', verifyEmailValidation, validate, verifyEmail);
router.post('/login', loginValidation, validate, login);
router.post('/google', googleAuthValidation, validate, googleAuth);
router.get('/me', requireAuth, me);
router.put('/profile', requireAuth, updateProfileValidation, validate, updateProfile);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);

export default router;
