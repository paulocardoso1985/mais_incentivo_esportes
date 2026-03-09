require('dotenv').config({ path: '../../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (user) {
        console.log("ADMIN FOUND:");
        console.log("Email:", user.email);
        console.log("Document:", user.document);
        console.log("Password Hash:", user.passwordHash ? "EXISTS" : "NONE");
        // Log full object to see if there is any other clue
        console.log(user);
    } else {
        console.log("NO ADMIN FOUND. The database is empty or no user has role ADMIN.");
    }
}
main().finally(() => prisma.$disconnect());
