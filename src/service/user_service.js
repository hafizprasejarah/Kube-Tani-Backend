import { ResponseError } from "../error/response_error.js";
import { validate } from "../validation/validation.js";
import { registerValidation } from "../validation/user_validation.js";
import { prismaClient } from "../application/database.js";
import bcrypt from 'bcrypt';

const register = async (request) => {
    const user = validate(registerValidation, request);
    const countUser = await prismaClient.user.count({
        where: {
            OR: [
                {
                    username: user.username
                },
                {
                    email: user.email
                }
            ]
        }
    });
    if (countUser > 0) {
        throw new ResponseError(400, "username or email already exists");
    }

    const hashedPassword = await bcrypt.hash(
        user.password,
        10
    );

    return await prismaClient.user.create({
        data: {
            ...user,
            password: hashedPassword,
        },
        select: {
            email: true,
            username: true,
            name: true
        }
    });

}

export default { register };