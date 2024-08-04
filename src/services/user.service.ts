import config from 'config';
import { signJwt } from '../utils/jwt';
import { User } from '../orm/entity/User';
import { AppDataSource } from '../orm/config/orm.config';
import { checkPassword } from '../utils/crypto';
import { removePostsByAuthor } from './post.service';

const userRepository = AppDataSource.getRepository(User);

export const saveUser = async (input: Partial<User>) => {
    return await userRepository.save(input);
};

export const createUser = async (input: Partial<User>) => {
    let user = userRepository.create(input);

    return await saveUser(user);
};

export const removeUser = async (input: User) => {
    removePostsByAuthor(input.id);
    return await userRepository.remove(input);
};

export const isPasswordValid = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return checkPassword(plainPassword, hashedPassword);
};

export const findUserByEmail = async (email: string) => {
    return await userRepository.findOne({
        where: { email: email },
        relations: ['role']
    });
};

export const findUserWithPassword = async (email: string) => {
    return await userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password'],
        relations: ['role']
    });
};

export const findUserById = async (userId: string) => {
    return await userRepository.findOne({
        where: { id: +userId },
        relations: ['role']
    });
};

export const findUser = async (query: Object) => {
    return await userRepository.findOneBy(query);
};

export const findAll = async () => {
    return await userRepository.find();
};

export const signTokens = async (user: User) => {
    const access_token = signJwt({ sub: user.id }, 'accessToken', {
        expiresIn: `${config.get<number>('accessTokenExpiresIn')}h`
    });

    const refresh_token = signJwt({ sub: user.id }, 'refreshToken', {
        expiresIn: `${config.get<number>('refreshTokenExpiresIn')}d`
    });

    return { access_token, refresh_token };
};
