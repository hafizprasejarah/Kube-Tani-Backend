
import userMessage from "../service/user/message_service.js";

const create = async (req, res, next) => {
    try {
        const currentUser = req.user.id;
        const result = await userMessage.create(currentUser, req.body);

        res.status(201).json({
            message: "Message created successfully",
            data: result
        })

    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const currentUser = req.user.id;
        const result = await userMessage.get(currentUser);

        res.status(200).json({
            message: "Messages retrieved successfully",
            data: result
        })

    } catch (e) {
        next(e);
    }
}

export default { create, get }