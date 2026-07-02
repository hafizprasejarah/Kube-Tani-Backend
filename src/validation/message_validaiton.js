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

    message: z.string().min(10).max(5000),

    contactPhone: z
        .string()
        .min(10, "Phone number is too short")
        .max(20, "Phone number is too long")
});

const getAllMessagesValidation = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).max(100).default(10),

    subject: z.string().max(100).optional(),
    message: z.string().max(5000).optional(),

    name: z.string().max(100).optional(),
    category: z.enum([
        "PRODUCT",
        "PARTNERSHIP",
        "COMPLAINT",
        "SUGGESTION",
        "OTHER"
    ]).optional(),

    status: z.enum([
        "PENDING",
        "READ",
        "REPLIED",
        "CLOSED"
    ]).optional(),

    userId: z.coerce.number().positive().optional()
});

const updateMessageValidation = z.object({
    status: z.enum([
        "PENDING",
        "READ",
        "REPLIED",
        "CLOSED"
    ])
});
export { createMessageValidation, getUserValidation, getAllMessagesValidation, updateMessageValidation}