import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PersonalAccessToken } from './entities/personal-access-token-entity';
import { BcryptService } from './hashing/bcrypt.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, PersonalAccessToken])],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
