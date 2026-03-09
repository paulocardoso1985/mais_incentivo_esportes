require('dotenv').config();
const { PrismaClient } = require('./packages/database/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
    let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

    if (admin) {
        console.log("Existing admin found. Updating...");
        admin = await prisma.user.update({
            where: { id: admin.id },
            data: {
                email: 'paulocardosocampos1985@gmail.com',
                passwordHash: 'voticoin' // Assuming raw text is matched in Auth service MVP
            }
        });
        console.log("Admin updated successfully!");
    } else {
        console.log("No admin found. Creating new admin...");
        admin = await prisma.user.create({
            data: {
                email: 'paulocardosocampos1985@gmail.com',
                passwordHash: 'voticoin',
                name: 'Admin',
                document: 'admin_123', // Dummy document for admin
                role: 'ADMIN'
            }
        });
        console.log("Admin created successfully!");
    }

    console.log("Admin details:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password Hash: ${admin.passwordHash}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
