import * as z from "zod";

const getUserValidation = z.coerce.number().int().positive();

const createMessageValidation = z.object({
    subject: z.string().min(3).max(100),
    
    category: z.enum([
        "PRODUCT",
        "PARTNERSHIP",
        "COMPLAINT",
        "SUGGESTION",
        "OTHER"
    ]),

    message: z.string().min(10).max(5000)
});

export { createMessageValidation, getUserValidation }