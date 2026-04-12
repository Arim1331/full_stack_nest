import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/type/auth.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      // 쿠키에서 accessToken이라는 이름의 값을 추출함
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.['accessToken'];
        },
      ]),
      ignoreExpiration: false, // 토큰 만료 시 에러 발생
      secretOrKey: configService.get<string>("JWT_SECRET") || 'fallback_secret',
    });
  }

  // 토큰 검증이 성공하면 실행
  async validate(payload: JwtPayload) {
    if (!payload.id) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    return { id: payload.id, memberEmail: payload.memberEmail };
  }
}