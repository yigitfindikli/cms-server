import { NextFunction, Request, Response } from 'express';
import { findAll, findUserById, removeUser, saveUser, findUserByEmail, findUserWithPassword, isPasswordValid } from '../services/user.service';
import ApiError from '../utils/apiError';
import { INVALID_CREDENTIAL, USER_DOESNT_EXISTS } from '../data/errors';
import { hashPassword } from '../utils/crypto';

export const all = async (request: Request, response: Response, next: NextFunction) => {
    const data = await findAll();
    return response.send(data);
};

export const one = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;

    const user = await findUserById(id);

    if (!user) {
        return next(new ApiError(USER_DOESNT_EXISTS));
    }
    return user;
};

export const remove = async (request: Request, response: Response, next: NextFunction) => {
    const user = response.locals.user;
    const email = request.body.email;

    const userToRemove = await findUserByEmail(email);

    if (user.id !== userToRemove?.id) {
        return next(new ApiError(INVALID_CREDENTIAL));
    }

    if (!userToRemove) {
        return next(new ApiError(USER_DOESNT_EXISTS));
    }

    await removeUser(userToRemove);

    return response.send(userToRemove.id);
};

export const testResponse = async (request: Request, response: Response, next: NextFunction) => {
    const user = response.locals.user;

    if (!user) {
        return next(new ApiError(USER_DOESNT_EXISTS));
    }

    response.send(user);
};

export const changeName = async (request: Request, response: Response, next: NextFunction) => {
    const user = response.locals.user;
    const { firstName, lastName } = request.body;

    if (!user) {
        return next(new ApiError(USER_DOESNT_EXISTS));
    }

    user.firstName = firstName;
    user.lastName = lastName;

    await saveUser(user);

    response.status(200).send({ success: true });
};

export const changeEmail = async (request: Request, response: Response, next: NextFunction) => {
    const localUser = response.locals.user;
    const { email, password } = request.body;
    const user = await findUserWithPassword(localUser.email);

    if (!user) {
        return next(new ApiError(USER_DOESNT_EXISTS));
    }

    if (!isPasswordValid(password, user.password)) {
        return next(new ApiError(INVALID_CREDENTIAL));
    }

    user.email = email;

    await saveUser(user);

    response.status(200).send({ success: true });
};

export const changePassword = async (request: Request, response: Response, next: NextFunction) => {
    const localUser = response.locals.user;
    const user = await findUserWithPassword(localUser.email);

    const { password, newPassword } = request.body;

    if (!user) {
        return next(new ApiError(USER_DOESNT_EXISTS));
    }

    if (!isPasswordValid(password, user.password)) {
        return next(new ApiError(INVALID_CREDENTIAL));
    }

    user.password = await hashPassword(newPassword);

    await saveUser(user);

    response.status(200).send({ success: true });
};
