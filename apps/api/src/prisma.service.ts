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
        let retries = 3;
        while (retries > 0) {
            try {
                await this.$connect();
                console.log('Successfully connected to database');
                break;
            } catch (err) {
                console.error(`Database connection failed. Retries left: ${retries - 1}`, err);
                retries--;
                if (retries === 0) throw err;
                await new Promise(res => setTimeout(res, 5000)); // Espera 5 segundos
            }
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
