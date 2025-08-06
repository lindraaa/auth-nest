import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { RequestContextModule } from './request-context/request-context.module';
import { SeedModule } from './database/seeder/seed.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    PostModule,
    RequestContextModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
