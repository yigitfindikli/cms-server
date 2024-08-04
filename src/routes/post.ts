import { Router } from 'express';
import { createPostController, getPostsController, getPostByIdController, updatePostController, deletePostController } from '../controller/PostController';
import { requireUser } from '../middleware/requireUser';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireNotReader, requirePostAuthorOrAdmin } from '../middleware/roleValidations';

const router = Router();

router.get('/', getPostsController);
router.get('/:id', getPostByIdController);

router.use(deserializeUser, requireUser);
router.post('/', requireNotReader, createPostController);

router.put('/:id', requirePostAuthorOrAdmin, updatePostController);
router.delete('/:id', deletePostController);

export default router;
