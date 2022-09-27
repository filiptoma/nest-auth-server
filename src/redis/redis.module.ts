import { Module } from '@nestjs/common';
import { REDIS } from './redis.constants';
import * as Redis from 'redis';

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: async () => {
        const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
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
