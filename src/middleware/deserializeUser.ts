import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import { ApiError } from '../utils/apiError';
import { ACCESS_TOKEN_NOT_FOUND, INVALID_ACCESS_TOKEN, USER_DOESNT_EXISTS } from '../data/errors';
import { findUser, findUserById } from '../services/user.service';

export const deserializeUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        let access_token;

        if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
            access_token = request.headers.authorization.split(' ')[1];
        } else if (request.cookies.access_token) {
            access_token = request.cookies.access_token;
        }

        if (!access_token) {
            return next(new ApiError(ACCESS_TOKEN_NOT_FOUND));
        }

        const decoded = verifyJwt<{ sub: string }>(access_token, 'accessToken');

        if (!decoded) {
            return next(new ApiError(INVALID_ACCESS_TOKEN));
        }

        const user = await findUserById(decoded.sub);

        if (!user) {
            return next(new ApiError(USER_DOESNT_EXISTS));
        }

        response.locals.user = user;

        next();
    } catch (err: any) {
        return next(new ApiError(USER_DOESNT_EXISTS));
    }
};
