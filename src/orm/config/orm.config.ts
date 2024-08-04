import { DataSource } from 'typeorm';
import config from 'config';

export const AppDataSource = new DataSource({
    ...config.get('db.config'),
    entities: config.get('db.typeorm.entities'),
    migrations: config.get('db.typeorm.migrations'),
    subscribers: []
});
