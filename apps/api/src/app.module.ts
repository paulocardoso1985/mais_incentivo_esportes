import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { B2BModule } from './b2b/b2b.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LedgerModule } from './ledger/ledger.module';
import { EventsModule } from './events/events.module';
import { OrdersModule } from './orders/orders.module';

import { RepresentativeModule } from './representative/representative.module';
import { EmployeeLinkModule } from './employee-link/employee-link.module';
import { AllowedEmittersModule } from './allowed-emitters/allowed-emitters.module';
import { EmailModule } from './email/email.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '../../.env',
        }),
        AuthModule,
        UsersModule,
        B2BModule,
        InvoiceModule,
        LedgerModule,
        EventsModule,
        OrdersModule,
        RepresentativeModule,
        EmployeeLinkModule,
        AllowedEmittersModule,
        EmailModule,
    ],
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class AppModule { }
