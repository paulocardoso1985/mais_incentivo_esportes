import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { RepresentativeService } from './representative.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '@votorantim-futebol/database';

@UseGuards(JwtAuthGuard)
@Controller('representative')
export class RepresentativeController {
    constructor(private repService: RepresentativeService) { }

    @Get('dashboard')
    getDashboard(@Request() req: any): Promise<any> {
        // Note: In production, verify if user.role is 'REPRESENTANTE' or 'ADMIN'
        return this.repService.getDashboard(req.user.userId);
    }

    @Get('store/:id')
    getStoreDetail(@Request() req: any, @Param('id') id: string): Promise<User> {
        return this.repService.getStoreDetail(req.user.userId, id);
    }

    @Get('link-store/:cnpj')
    linkStore(@Request() req: any, @Param('cnpj') cnpj: string): Promise<User> {
        return this.repService.linkStore(req.user.userId, cnpj);
    }
}
