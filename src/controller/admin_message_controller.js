

import userMessage from "../service/admin/message_service.js";

const getAllMessages = async (req, res, next) => {
    try {
        const result = await (req.body);

        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

export default { get };