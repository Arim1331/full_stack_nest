import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RedisClientType } from 'redis';
import { JwtPayload } from 'src/type/auth.type';

@Injectable()
export class RedisService {
    private readonly BLACKLIST_PREFIX: string;
    private readonly REFRESH_PREFIX: string;

    constructor(
        @Inject("REDIS_CLIENT")
        private readonly redisClient: RedisClientType,
        private readonly configService: ConfigService
    ){
        // .env 값을 읽어서 값을 주입 
        this.BLACKLIST_PREFIX = this.configService.get("BLACKLIST_PREFIX", 'blacklist:')
        this.REFRESH_PREFIX = this.configService.get("REFRESH_PREFIX", 'refresh:')
    }

    // 1. Redis에서 RefreshToken 저장
    // 실무 key는 콜론체이닝(:) 저장하는 방법
    // key -> PREFIX:ID:TOKEN
    // value -> refreshToken
    // ttl -> 만료시간
    async setRefreshToken(payload:JwtPayload, token: string, ttl: number){
        const key = `${this.REFRESH_PREFIX}${payload.id}`
        await this.redisClient.set(key, token, { EX: ttl })
    }

    // 2. Redis에 저장된 RefreshToken이 유효한지 확인
    async getRefreshToken(payload: JwtPayload): Promise<string | null>{
        const key = `${this.REFRESH_PREFIX}${payload.id}`
        return await this.redisClient.get(key)
    }

    // 3. Redis에 블랙리스트 등록(예: JWT 토큰을 Key로 저장)
    async addToBlackList(token: string, ttl: number){
        const key = `${this.BLACKLIST_PREFIX}${token}`
        await this.redisClient.set(key, 'true', {EX: ttl})
    }

    // 4. Redis에 블랙리스트로 등록되어 있는지 확인
    async isBlackListed(token: string){
        const key = `${this.BLACKLIST_PREFIX}${token}`
        const result = await this.redisClient.get(key);
        return result === 'true'
    }

    // 5. Redis에 등록된 RefreshToken을 무효화 
    async deleteRefreshToken(payload: JwtPayload){
        const key = `${this.REFRESH_PREFIX}${payload.id}`
        await this.redisClient.del(key)
    }
}
