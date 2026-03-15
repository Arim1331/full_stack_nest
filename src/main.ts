import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // swagger 설정 추가
    setupSwagger(app);

    app.use(cookieParser())

    // CORS 허용
    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: ["GET", "PUT", "POST", "DELETE"],
        credentials: true
    })

    await app.listen(process.env.PORT ?? 10000);
}
bootstrap();
