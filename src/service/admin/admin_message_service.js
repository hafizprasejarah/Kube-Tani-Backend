import { ResponseError } from "../../error/response_error.js";
import { validate } from "../../validation/validation.js";
import { getUserValidation, getAllMessagesValidation, updateMessageValidation } from "../../validation/message_validaiton.js";
import { prismaClient } from "../../application/database.js";

const getAllMessages = async (request) => {

    const messages = validate(getAllMessagesValidation, request);

    const skip = (messages.page - 1) * messages.size;
    const filters = [];

    const addFilter = (condition) => {
        if (condition) {
            filters.push(condition);
        }
    };

    addFilter(messages.subject && {
        subject: {
            contains: messages.subject
        }
    });

    addFilter(messages.message && {
        message: {
            contains: messages.message
        }
    });

    addFilter(messages.category && {
        category: messages.category
    });

    addFilter(messages.status && {
        status: messages.status
    });

    addFilter(messages.userId && {
        userId: messages.userId
    });

    addFilter(messages.name && {
        user: {
            name: {
                contains: messages.name
            }
        }
    });

    const allmessages = await prismaClient.message.findMany({
        where: {
            AND: filters
        },
        select: {
            id: true,
            subject: true,
            category: true,
            message: true,
            contactEmail: true,
            contactPhone: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true
                }
            }

        },
        orderBy: {
            createdAt: "desc"
        },
        take: messages.size,
        skip
    });

    const totalItem = await prismaClient.message.count({
        where: {
            AND: filters
        }
    });

    return {
        contacts: allmessages,
        paging: {
            page: messages.page,
            total_item: totalItem,
            total_page: Math.ceil(totalItem / messages.size),
        }
    }
}


const getMessageById = async (messageId) => {
    const id = validate(getUserValidation, messageId);

    const message = await prismaClient.message.findUnique({
        where: {
            id: id,
        },

        select: {
            id: true,
            subject: true,
            category: true,
            message: true,
            contactEmail: true,
            contactPhone: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true
                }
            }
        }
    })

    if (!message) {
        throw new ResponseError(404, "contact not found");
    }

    if (message.status === "PENDING") {
        await prismaClient.message.update({
            where: { id: message.id },
            data: {
                status: "READ"
            }
        });

        message.status = "READ";
    }


    return message;
}

const updateMessageById = async (messageId, request) => {
    const id = validate(getUserValidation, messageId);
    const data = validate(updateMessageValidation, request);

    const message = await prismaClient.message.findUnique({
        where: {
            id
        }
    });

    if (!message) {
        throw new ResponseError(404, "Message not found");
    }

    return await prismaClient.message.update({
        where: {
            id
        },
        data: {
            status: data.status
        },
        select: {
            id: true,
            subject: true,
            category: true,
            status: true,
            updatedAt: true
        }
    });
}

const deleteMessageById = async (messageId) => {

    const id = validate(getUserValidation, messageId);

    const message = await prismaClient.message.findUnique({
        where: {
            id
        }
    });

    if (!message) {
        throw new ResponseError(404, "Message not found");
    }

    await prismaClient.message.delete({
        where: {
            id
        }
    });

    return {
        message: "Message deleted successfully"
    };
}

export default { getAllMessages, getMessageById, updateMessageById, deleteMessageById };