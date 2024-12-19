import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(new ApiError(400, 'Validation error', error));
    }
  };
}; 