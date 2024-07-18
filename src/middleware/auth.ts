import { Request, Response, NextFunction } from 'express';
import { allowedOrigins } from '../../index';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization === process.env.AUTH_TOKEN &&
    allowedOrigins.includes(req.headers.origin as string)
  ) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};
