import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PersonalAccessToken } from './entities/personal-access-token-entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PersonalAccessToken])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
