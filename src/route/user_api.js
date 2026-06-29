import express from 'express';
import userController from '../controller/user_controller.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleMiddleware } from "../middleware/role_middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.get('/api/users/current', roleMiddleware('ADMIN'), userController.get);
userRouter.patch('/api/users/current', roleMiddleware('ADMIN'), userController.update);
userRouter.delete('/api/users/logout', roleMiddleware('ADMIN'), userController.logout);

export {
    userRouter
};
