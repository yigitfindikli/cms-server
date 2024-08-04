import { Post } from '../orm/entity/Post';
import { User } from '../orm/entity/User';
import { AppDataSource } from '../orm/config/orm.config';

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export const savePost = async (input: Partial<Post>) => {
    return await postRepository.save(input);
};

export const createPost = async (title: string, content: string, userId: number) => {
    const author = await userRepository.findOne({ where: { id: userId } });
    if (!author) throw new Error('User not found');

    const post = await postRepository.create({ title, content, author });
    return await savePost(post);
};

export const removePost = async (input: Post) => {
    return await postRepository.remove(input);
};

export const findPostById = async (postId: number) => {
    return await postRepository.findOne({
        where: { id: postId },
        relations: ['author']
    });
};

export const removePostsByAuthor = async (userId: number) => {
    return await postRepository.delete({ author: { id: userId } });
};

export const findPosts = async (query: Object) => {
    return await postRepository.find(query);
};

export const findAllPosts = async () => {
    return await postRepository.find();
};

export const findPostsByAuthor = async (userId: number) => {
    return await postRepository.find({ where: { author: { id: userId } } });
};

export const updatePost = async (postId: number, title: string, content: string) => {
    const post = await postRepository.findOne({ where: { id: postId } });
    if (!post) throw new Error('Post not found');

    post.title = title;
    post.content = content;
    return await savePost(post);
};
