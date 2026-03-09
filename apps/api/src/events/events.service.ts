import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async findAll(region?: string) {
        const events = await (this.prisma.eventPackage as any).findMany({
            where: {
                stock: { gt: 0 },
                isActive: true,
            }
        });

        if (!region) {
            return events.sort((a: any, b: any) =>
                new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
            );
        }

        // Ordenação inteligente: 
        // 1. Região do Usuário
        // 2. Nacional
        // 3. Outras Regiões
        // 4. Data do Evento (para desempate)
        return events.sort((a: any, b: any) => {
            const getPriority = (p: any) => {
                if (p.region === region) return 0;
                if (p.region === 'Nacional' || !p.region) return 1;
                return 2;
            };

            const priorityA = getPriority(a);
            const priorityB = getPriority(b);

            if (priorityA !== priorityB) return priorityA - priorityB;

            return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        });
    }

    async findOne(id: string) {
        return this.prisma.eventPackage.findUnique({
            where: { id },
        });
    }

    async create(dto: CreatePackageDto) {
        return this.prisma.eventPackage.create({
            data: {
                ...dto,
                eventDate: new Date(dto.eventDate),
            },
        });
    }

    async update(id: string, dto: any) {
        const { eventDate, ...rest } = dto;
        return this.prisma.eventPackage.update({
            where: { id },
            data: {
                ...rest,
                ...(eventDate && { eventDate: new Date(eventDate) }),
            },
        });
    }

    async updateStock(id: string, quantity: number) {
        return this.prisma.eventPackage.update({
            where: { id },
            data: {
                stock: {
                    increment: quantity,
                },
            },
        });
    }

    async remove(id: string) {
        return this.prisma.eventPackage.update({
            where: { id },
            data: { isActive: false }, // Soft delete or Hard delete? User briefing says "realizar ajustes", I'll do soft delete for safety in MVP.
        });
    }
}
