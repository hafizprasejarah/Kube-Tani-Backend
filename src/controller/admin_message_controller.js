import adminMessageService from "../service/admin/admin_message_service.js";

const getAllMessages = async (req, res, next) => {
    try {

        const request = {
            page: req.query.page,
            size: req.query.size,
            subject: req.query.subject,
            message: req.query.message,
            category: req.query.category,
            status: req.query.status,
            userId: req.query.userId,
            name: req.query.name
        }

        const result = await adminMessageService.getAllMessages(request);

        res.status(200).json({
            data: result.contacts,
            paging: result.paging
        })
    } catch (e) {
        next(e);
    }
}

const getMessageById = async (req, res, next) => {
    try {

        const messageId = req.params.messageId;
        const result = await adminMessageService.getMessageById(messageId);

        res.status(200).json({
            data: result
        })

    } catch (e) {
        next(e);
    }
}

const updateMessageById = async (req, res, next) => {
    try {

        const result = await adminMessageService.updateMessageById(
            req.params.messageId,
            req.body
        );

        res.status(200).json({
            message: "Message updated successfully",
            data: result
        });

    } catch (e) {
        next(e);
    }
}

const deleteMessageById = async (req, res, next) => {
    try {

        await adminMessageService.deleteMessageById(
            req.params.messageId
        );

        res.status(200).json({
            message: "Message deleted successfully"
        });

    } catch (e) {
        next(e);
    }
}

export default { getAllMessages, getMessageById, updateMessageById, deleteMessageById };