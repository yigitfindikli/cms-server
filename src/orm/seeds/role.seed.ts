import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../entity/Role';
import { RoleType } from '../../enums/role';

export default class RoleSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<void> {
        const roleRepository = dataSource.getRepository(Role);

        const rolesToAdd: Role[] = [];

        for (const role of Object.values(RoleType)) {
            const existingRole = await roleRepository.findOne({
                where: { name: role }
            });

            if (!existingRole) {
                rolesToAdd.push(roleRepository.create({ name: role }));
            }
        }

        if (rolesToAdd && rolesToAdd.length > 0) {
            await roleRepository.insert(rolesToAdd);
        } else {
            console.warn('All roles already exist');
        }
    }
}
