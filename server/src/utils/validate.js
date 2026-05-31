import { validationResult } from 'express-validator';
import AppError from './AppError.js';

export default function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError(errors.array()[0].msg, 400);
  next();
}
