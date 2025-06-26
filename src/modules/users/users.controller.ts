import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { TokenAuthGuard } from '../auth/guards/token-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { instanceToPlain } from 'class-transformer';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(TokenAuthGuard)
  @Get('test')
  test() {
    return 'You are authorized for this endpoint';
  }
  @UseGuards(TokenAuthGuard)
  @Get('me')
  async me(@GetUser() user: User) {
    return instanceToPlain(user);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
