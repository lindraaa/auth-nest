import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { RequestContextModule } from 'src/request-context/request-context.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User]),
    AuthModule,
    RequestContextModule,
    ConfigModule.forFeature(databaseConfig),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    { provide: 'POST_LIKES', useValue: ['asd', 'sdasd'] },
  ],
})
export class PostModule {}
