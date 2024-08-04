import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Post } from '../entity/Post';
import { User } from '../entity/User';

export default class PostSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const postRepository = dataSource.getRepository(Post);
        const userRepository = dataSource.getRepository(User);

        const author = await userRepository.findOne({
            where: { email: 'yolo.yoko@gmail.com' }
        });

        if (!author) {
            console.warn('Author user does not exist');
            return;
        }

        // Create 20 mock posts
        const posts = Array.from({ length: 20 }, (_, i) => ({
            title: `Post ${i + 1}`,
            content: `This is the content for Post ${i + 1}`,
            author: author
        }));

        await postRepository.insert(posts);
    }
}
