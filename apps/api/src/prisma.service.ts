import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@votorantim-futebol/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: ['query', 'info', 'warn', 'error'],
        });
    }

    async onModuleInit() {
        const url = process.env.DATABASE_URL || '';
        const maskedUrl = url.replace(/:([^:@]+)@/, ':****@');
        console.log(`[Database] Attempting to connect: ${maskedUrl}`);

        let retries = 20; // Aumentado para 20 tentativas
        while (retries > 0) {
            try {
                await this.$connect();
                console.log('[Database] Successfully connected!');
                break;
            } catch (err) {
                console.error(`[Database] Connection failed. Retries left: ${retries - 1}`);
                retries--;
                if (retries === 0) {
                    console.error('[Database] Final connection attempt failed. Check Render Dashboard.');
                    throw err;
                }
                await new Promise(res => setTimeout(res, 5000)); // Espera 5 segundos entre tentativas
            }
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
