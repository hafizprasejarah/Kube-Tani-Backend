import express from 'express';
import userController from '../controller/user_controller.js';
import { authMiddleware } from '../middleware/auth_middleware.js';

const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

userRouter.post('/api/users', userController.register);
userRouter.post('/api/users/login', userController.login);


export {
    userRouter
};
