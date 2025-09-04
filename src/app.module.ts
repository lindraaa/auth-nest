import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { RequestContextModule } from './request-context/request-context.module';
import { SeedModule } from './database/seeder/seed.module';
import { APP_GUARD } from '@nestjs/core';
import { TokenAuthGuard } from './modules/auth/guards/token-auth.guard';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { UploadModule } from './modules/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig] }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.WORKING_ENV === 'development',
    }),
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
