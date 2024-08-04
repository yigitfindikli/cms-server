import { Request, Response, NextFunction, response } from 'express';
import { createPost, findAllPosts, findPostById, updatePost, removePost, findPostsByAuthor } from '../services/post.service';
import ApiError from '../utils/apiError';
import { NO_AUTHORIZATION } from '../data/errors';

export const createPostController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content } = req.body;
        const userId = res.locals.user.id;
        const post = await createPost(title, content, userId);
        res.status(201).json(post);
    } catch (error) {
        next(new ApiError(NO_AUTHORIZATION));
    }
};

export const getPostsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.query?.userId;

        if (userId) {
            const posts = await findPostsByAuthor(+userId);
            return res.json(posts);
        }

        const posts = await findAllPosts();
        res.json(posts);
    } catch (error) {
        next(new ApiError(NO_AUTHORIZATION));
    }
};

export const getPostsByAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await findAllPosts();
        res.json(posts);
    } catch (error) {
        next(new ApiError(NO_AUTHORIZATION));
    }
};

export const getPostByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const post = await findPostById(postId);
        if (!post) {
            return next(new ApiError(NO_AUTHORIZATION));
        }

        res.json(post);
    } catch (error) {
        next(new ApiError(NO_AUTHORIZATION));
    }
};

export const updatePostController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, title } = res.locals.post;
        const { content } = req.body;

        console.log(content);

        const post = await updatePost(id, title, content);

        res.json(post);
    } catch (error) {
        next(new ApiError(NO_AUTHORIZATION));
    }
};

export const deletePostController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const post = await findPostById(postId);

        if (!post) {
            return next(new ApiError(NO_AUTHORIZATION));
        }

        await removePost(post);
        res.status(204).send();
    } catch (error) {
        next(new ApiError(NO_AUTHORIZATION));
    }
};
