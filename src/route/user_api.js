import express from 'express';
import userController from '../controller/user_controller.js';
import messageController from '../controller/user_message_controller.js';
import adminMessageController from '../controller/admin_message_controller.js';
import adminController from '../controller/admin_controller.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleMiddleware } from "../middleware/role_middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// =====================//
//        USER         //
// =====================//

userRouter.get("/api/users/current", roleMiddleware("USER"), userController.get);
userRouter.patch("/api/users/current", roleMiddleware("USER"), userController.update);
userRouter.delete("/api/users/logout", roleMiddleware("USER"), userController.logout);

userRouter.post('/api/messages', roleMiddleware('USER'), messageController.create);
userRouter.get('/api/messages', roleMiddleware('USER'), messageController.get);


// =====================//
//        ADMIN         //
// =====================//

userRouter.get("/api/admin/current", roleMiddleware("ADMIN"), adminController.get);
userRouter.patch("/api/admin/current", roleMiddleware("ADMIN"), adminController.update);
userRouter.delete("/api/admin/logout", roleMiddleware("ADMIN"), adminController.logout);
userRouter.get("/api/admin/users", roleMiddleware("ADMIN"), adminController.getAllUsers);
userRouter.get("/api/admin/users/:userId", roleMiddleware("ADMIN"), adminController.getUserById);
userRouter.patch("/api/admin/users/:userId", roleMiddleware("ADMIN"), adminController.updateUserById);
userRouter.delete("/api/admin/users/:userId", roleMiddleware("ADMIN"), adminController.deleteUserById);
userRouter.patch("/api/admin/users/:userId/activate", roleMiddleware("ADMIN"), adminController.activateUser);
userRouter.patch("/api/admin/users/:userId/deactivate", roleMiddleware("ADMIN"), adminController.deactivateUser);

userRouter.get('/api/admin/messages', roleMiddleware('ADMIN'), adminMessageController.getAllMessages);
userRouter.get('/api/admin/messages/:messageId', roleMiddleware('ADMIN'), adminMessageController.getMessageById);
userRouter.patch('/api/admin/messages/:messageId', roleMiddleware('ADMIN'), adminMessageController.updateMessageById);
userRouter.delete('/api/admin/messages/:messageId', roleMiddleware('ADMIN'), adminMessageController.deleteMessageById);

export {
    userRouter
};
