import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export default function requireAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
    next();
  } catch {
    throw new AppError('Unauthorized', 401);
  }
}
