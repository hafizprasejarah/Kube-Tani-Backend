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
                user: result.user
            }
        })
    } catch (e) {
        next(e);
    }
}


const get = async (req, res, next) => {

}

export default { register, login };