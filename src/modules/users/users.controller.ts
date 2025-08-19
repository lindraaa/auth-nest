import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { TokenAuthGuard } from '../auth/guards/token-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
// @UseGuards(TokenAuthGuard)
@Controller('api/v1/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get('admin')
  atest() {
    return 'You are admin authorized for this endpoint';
  }
  @Get('user')
  @Roles(Role.User)
  test1() {
    return 'You are user authorized for this endpoint';
  }

  // @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
}
