import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisService } from 'src/service/redis/redis.service';

@Module({
    providers: [
        {
            provide: "REDIS_CLIENT",
            useFactory: async (config: ConfigService) => {
                const client = createClient({ url: config.get("REDIS_URL") })
                await client.connect()
                return client;
            },
            inject: [ConfigService]
        },
        RedisService,
    ],
    
    exports: ["REDIS_CLIENT", RedisService]
})
export class RedisModule {;}
