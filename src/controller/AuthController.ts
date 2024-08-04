import { CookieOptions, NextFunction, Request, Response } from 'express';
import { User } from '../orm/entity/User';
import config from 'config';
import bcrypt from 'bcrypt';
import { signJwt, verifyJwt } from '../utils/jwt';
import { saveUser, findUserByEmail, findUserById, signTokens, findUserWithPassword, createUser, isPasswordValid } from '../services/user.service';
import { ApiError } from '../utils/apiError';
import { INVALID_CREDENTIAL, USER_DOESNT_EXISTS, REFRESH_TOKEN_NOT_FOUND, INVALID_REFRESH_TOKEN, USER_EXISTS, RESET_PASSWORD_TOKEN_EXPIRED } from '../data/errors';
import { LoginUserInput, RegisterUserInput } from '../schemas/user.schema';
import { generatePasswordResetToken, verifyPasswordResetToken } from '../utils/passwordReset';
import { RoleType } from '../enums/role';
import { findRoleByName } from '../services/role.service';

const passport = require('passport');

const cookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(Date.now() + 60 * 60 * 1000),
    maxAge: 60 * 60 * 1000
};

const refreshTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(Date.now() + 600 * 60 * 1000),
    maxAge: 600 * 60 * 1000
};

export const login = async (request: Request<{}, {}, LoginUserInput>, response: Response, next: NextFunction) => {
    let { email, password } = request.body;

    if (!(email && password)) {
        return next(new ApiError(INVALID_CREDENTIAL));
    }

    let user: User | null;

    user = await findUserByEmail(email);

    if (!user) {
        return next(new ApiError(INVALID_CREDENTIAL));
    }

    const userWithPassword = await findUserWithPassword(email);

    if (!userWithPassword) {
        return next(new ApiError(INVALID_CREDENTIAL));
    }

    if (!isPasswordValid(password, userWithPassword.password)) {
        return next(new ApiError(INVALID_CREDENTIAL));
    }

    const { access_token, refresh_token } = await signTokens(user);

    response.cookie('access_token', access_token, accessTokenCookieOptions);
    response.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
    response.cookie('logged_in', true, {
        ...accessTokenCookieOptions,
        httpOnly: true
    });

    return response.status(200).json({
        status: 'success',
        user: { userId: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, imgUrl: user.imgUrl, role: user.role }
    });
};

export const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email']
});

export const googleCallback = async (request: Request, response: Response, next: NextFunction) => {
    passport.authenticate('google', async (err: any, profile: User) => {
        if (err) {
            return next(err);
        }

        try {
            if (!profile) {
                return response.status(401).json({ error: 'Google authentication failed' });
            }

            const { access_token, refresh_token } = await signTokens(profile);

            response.cookie('access_token', access_token, accessTokenCookieOptions);
            response.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
            response.cookie('logged_in', true, {
                ...accessTokenCookieOptions,
                httpOnly: false
            });

            return response.redirect(301, config.get<string>('clientApp.rootUrl'));
        } catch (error) {
            return next(new ApiError(INVALID_CREDENTIAL));
        }
    })(request, response, next);
};

export const githubAuth = passport.authenticate('github', {
    scope: ['user:email']
});

export const githubCallback = async (request: Request, response: Response, next: NextFunction) => {
    passport.authenticate('github', async (err: any, profile: User) => {
        if (err) {
            return next(err);
        }

        try {
            if (!profile) {
                return response.status(401).json({ error: 'Github authentication failed' });
            }

            const { access_token, refresh_token } = await signTokens(profile);

            response.cookie('access_token', access_token, accessTokenCookieOptions);
            response.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
            response.cookie('logged_in', true, {
                ...accessTokenCookieOptions,
                httpOnly: false
            });

            return response.redirect(301, config.get<string>('clientApp.rootUrl'));
        } catch (error) {
            return next(new ApiError(INVALID_CREDENTIAL));
        }
    })(request, response, next);
};

export const register = async (request: Request<{}, {}, RegisterUserInput>, response: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = request.body;

    let user = await findUserByEmail(email);

    if (user) {
        return next(new ApiError(USER_EXISTS));
    }

    let hashedPassword = bcrypt.hashSync(password, 10);

    const writerRole = (await findRoleByName(RoleType.Writer)) || undefined;

    user = await createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: writerRole
    });

    return response.send({ status: 'success' });
};

export const refreshAccessToken = async (request: Request, response: Response, next: NextFunction) => {
    const refresh_token = request.cookies.refresh_token;

    if (!refresh_token) {
        return next(new ApiError(REFRESH_TOKEN_NOT_FOUND));
    }

    const decoded = verifyJwt<{ sub: string }>(refresh_token, 'refreshToken');

    if (!decoded) {
        return next(new ApiError(INVALID_REFRESH_TOKEN));
    }

    let user: User | null;

    user = await findUserById(decoded.sub);

    if (!user) {
        return next(new ApiError(INVALID_REFRESH_TOKEN));
    }

    const access_token = signJwt({ sub: user.id }, 'accessToken', {
        expiresIn: `${config.get<number>('accessTokenExpiresIn')}h`
    });

    response.cookie('access_token', access_token, accessTokenCookieOptions);
    response.cookie('logged_in', true, {
        ...accessTokenCookieOptions,
        httpOnly: false
    });

    response.status(200).json({
        status: 'success',
        access_token
    });
};

export const forgotPassword = async (request: Request, response: Response, next: NextFunction) => {
    const { email } = request.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return next(new ApiError(USER_DOESNT_EXISTS));
        }

        const token = generatePasswordResetToken(user.id);
        // const resetLink = `${config.get<string>('clientApp.rootUrl')}/auth/forgot-password?token=${token}`;

        user.resetPasswordToken = token;
        user.resetPasswordTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await saveUser(user);

        return response.status(200).json({
            status: 'success',
            message: token
        });
    } catch (error) {
        return next(new ApiError(RESET_PASSWORD_TOKEN_EXPIRED));
    }
};

export const resetPassword = async (request: Request, response: Response, next: NextFunction) => {
    const { token, password } = request.body;

    try {
        const userId = verifyPasswordResetToken(token);

        if (!userId) {
            return next(new ApiError(RESET_PASSWORD_TOKEN_EXPIRED));
        }

        const user = await findUserById(userId.toString());

        if (!user) {
            return next(new ApiError(USER_DOESNT_EXISTS));
        }

        if (!user.resetPasswordToken || !user.resetPasswordTokenExpiresAt) {
            return next(new ApiError(RESET_PASSWORD_TOKEN_EXPIRED));
        }

        if (user.resetPasswordToken !== token) {
            return next(new ApiError(RESET_PASSWORD_TOKEN_EXPIRED));
        }

        const currentTime = new Date();
        if (currentTime > user.resetPasswordTokenExpiresAt) {
            return next(new ApiError(RESET_PASSWORD_TOKEN_EXPIRED));
        }

        user.password = bcrypt.hashSync(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpiresAt = null;

        await saveUser(user);

        return response.status(200).json({
            status: 'success',
            message: 'Password reset successful'
        });
    } catch (error) {
        return next(new ApiError(RESET_PASSWORD_TOKEN_EXPIRED));
    }
};

export const logout = (request: Request, response: Response, next: NextFunction) => {
    response.cookie('access_token', '', { maxAge: 1 });
    response.cookie('refresh_token', '', { maxAge: 1 });
    response.cookie('logged_in', '', { maxAge: 1 });

    return response.status(200).json({
        status: 'success'
    });
};

export const me = async (request: Request, response: Response, next: NextFunction) => {
    const user: User = response.locals.user;

    if (!user) return next(new ApiError(USER_DOESNT_EXISTS));

    return response.status(200).json({
        status: 'success',
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imgUrl: user.imgUrl,
            socialLoggedIn: user.githubId || user.googleId,
            role: user.role
        }
    });
};
