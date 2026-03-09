import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService
    ) { }

    async login(loginDto: LoginDto) {
        try {
            let user;
            const doc = loginDto.document?.trim();
            const email = loginDto.email?.trim();

            if (doc) {
                user = await this.usersService.findOne(doc);
                if (!user && doc.includes('@')) {
                    user = await this.usersService.findByEmail(doc);
                }
            }

            if (!user && email) {
                user = await this.usersService.findByEmail(email);
            }

            if (!user) {
                throw new UnauthorizedException('Credenciais inválidas');
            }

            // In a real app, hash and compare passwords. For MVP, we'll keep it simple or use bcrypt.
            if (user.passwordHash !== loginDto.passwordHash) {
                throw new UnauthorizedException('Credenciais inválidas');
            }

            const payload = {
                sub: user.id,
                document: user.document,
                role: user.role,
                name: user.name
            };

            const token = this.jwtService.sign(payload);

            return {
                access_token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    document: user.document,
                    favoriteTeam: user.favoriteTeam,
                    coinBalance: user.coinBalance
                }
            };
        } catch (e) {
            if (e instanceof UnauthorizedException) throw e;
            throw e;
        }
    }

    async register(registerDto: RegisterDto) {
        const email = registerDto.email?.trim();
        const document = registerDto.document?.trim();

        const existingEmail = await this.usersService.findByEmail(email);
        if (existingEmail) {
            throw new BadRequestException('Este e-mail já está cadastrado.');
        }

        const existingDoc = await this.usersService.findOne(document);
        if (existingDoc) {
            throw new BadRequestException('Este CPF/CNPJ já está cadastrado.');
        }

        const user = await this.usersService.create({
            ...registerDto,
            email,
            document
        });
        return this.login({
            document: user.document,
            passwordHash: user.passwordHash
        });
    }

    async forgotPassword(email: string) {
        // Encontrar usuário pelo e-mail
        // (Vou adicionar findByEmail no UsersService se não existir)
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            // Por segurança, não confirmamos se o e-mail existe, 
            // mas para o MVP vamos lançar erro para facilitar o debug do user
            throw new NotFoundException('E-mail não encontrado');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hora

        await this.usersService.update(user.id, {
            resetToken: token,
            resetTokenExpires: expires
        });

        // Simulação de envio de e-mail (Log no terminal)
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        console.log('--------------------------------------------------');
        console.log('SOLICITAÇÃO DE RECUPERAÇÃO DE SENHA');
        console.log(`Para: ${email}`);
        console.log(`Link: ${resetLink}`);
        console.log('--------------------------------------------------');

        return { message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' };
    }

    async resetPassword(token: string, passwordHash: string) {
        // Buscar usuário pelo token e verificar expiração
        // (Vou usar findByToken no UsersService)
        const user = await this.usersService.findByResetToken(token);

        if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            throw new BadRequestException('Token inválido ou expirado');
        }

        await this.usersService.update(user.id, {
            passwordHash,
            resetToken: null,
            resetTokenExpires: null
        });

        return { message: 'Senha atualizada com sucesso!' };
    }
}
