import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from 'src/service/auth/auth.service';
import { MemberModule } from '../member/member.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from 'src/controller/auth/auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { NaverStrategy } from './strategy/naver.strategy';
import { JwtTokenService } from 'src/service/jwt/jwt.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { RedisService } from 'src/service/redis/redis.service';
import { RedisModule } from '../redis/redis.module';
import { JwtTokenModule } from '../jwt/jwt.module';

// 순환참조 해결
@Module({
    imports: [
        forwardRef(() => MemberModule),
        RedisModule,
        JwtTokenModule,
        PassportModule.register({session: false})
    ],
    providers: [
        AuthService,
        LocalStrategy,
        GoogleStrategy,
        KakaoStrategy,
        NaverStrategy,
        JwtStrategy,
        JwtAuthGuard
    ],
    controllers: [AuthController],
    exports: [AuthService, JwtTokenModule]
})
export class AuthModule {;}
