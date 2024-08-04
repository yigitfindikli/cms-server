import { sign, verify } from 'jsonwebtoken';
import config from 'config';

const passwordResetTokenSecret: string = config.get('passwordResetTokenSecret');
const passwordResetTokenExpiresIn: string = config.get('passwordResetTokenExpiresIn');

export const generatePasswordResetToken = (userId: number): string => {
    const token = sign({ userId }, passwordResetTokenSecret, { expiresIn: `${passwordResetTokenExpiresIn}m` });
    return token;
};

export const verifyPasswordResetToken = (token: string): number | null => {
    try {
        const decoded: any = verify(token, passwordResetTokenSecret);
        if (decoded && decoded.userId) {
            return decoded.userId;
        }
        return null;
    } catch (error) {
        return null;
    }
};
