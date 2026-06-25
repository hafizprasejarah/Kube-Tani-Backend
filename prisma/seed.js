import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash(
        "admin123",
        10
    );

    await prisma.user.create({
        data: {
            name: "Super Admin",
            username: "superadmin",
            email: "admin@kubetani.com",
            password,
            role: "SUPER_ADMIN"
        }
    });
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });