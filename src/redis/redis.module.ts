import { Module } from '@nestjs/common';
import { REDIS, REDIS_OPT } from './redis.constants';
import * as Redis from 'redis';

@Module({
  providers: [
    {
      provide: REDIS_OPT,
      useValue: {
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        legacyMode: true,
      },
    },
    {
      inject: [REDIS_OPT],
      provide: REDIS,
      useFactory: async (options: { url: string; legacyMode: boolean }) => {
        const client = Redis.createClient(options);
        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
