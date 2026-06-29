import userService from "../service/user_service.js";
import { validate } from "../validation/validation.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);

        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);

        res.status(200).json({
            message: result.message,
            data: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                user: result.user
            }
        })
    } catch (e) {
        next(e);
    }
}

const refresh = async (req, res, next) => {
    try {

        const result = await userService.refresh(req.body);

        return res.status(200).json({
            message: result.message,
            data: {
                accessToken: result.accessToken
            }
        });

    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const id = req.user.id;
        const result = await userService.get(id);

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

        const result = await userService.update(id, request);
        res.status(200).json({
            data: result
        });

    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {

        await userService.logout(req.body.refreshToken);

        res.status(200).json({
            data: "ok"
        });
        
    } catch (e) {
        next(e);
    }
}

export default { register, login, get, update, logout, refresh };