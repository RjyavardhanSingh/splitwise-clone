import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../utils/AppError.js';
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/mail.js';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sanitize(user) {
  return { id: user.id, name: user.name, email: user.email, isVerified: user.isVerified, authProvider: user.authProvider };
}

export async function registerUser({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use', 409);

  const hashed = await bcrypt.hash(password, 10);
  const code = generateCode();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      isVerified: false,
      verificationCode: code,
      verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await sendVerificationEmail(email, name, code);

  return { message: 'Account created. Check your email for verification code.', userId: user.id };
}

export async function verifyEmail({ userId, code }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  if (user.isVerified) throw new AppError('Already verified', 400);
  if (user.verificationCode !== code) throw new AppError('Invalid code', 400);
  if (user.verificationCodeExpiry < new Date()) throw new AppError('Code expired', 400);

  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true, verificationCode: null, verificationCodeExpiry: null },
  });

  const token = generateToken(user);
  return { token, user: sanitize({ ...user, isVerified: true }) };
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);
  if (!user.password) throw new AppError('This account uses Google Sign-In. Set a password via "Forgot Password" first.', 400);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid credentials', 401);

  const token = generateToken(user);
  return { token, user: sanitize(user) };
}

export async function loginOrRegisterWithGoogle({ idToken }) {
  const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();

  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name;

  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    if (user.authProvider === 'email' && !user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, authProvider: 'google', isVerified: true },
      });
    }
  } else {
    user = await prisma.user.create({
      data: { name, email, googleId, authProvider: 'google', isVerified: true },
    });
  }

  const token = generateToken(user);
  return { token, user: sanitize(user) };
}

export async function updateProfile(userId, { name, currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  const data = {};

  if (name && name !== user.name) {
    data.name = name;
  }

  if (currentPassword && newPassword) {
    if (user.authProvider === 'google') throw new AppError('Google accounts use SSO. Cannot change password.', 400);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw new AppError('Current password is incorrect', 400);
    data.password = await bcrypt.hash(newPassword, 10);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, isVerified: true, authProvider: true },
  });

  return updated;
}

export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, isVerified: true, authProvider: true, createdAt: true },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
}

export async function forgotPassword({ email }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { message: 'If the account exists, a reset code has been sent.' };

  const code = generateCode();
  const resetToken = uuidv4();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
      verificationCode: code,
      verificationCodeExpiry: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  await sendResetPasswordEmail(email, code);

  return { message: 'If the account exists, a reset code has been sent.', resetToken };
}

export async function resetPassword({ email, code, newPassword }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid request', 400);
  if (user.verificationCode !== code) throw new AppError('Invalid code', 400);
  if (user.verificationCodeExpiry < new Date()) throw new AppError('Code expired', 400);

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      authProvider: 'email',
      verificationCode: null,
      verificationCodeExpiry: null,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: 'Password reset successful. You can now log in.' };
}
