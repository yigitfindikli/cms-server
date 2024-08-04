import { Router } from 'express';

import { login, logout, refreshAccessToken, register, me, googleCallback, googleAuth, githubCallback, githubAuth, forgotPassword, resetPassword } from '../controller/AuthController';
import { validate } from '../middleware/zodValidation';
import { registerUserSchema, loginUserSchema } from '../schemas/user.schema';
import { deserializeUser } from '../middleware/deserializeUser';

const router = Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);
router.get('/me', deserializeUser, me);

router.post('/login', validate(loginUserSchema), login);
router.post('/register', validate(registerUserSchema), register);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

export default router;
