import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
};

const checkPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
};

const hashPasswordSync = (password: string): string => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
};

const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);

    return isMatch;
};

const generateGuid = (): string => {
    return uuidv4();
};

interface GenerateCodeOptions {
    onlyNumber?: boolean;
    length?: number;
    suffix?: string | null;
    prefix?: string | null;
}

const generateCode = (
    opt: GenerateCodeOptions = {
        onlyNumber: false,
        length: 11,
        suffix: null,
        prefix: null
    }
): string => {
    let { onlyNumber, length, suffix, prefix } = opt;

    if (!length) length = 11;

    let code = Math.random()
        .toString(onlyNumber ? 10 : 36)
        .substring(13 - length);

    if (suffix) {
        code = code + suffix;
    }

    if (prefix) {
        code = prefix + code;
    }

    return code;
};

export { generateGuid, generateCode, hashPassword, hashPasswordSync, comparePassword, checkPassword };
