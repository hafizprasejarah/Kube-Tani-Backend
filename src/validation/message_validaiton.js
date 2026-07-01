import * as z from "zod";

const createValidation = z.object({
    email: z.string().email(),
    username: z.string().min(2).max(100),
    password: z.string().min(8),
    name: z.string().min(2).max(100),
});

export {createValidation}