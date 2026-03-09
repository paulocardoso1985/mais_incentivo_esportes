import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    async sendEmail(to: string, subject: string, template: string, context: any) {
        // Simulação de envio de e-mail para o MVP
        this.logger.log(`--------------------------------------------------`);
        this.logger.log(`ENVIANDO E-MAIL`);
        this.logger.log(`Para: ${to}`);
        this.logger.log(`Assunto: ${subject}`);
        this.logger.log(`Template: ${template}`);
        this.logger.log(`Dados: ${JSON.stringify(context, null, 2)}`);
        this.logger.log(`--------------------------------------------------`);

        // No futuro, aqui entraria a integração com SendGrid, Mailgun ou SMTP
        return true;
    }

    async notifyInvoiceUploaded(email: string, userName: string) {
        return this.sendEmail(
            email,
            'Mais Incentivo Esportes - Nota Fiscal Recebida',
            'invoice-received',
            { userName }
        );
    }

    async notifyRedemptionRequest(email: string, userName: string, packageName: string) {
        // Para o usuário
        await this.sendEmail(
            email,
            'Mais Incentivo Esportes - Solicitação de Resgate em Análise',
            'redemption-request',
            { userName, packageName }
        );

        // Para o administrador/responsável (Simulação)
        await this.sendEmail(
            'admin@maisincentivo.com.br',
            'NOVA SOLICITAÇÃO DE RESGATE',
            'admin-redemption-alert',
            { userName, packageName, userEmail: email }
        );
    }

    async notifyLinkApproval(email: string, storeName: string) {
        return this.sendEmail(
            email,
            'Mais Incentivo Esportes - Vínculo Aprovado',
            'link-approved',
            { storeName }
        );
    }
}
