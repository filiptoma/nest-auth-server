import {
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { REDIS } from './redis/redis.constants';
import { ConfigModule } from '@nestjs/config';

import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';

@Module({
  imports: [ConfigModule.forRoot(), RedisModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  constructor(@Inject(REDIS) private readonly redis: RedisStore.Client) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new (RedisStore(session))({
            client: this.redis,
            logErrors: true,
          }),
          saveUninitialized: false,
          secret: 'tento secret bude v env',
          resave: false,
          cookie: {
            sameSite: true,
            httpOnly: false,
            maxAge: 5 * 60 * 1000,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
