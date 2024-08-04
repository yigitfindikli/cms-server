import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/apiError';
import { NO_AUTHORIZATION } from '../data/errors';
import { RoleType } from '../enums/role';
import { findPostById } from '../services/post.service';
import { User } from '../orm/entity/User';

export const requireAdmin = (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = response.locals.user;

        if (!user || user.role.name !== RoleType.Admin) {
            return next(new ApiError(NO_AUTHORIZATION));
        }

        next();
    } catch (err: any) {
        return next(new ApiError(NO_AUTHORIZATION));
    }
};

export const requireNotReader = (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = response.locals.user;

        if (!user || user.role.name === RoleType.Reader) {
            return next(new ApiError(NO_AUTHORIZATION));
        }

        next();
    } catch (err: any) {
        return next(new ApiError(NO_AUTHORIZATION));
    }
};

export const requirePostAuthorOrAdmin = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = response.locals.user;

        const postId = parseInt(request.params.id, 10);
        const post = await findPostById(postId);
        if (!post) {
            return next(new ApiError(NO_AUTHORIZATION));
        }

        if (user.role.name === RoleType.Admin || post.author.id === user.id) {
            response.locals.post = post;

            return next();
        }

        return next(new ApiError(NO_AUTHORIZATION));
    } catch (err: any) {
        return next(new ApiError(NO_AUTHORIZATION));
    }
};

export const requireSelfOrAdmin = (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = response.locals.user;

        const { email } = request.body;
        if (user.role.name === RoleType.Admin || email === user.email) {
            return next();
        }

        return next(new ApiError(NO_AUTHORIZATION));
    } catch (err: any) {
        return next(new ApiError(NO_AUTHORIZATION));
    }
};
