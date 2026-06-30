import { ResponseError } from "../../error/response_error.js";
import { validate } from "../../validation/validation.js";
import { registerValidation, loginValidation, refreshTokenValidation } from "../../validation/user_validation.js";
import { prismaClient } from "../../application/database.js";
import bcrypt from 'bcrypt';
import {
    generateRefreshToken,
    generateAccessToken,
    verifyRefreshToken
} from "../../utils/jwt.js";

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

    const createdUser = await prismaClient.user.create({
        data: {
            name: user.name,
            username: user.username,
            email: user.email,
            password: hashedPassword,
            role: "USER"
        },
        select: {
            email: true,
            username: true,
            name: true,
            role: true,
        }
    });

    return {
        message: "Register succesfull",
        data: createdUser
    }

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
            role: true,
            isActive: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password is incorrect");
    }

    if (!user.isActive) {
        throw new ResponseError(403, "Account is inactive");
    }

    const accessToken = generateAccessToken({
        id: user.id,
        role: user.role,
        username: user.username
    });

    const refreshToken = generateRefreshToken({
        id: user.id
    })

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prismaClient.refreshToken.create({
        data: {
            token: refreshToken,
            expiresAt: expiresAt,
            userId: user.id
        }
    });

    return {
        message: "Login berhasil",
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role
        }
    };
}

const refresh = async (request) => {

    const tokenRefresh = validate(refreshTokenValidation, request);

    verifyRefreshToken(tokenRefresh.refreshToken);

    const token = await prismaClient.refreshToken.findUnique({
        where: {
            token: tokenRefresh.refreshToken
        },
        include: {
            user: true
        }
    });

    if (!token) {
        throw new ResponseError(401, "Refresh token is invalid");
    }

    if (token.revoked) {
        throw new ResponseError(401, "Refresh token has been revoked");
    }

    if (token.expiresAt < new Date()) {
        throw new ResponseError(401, "Refresh token expired");
    }

    if (!token.user.isActive) {
        throw new ResponseError(403, "Account is inactive");
    }

    const accessToken = generateAccessToken({
        id: token.user.id,
        username: token.user.username,
        role: token.user.role
    });

    return {
        message: "Access token refreshed",
        accessToken
    };
}

export default { register, login, refresh };