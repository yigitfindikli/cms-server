import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const repository = dataSource.getRepository(User);

        const user = await repository.findOne({
            where: { email: 'yolo.yoko@gmail.com' }
        });

        if (user) {
            console.warn('Seed user already exists');
            return;
        }

        await repository.insert([
            {
                firstName: 'Yolo',
                lastName: 'Yoko',
                email: 'yolo.yoko@gmail.com',
                password: bcrypt.hashSync('password', 10)
            }
        ]);
    }
}
