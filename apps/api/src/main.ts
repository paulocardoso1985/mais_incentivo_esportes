import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3005',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'https://maiscorporativo-web.onrender.com',
            'https://maiscorporativo-web-vfzk.onrender.com', // Nova URL do Frontend
            /\.onrender\.com$/ // Qualquer subdomínio do Render
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    app.useGlobalFilters(new AllExceptionsFilter());

    const port = process.env.PORT || 3005;
    await app.listen(port);

    logger.log(`API is running on: http://localhost:${port}`);
}
bootstrap();
