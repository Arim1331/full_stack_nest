import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '../prisma/prisma.module';
import { S3Module } from '../s3/s3.module';
import { RedisModule } from '../redis/redis.module';
import { JwtTokenModule } from '../jwt/jwt.module';

// global infra 담당 역할
@Global()
@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: ".env"}),
        PrismaModule,
        S3Module,
        RedisModule,
        JwtTokenModule
    ],
    exports: [
        PrismaModule,
        S3Module,
        RedisModule,
        JwtTokenModule
    ]
})
export class CoreModule {;}
