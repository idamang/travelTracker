import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../authmiddleware';
import asyncLocalStorage, { setCurrentUserId } from '../requestContext';

jest.mock('../requestContext', () => ({
  setCurrentUserId: jest.fn(),
  getCurrentUserId: jest.fn(),
  default: {
    getStore: jest.fn(),
    run: jest.fn(),
  },
}));

const SECRET_KEY = process.env.SECRET_KEY ?? 'P7X36D@FNsk!UfamJEdAGryH4S!PEUGs9bMaYfBkgA62YDj@g!F6EwaX7ZNJVMqBmGgzLVeyma3kps!QcrE46BjTrQx@NpPuhbeXBv4jSyW!zn';

interface AuthenticatedRequest extends Request {
  userId?: number;
}

describe('authMiddleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should set userId and call setCurrentUserId when token is valid', () => {
    const token = jwt.sign({ userId: 123 }, SECRET_KEY);
    req.headers = req.headers || {};
    req.headers.authorization = `Bearer ${token}`;

    authMiddleware(req as AuthenticatedRequest, res as Response, next);

    expect(req.userId).toBe(123);
    expect(setCurrentUserId).toHaveBeenCalledWith(123);
    expect(next).toHaveBeenCalled();
  });

  it('should set userId to undefined and call setCurrentUserId with undefined when token is invalid', () => {
    req.headers = req.headers || {};
    req.headers.authorization = 'Bearer invalidtoken';

    authMiddleware(req as AuthenticatedRequest, res as Response, next);

    expect(req.userId).toBeUndefined();
    expect(setCurrentUserId).toHaveBeenCalledWith(undefined);
    expect(next).toHaveBeenCalled();
  });

  it('should set userId to undefined and call setCurrentUserId with undefined when no authorization header is provided', () => {
    authMiddleware(req as AuthenticatedRequest, res as Response, next);

    expect(req.userId).toBeUndefined();
    expect(setCurrentUserId).toHaveBeenCalledWith(undefined);
    expect(next).toHaveBeenCalled();
  });
});
