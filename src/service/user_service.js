import { ResponseError } from "../error/response_error.js";
import { validate } from "../validation/validation.js";
import { registerValidation, loginValidation } from "../validation/user_validation.js";
import { prismaClient } from "../application/database.js";
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from "../utils/jwt.js";
import { id } from "zod/v4/locales";

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
        message: "Registrasi berhasil. Akun Anda sedang menunggu persetujuan Super Admin",
        data: {
            ...user,
            password: hashedPassword,
        },
        select: {
            email: true,
            username: true,
            name: true,
            role: true,
        }
    });

}

const login = async (request) => {
    const loginRequest = validate(loginValidation, request);
    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            password: true,
            role: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password is incorrect");
    }

    if (user.role === "PENDING") {
        throw new ResponseError(
            403,
            "Akun Anda masih menunggu persetujuan Super Admin."
        );
    }

    const token = generateToken({
        id: user.id,
        role: user.role,
        username: user.username
    });

    return {
        message: "Login berhasil",
        accessToken: token,
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role
        }
    };

}

const get = async (request) => {

}

export default { register, login };