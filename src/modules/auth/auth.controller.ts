import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp-dto';
import { SignInDto } from './dto/login-dto';
import { User } from '../users/entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { instanceToPlain } from 'class-transformer';
import { TokenAuthGuard } from './guards/token-auth.guard';
import { Request } from 'express';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() signUpDto: SignUpDto) {
    return await this.authService.register(signUpDto);
  }

  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    return await this.authService.login(signInDto);
  }
  @UseGuards(TokenAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const bearerToken = req.headers.authorization?.split(' ')[1];
    if (!bearerToken) throw new UnauthorizedException('No token provided');
    return await this.authService.logout(bearerToken);
  }
  @UseGuards(TokenAuthGuard)
  @Get('me')
  async me(@GetUser() user: User) {
    return instanceToPlain(user);
  }
}
