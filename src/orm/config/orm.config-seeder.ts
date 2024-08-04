import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { AppDataSource } from './orm.config';
import UserSeeder from '../seeds/user.seed';
import PostSeeder from '../seeds/post.seed';
import RoleSeeder from '../seeds/role.seed';

const runAllSeeders = async (dataSource: DataSource) => {
    try {
        await runSeeders(dataSource, {
            seeds: [UserSeeder, PostSeeder, RoleSeeder]
        });
        console.log('Seeders have been run successfully!');
    } catch (error) {
        console.error('Error running seeders:', error);
    }
};

AppDataSource.initialize()
    .then(async () => {
        console.log('Data Source has been initialized!');
        await runAllSeeders(AppDataSource);
        console.log('All seeders have been executed!');
    })
    .catch((error) => console.error('Error during Data Source initialization:', error));
