
import adminUserService  from "../service/admin/admin_user_service.js";

const get = async (req, res, next) => {
    try {
        const id = req.user.id;
        const result = await adminUserService .get(id);

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

        const result = await adminUserService .update(id, request);
        res.status(200).json({
            data: result
        });

    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        const result = await adminUserService .logout(req.body, req.user.id);

        res.status(200).json({
            message: result.message
        });

    } catch (e) {
        next(e);
    }
}

export default {get, update, logout };