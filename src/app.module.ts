import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { RequestContextModule } from './request-context/request-context.module';
import { SeedModule } from './database/seeder/seed.module';
import { APP_GUARD } from '@nestjs/core';
import { TokenAuthGuard } from './modules/auth/guards/token-auth.guard';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    PostModule,
    RequestContextModule,
    SeedModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: TokenAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
