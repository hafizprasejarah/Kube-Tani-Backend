import { ResponseError } from "../../error/response_error.js";
import { validate } from "../../validation/validation.js";
import {
    getUserValidation,
    updateUserValidation,
    refreshTokenValidation,
    getAllUsersValidation,
    updateUserByIdValidation
} from "../../validation/user_validation.js";
import { prismaClient } from "../../application/database.js";
import bcrypt from 'bcrypt';

const get = async (id) => {
    id = validate(getUserValidation, id);

    const user = await prismaClient.user.findUnique({
        where:
        {
            id: id
        },
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return user;
}

const update = async (id, request) => {
    const user = validate(updateUserValidation, request);

    const existUsers = await prismaClient.user.findUnique({
        where: {
            id: id
        }
    });

    if (!existUsers) {
        throw new ResponseError(404, "User not found");
    }

    const data = {};

    if (user.name) {
        data.name = user.name;
    }

    if (user.username) {

        const existUsername = await prismaClient.user.findFirst({
            where: {
                username: user.username,
                NOT: {
                    id: id
                }
            }
        })

        if (existUsername) {
            throw new ResponseError(400, "username already exists");
        }

        data.username = user.username;
    }


    if (user.email) {

        const existemail = await prismaClient.user.findFirst({
            where: {
                email: user.email,
                NOT: {
                    id: id
                }
            }
        })

        if (existemail) {
            throw new ResponseError(400, "email already exists");
        }

        data.email = user.email;
    }

    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    if (Object.keys(data).length === 0) {
        throw new ResponseError(400, "No data to update");
    }

    return await prismaClient.user.update({
        where: {
            id: id
        },
        data: data,
        select: {
            username: true,
            name: true,
            email: true,
            role: true
        }
    });
}

const logout = async (request, userId) => {
    const logout = validate(refreshTokenValidation, request);

    const token = await prismaClient.refreshToken.findUnique({
        where: {
            token: logout.refreshToken
        }
    });

    if (!token) {
        throw new ResponseError(404, "Refresh Token not found");
    }

    if (token.userId !== userId) {
        throw new ResponseError(403, "Forbidden");
    }

    await prismaClient.refreshToken.delete({
        where: {
            token: logout.refreshToken
        }
    })

    return {
        message: "Logout successful"
    };
}

const getAllUsers = async (request) => {

    const users = validate(getAllUsersValidation, request);

    //1 ((page - 1) * size) = 0
    //2 ((page - 1) * size) = 10
    const skip = (users.page - 1) * users.size;
    const filters = [];

    const addFilter = (condition) => {
        if (condition) {
            filters.push(condition);
        }
    };

    addFilter(users.name && {
        name: {
            contains: users.name
        }
    });

    addFilter(users.username && {
        username: {
            contains: users.username
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

const getUserById = async (userId) => {
    const id = validate(getUserValidation, userId);

    const user = await prismaClient.user.findUnique({
        where: {
            id: id,
        },

        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true
        }
    })

    if (!user) {
        throw new ResponseError(404, "contact not found");
    }

    return user;
}

const updateUserById = async (currentUserId, userId, request) => {
    const validatedUserId = validate(getUserValidation, userId);
    const updateUser = validate(updateUserByIdValidation, request);

    const existUsers = await prismaClient.user.findUnique({
        where: {
            id: validatedUserId
        }
    });

    if (!existUsers) {
        throw new ResponseError(404, "User not found");
    }

    const data = {};

    if (updateUser.name) {
        data.name = updateUser.name;
    }

    if (updateUser.username) {

        const existUsername = await prismaClient.user.findFirst({
            where: {
                username: updateUser.username,
                NOT: {
                    id: validatedUserId
                }
            }
        })

        if (existUsername) {
            throw new ResponseError(400, "username already exists");
        }

        data.username = updateUser.username;
    }


    if (updateUser.email) {

        const existemail = await prismaClient.user.findFirst({
            where: {
                email: updateUser.email,
                NOT: {
                    id: validatedUserId
                }
            }
        })

        if (existemail) {
            throw new ResponseError(400, "email already exists");
        }

        data.email = updateUser.email;
    }

    if (updateUser.password) {
        data.password = await bcrypt.hash(updateUser.password, 10);
    }



    if (updateUser.role && updateUser.role !== currentUser.role) {


        if (currentUser.role === "ADMIN" && updateUser.role === "USER") {

            const totalAdmin = await prismaClient.user.count({
                where: {
                    role: "ADMIN"
                }
            });

            if (totalAdmin <= 1) {
                throw new ResponseError(
                    400,
                    "Cannot remove the last administrator."
                );
            }
        }

        data.role = updateUser.role;
    }

    if (currentUser.id === validatedUserId && updateUser.role) {
        throw new ResponseError(
            400,
            "You cannot change your own role."
        );
    }

    if (Object.keys(data).length === 0) {
        throw new ResponseError(400, "No data to update");
    }

    return await prismaClient.user.update({
        where: {
            id: validatedUserId
        },
        data: data,
        select: {
            username: true,
            name: true,
            email: true,
            role: true
        }
    });
}

const deleteUserById = async (currentUser, userId) => {
    const validatedUserId = validate(getUserValidation, userId);

    if (currentUser === validatedUserId) {
        throw new ResponseError(400, "You cannot delete your own account");
    }


    const user = await prismaClient.user.findUnique({
        where: {
            id: validatedUserId
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }


    await prismaClient.$transaction([
        prismaClient.refreshToken.deleteMany({
            where: {
                userId: validatedUserId
            }
        }),
        prismaClient.user.delete({
            where: {
                id: validatedUserId
            }
        })
    ]);

};

const activateUser = async (currentUserId, userId) => {
    const validatedUserId = validate(getUserValidation, userId);

    const user = await prismaClient.user.findUnique({
        where: {
            id: validatedUserId
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    if (currentUserId === validatedUserId) {
        throw new ResponseError(400, "You cannot deactivate your own account");
    }

    if (user.isActive) {
        throw new ResponseError(400, "User is already active");
    }

    return await prismaClient.user.update({
        where: {
            id: validatedUserId
        },
        data: {
            isActive: true
        },
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            isActive: true
        }
    });
}

const deactivateUser = async (currentUserId, userId) => {
    const validatedUserId = validate(getUserValidation, userId);

    const user = await prismaClient.user.findUnique({
        where: {
            id: validatedUserId
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }


    if (currentUserId === validatedUserId) {
        throw new ResponseError(400, "You cannot deactivate your own account");
    }

    if (!user.isActive) {
        throw new ResponseError(400, "User is already active");
    }


    return await prismaClient.user.update({
        where: {
            id: validatedUserId
        },
        data: {
            isActive: false
        },
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            isActive: true
        }
    });
}



export default { get, update, logout, getAllUsers, getUserById, updateUserById, activateUser, deactivateUser };