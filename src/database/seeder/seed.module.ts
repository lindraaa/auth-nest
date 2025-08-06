import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { BcryptService } from 'src/modules/auth/hashing/bcrypt.service';
import { PersonalAccessToken } from 'src/modules/auth/entities/personal-access-token-entity';
import { Post } from 'src/modules/post/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PersonalAccessToken, Post])],
  providers: [SeedService, BcryptService],
})
export class SeedModule {}
