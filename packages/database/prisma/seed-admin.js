const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seed: Creating default admin user...');

    const adminEmail = 'paulo.cardoso@maiscorporativo.tur.br';
    const adminDoc = '012.345.678-99'; // Documento padrão para seu acesso

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: adminEmail },
                { document: adminDoc }
            ]
        }
    });

    if (!existingUser) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                document: adminDoc,
                name: 'Paulo Cardoso',
                passwordHash: 'admin1234',
                role: 'ADMIN',
                coinBalance: 0
            }
        });
        console.log('✅ Paulo admin user created successfully!');
        console.log(`Email: ${adminEmail}`);
        console.log('Password: admin1234');
    } else {
        console.log('ℹ️ Admin user already exists or document/email in use.');
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding admin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
