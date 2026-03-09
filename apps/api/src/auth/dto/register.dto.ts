import { Role } from '@votorantim-futebol/database';

export class RegisterDto {
    email: string;
    passwordHash: string;
    name: string;
    document: string;
    role: Role;
    storeId?: string;
    favoriteTeam?: string;
    region?: string;
    city?: string;
    managedRegion?: string;
}
