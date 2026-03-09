import { Controller, Get, Post, Body, Param, UseGuards, Delete, Patch, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@votorantim-futebol/database';

@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService) { }

    @Get()
    findAll(@Query('region') region?: string) {
        return this.eventsService.findAll(region);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    // CMS Endpoints
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('cms/create')
    create(@Body() dto: CreatePackageDto) {
        return this.eventsService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch('cms/:id')
    update(@Param('id') id: string, @Body() dto: any) {
        return this.eventsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('cms/:id')
    remove(@Param('id') id: string) {
        return this.eventsService.remove(id);
    }
}
