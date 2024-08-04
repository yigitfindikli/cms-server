export const INVALID_CREDENTIAL = {
    name: 'invalidCredential',
    message: 'Credentials are missing.',
    statusCode: 401
};

export const INVALID_PASSWORD = {
    name: 'invalidPassword',
    message: 'You entered the wrong password',
    statusCode: 401
};

export const USER_DOESNT_EXISTS = {
    name: 'userDoesntExist',
    message: 'Account not found',
    statusCode: 401
};

export const REFRESH_TOKEN_NOT_FOUND = {
    name: 'refreshTokenNotFound',
    message: 'Refresh token not found.',
    statusCode: 403
};

export const INVALID_REFRESH_TOKEN = {
    name: 'invalidRefreshToken',
    message: 'Refresh token not valid.',
    statusCode: 403
};

export const ACCESS_TOKEN_NOT_FOUND = {
    name: 'accessTokenNotFound',
    message: 'Access token not found.',
    statusCode: 403
};

export const INVALID_ACCESS_TOKEN = {
    name: 'invalidAccessToken',
    message: 'Access token not valid.',
    statusCode: 403
};

export const USER_EXISTS = {
    name: 'userExist',
    message: 'This account already exists.',
    statusCode: 401
};

export const ROLE_DOESNT_EXIST = {
    name: 'roleDoesntExist',
    message: 'Role does not exist',
    statusCode: 401
};

export const ROLE_ALREADY_EXISTS = {
    name: 'roleAlreadyExists',
    message: 'Role already exists',
    statusCode: 401
};

export const INVALID_TOKEN = {
    name: 'invalidToken',
    message: 'Invalid or expired link'
};

export const EMAIL_VERIFY_TEMPLATE_ERROR = {
    name: 'emailVerifyTemplateError',
    message: 'Email template could not be created'
};

export const NO_AUTHORIZATION = {
    name: 'noAuthorization',
    message: 'You do not have permission for this operation.',
    statusCode: 401
};

export const RESET_PASSWORD_TOKEN_EXPIRED = {
    name: 'resetPasswordTokenExpired',
    message: 'Your password reset period has expired. Please request a reset again.',
    statusCode: 401
};

export const INVITE_EXPIRED = {
    name: 'inviteExpired',
    message: 'Your invite period has expired. Please request a new invite.',
    statusCode: 401
};

export const EMAIL_VERIFY_TOKEN_EXPIRED = {
    name: 'emailVerifyTokenExpired',
    message: 'Your email verification period has expired'
};

export const USER_IS_NOT_ACTIVE = {
    name: 'userIsNotActive',
    message: "Session has expired or user doesn't exist.",
    statusCode: 400
};

export const USER_IS_NOT_NEW = {
    name: 'userIsNotActive',
    message: 'This account is not in new status'
};

export const TOKEN_EXPIRED = {
    name: 'tokenExpired',
    message: 'This page is not active. Your operation time has expired.'
};

export const OLD_PASSWORD_NOT_MATCHED = {
    name: 'oldPasswordNotMatch',
    message: 'You entered your old password incorrectly'
};
