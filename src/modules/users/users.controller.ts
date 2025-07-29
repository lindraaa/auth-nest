import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { TokenAuthGuard } from '../auth/guards/token-auth.guard';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(TokenAuthGuard)
  @Get('test')
  test() {
    return 'You are authorized for this endpoint';
  }
}
