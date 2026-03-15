import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from 'src/service/auth/auth.service';
import { MemberModule } from '../member/member.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from 'src/controller/auth/auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { NaverStrategy } from './strategy/naver.strategy';

// 순환참조 해결
@Module({
    imports: [
        forwardRef(() => MemberModule),
        PassportModule.register({session: false})
    ],
    providers: [
        AuthService,
        LocalStrategy,
        // GoogleStrategy,
        // KakaoStrategy,
        // NaverStrategy
    ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {;}
