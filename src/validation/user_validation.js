import * as z from "zod";

const registerValidation = z.object({
    email: z.string().email(),
    username: z.string().min(2).max(100),
    password: z.string().min(8),
    name: z.string().min(2).max(100),
});

const loginValidation = z.object({
    username: z.string().min(2).max(100),
    password: z.string().min(8).max(100),
});

const getUserValidation = z.coerce.number().int().positive();

const updateUserValidation = z.object({
    email: z.string().email().optional(),
    username: z.string().min(2).max(100).optional(),
    password: z.string().min(8).optional(),
    name: z.string().min(2).max(100).optional(),
});

const refreshTokenValidation = z.object({
    refreshToken: z.string().min(1)
});

const getAllUsersValidation = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).max(100).default(10),
    name: z.string().max(100).optional(),
    username: z.string().trim().max(100).optional(),
    email: z.string().email().optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    isActive: z.coerce.boolean().optional(),
});

const updateUserByIdValidation = z.object({
    email: z.string().email().optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    username: z.string().min(2).max(100).optional(),
    password: z.string().min(8).optional(),
    name: z.string().min(2).max(100).optional(),
});


export { registerValidation, loginValidation, getUserValidation, updateUserValidation, refreshTokenValidation, getAllUsersValidation, updateUserByIdValidation }