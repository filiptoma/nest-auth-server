import { Module } from '@nestjs/common';
import { REDIS } from './redis.constants';
import * as Redis from 'redis';

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: async () => {
        let redisHost;
        switch (process.env.NODE_ENV) {
          case 'development:localhost':
            redisHost = process.env.REDIS_HOST_LOCAL;
            break;
          case 'development:raspberry':
            redisHost = process.env.REDIS_HOST_PI;
            break;
        }
        const url = `redis://${redisHost}:${process.env.REDIS_PORT}`;
        const client = Redis.createClient({
          url,
          legacyMode: true,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
