
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
        const user = req.user;
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

export default { get, update, logout, getAllUsers, getUserById };