import adminUserService from "../service/admin/admin_user_service.js";

const get = async (req, res, next) => {
    try {
        const id = req.user.id;
        const result = await adminUserService.get(id);

        res.status(200).json({
            data: result
        })

    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const id = req.user.id;
        const request = req.body;

        const result = await adminUserService.update(id, request);
        res.status(200).json({
            data: result
        });

    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        const result = await adminUserService.logout(req.body, req.user.id);

        res.status(200).json({
            message: result.message
        });

    } catch (e) {
        next(e);
    }
}

const getAllUsers = async (req, res, next) => {
    try {

        const request = {
            name: req.query.name,
            username: req.query.username,
            email: req.query.email,
            page: req.query.page,
            size: req.query.size,
            role: req.query.role,
            isActive: req.query.isActive,
        }

        const result = await adminUserService.getAllUsers(request);

        res.status(200).json({
            data: result.contacts,
            paging: result.paging
        })
    } catch (e) {
        next(e);
    }
}

const getUserById = async (req, res, next) => {
    try {

        const userId = req.params.userId;

        const result = await adminUserService.getUserById(userId);

        res.status(200).json({
            data: result
        })

    } catch (e) {
        next(e);
    }
}

const updateUserById = async (req, res, next) => {
    try {

        const userId = req.params.userId;
        const currentUser = req.user;
        const result = await adminUserService.updateUserById(currentUser, userId, req.body);

        res.status(200).json({
            message: "User updated successfully",
            data: result
        })

    } catch (e) {
        next(e);
    }
}

const deleteUserById = async (req, res, next) => {
    try {

        const userId = req.params.userId;
        const currentUserId = req.user.id;

        const result = await adminUserService.deleteUserById(currentUserId, userId);

        res.status(200).json({
            message: "User deleted successfully"
        })

    } catch (e) {
        next(e);
    }
}


const activateUser = async (req, res, next) => {
    try {
        const currentUserId = req.user.id
        const userId = req.params.userId;

        const result = await adminUserService.activateUser(currentUserId, userId);

        res.status(200).json({
            data: result
        })

    } catch (e) {
        next(e);
    }
}

const deactivateUser = async (req, res, next) => {
    try {
        const currentUserId = req.user.id
        const userId = req.params.userId;

        const result = await adminUserService.deactivateUser(currentUserId, userId);

        res.status(200).json({
            data: result
        })

    } catch (e) {
        next(e);
    }
}

export default { get, update, logout, getAllUsers, getUserById, updateUserById, deleteUserById, activateUser, deactivateUser };