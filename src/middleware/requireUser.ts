import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/apiError';
import { USER_IS_NOT_ACTIVE } from '../data/errors';

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;

        if (!user) {
            return next(new ApiError(USER_IS_NOT_ACTIVE));
        }

        next();
    } catch (err: any) {
        next(err);
    }
};
