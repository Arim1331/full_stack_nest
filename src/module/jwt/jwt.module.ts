import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtTokenService } from 'src/service/jwt/jwt.service';

@Module({
    imports: [
        NestJwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>("JWT_SECRET")
            })
        })
    ],
    providers: [JwtTokenService], 
    exports: [JwtTokenService, NestJwtModule]
})
export class JwtTokenModule {;}
