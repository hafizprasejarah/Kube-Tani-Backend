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

const getUserValidation = z.number().int().positive();

const updateUserValidation = z.object({
    email: z.string().email().optional(),
    username: z.string().min(2).max(100).optional(),
    password: z.string().min(8).optional(),
    name: z.string().min(2).max(100).optional(),
});

const refreshTokenValidation = z.object({
    refreshToken: z.string().min(1)
});

export { registerValidation, loginValidation, getUserValidation, updateUserValidation, refreshTokenValidation }