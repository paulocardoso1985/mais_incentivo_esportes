require('dotenv').config();
const { PrismaClient } = require('./packages/database/node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (user) {
        console.log("=== ADMIN FOUND ===");
        console.log("Email:", user.email);
        console.log("Document/CNPJ:", user.document);
        console.log("Password Hash:", user.passwordHash ? "YES" : "NO");
        console.log("ID:", user.id);
    } else {
        console.log("NO ADMIN FOUND in the local database.");
    }
}
main().finally(() => prisma.$disconnect());
