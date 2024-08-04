import { AppDataSource } from './orm/config/orm.config';
import config from 'config';
import app from './app';

console.log('Starting server...');
const PORT = config.get<number>('server.port');

AppDataSource.initialize()
    .then(async () => {
        console.log('Database connection success');
    })
    .catch((err) => {
        console.log('Database Connection Failed!', err);
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.error(err));
