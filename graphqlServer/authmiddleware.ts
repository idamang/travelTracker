import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { setCurrentUserId } from './requestContext';

const SECRET_KEY = process.env.SECRET_KEY ?? 'P7X36D@FNsk!UfamJEdAGryH4S!PEUGs9bMaYfBkgA62YDj@g!F6EwaX7ZNJVMqBmGgzLVeyma3kps!QcrE46BjTrQx@NpPuhbeXBv4jSyW!zn';

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };
      req.userId = decoded.userId;
      setCurrentUserId(decoded.userId);
    } catch (error) {
      console.warn('Invalid token');
      req.userId = undefined;
      setCurrentUserId(undefined);
    }
  } else {
    console.info('No Authorization header provided');
    req.userId = undefined;
    setCurrentUserId(undefined);
  }

  next();
};
