import { ResponseError } from "../../error/response_error.js";
import { validate } from "../../validation/validation.js";
import { getAllUsersValidaton, getUserValidation } from "../../validation/message_validaiton.js";
import { prismaClient } from "../../application/database.js";


const get = async (currentUser) => {

    const userId = validate(getUserValidation, currentUser)

    const getMessages = await prismaClient.message.findMany({
        where: {
            userId: userId
        },
        select: {
            id: true,
            subject: true,
            category: true,
            message: true,
            status: true,
            createdAt: true
        }
    });

    return getMessages;
}


const getAllMessages = async (request) => {

    const messages = validate(getAllUsersValidation, request);

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

    addFilter(messages.category && {
        category: {
            contains: messages.category
        }
    });

    addFilter(users.email && {
        email: {
            contains: users.email
        }
    });

    addFilter(users.role && {
        role: users.role
    });

    if (users.isActive !== undefined) {
        filters.push({
            isActive: users.isActive
        });
    }

    const allUsers = await prismaClient.user.findMany({
        where: {
            AND: filters
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            createdAt: "desc"
        },
        take: users.size,
        skip
    });

    const totalItem = await prismaClient.user.count({
        where: {
            AND: filters
        }
    });

    return {
        contacts: allUsers,
        paging: {
            page: users.page,
            total_item: totalItem,
            total_page: Math.ceil(totalItem / users.size),
        }
    }
}


export default { create, get };