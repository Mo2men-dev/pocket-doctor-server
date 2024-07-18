import { Request, Response, NextFunction } from 'express';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization === process.env.AUTH_TOKEN) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};
