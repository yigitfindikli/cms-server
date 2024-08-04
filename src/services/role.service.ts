import { Role } from '../orm/entity/Role';
import { AppDataSource } from '../orm/config/orm.config';
import { RoleType } from '../enums/role';

const roleRepository = AppDataSource.getRepository(Role);

export const saveRole = async (input: Partial<Role>) => {
    return await roleRepository.save(input);
};

export const createRole = async (input: Partial<Role>) => {
    let role = roleRepository.create(input);
    return await saveRole(role);
};

export const removeRole = async (input: Role) => {
    return await roleRepository.remove(input);
};

export const findRoleByName = async (name: RoleType) => {
    return await roleRepository.findOne({
        where: { name }
    });
};

export const findRoleById = async (id: string) => {
    return await roleRepository.findOne({
        where: { id: +id }
    });
};

export const findAllRoles = async () => {
    return await roleRepository.find();
};
