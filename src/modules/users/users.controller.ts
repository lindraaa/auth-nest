import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { TokenAuthGuard } from '../auth/guards/token-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(TokenAuthGuard, RolesGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get('test')
  test() {
    return 'You are admin authorized for this endpoint';
  }
  @Get('test1')
  @Roles(Role.User)
  test1() {
    return 'You are user authorized for this endpoint';
  }
}
