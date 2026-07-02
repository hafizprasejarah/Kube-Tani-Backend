import { ResponseError } from "../../error/response_error.js";
import { validate } from "../../validation/validation.js";
import { createMessageValidation, getUserValidation } from "../../validation/message_validaiton.js";
import { prismaClient } from "../../application/database.js";


const create = async (currentUser, request) => {
    const userId = validate(getUserValidation, currentUser);
    const message = validate(createMessageValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            id: userId
        },
        select: {
            email: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    const createdMessage = await prismaClient.message.create({
        data: {
            subject: message.subject,
            category: message.category,
            message: message.message,
            contactEmail: user.email,
            contactPhone: message.contactPhone,
            userId : userId
        },
        select: {
            id: true,
            subject: true,
            category: true,
            message: true,
            contactEmail: true,
            contactPhone: true,
            status: true,
            createdAt: true
        }
    });
    return createdMessage;
}

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
            contactEmail: true,
            contactPhone: true,
            status: true,
            createdAt: true
        }
    });

    return getMessages;
}



export default { create, get };