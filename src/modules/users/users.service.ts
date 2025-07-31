import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ApiRResponse, createResponse } from 'src/shared/utils/response.util';
import { instanceToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<ApiRResponse<User | null>> {
    const user = await this.userRespository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const response = instanceToInstance(user);
    return createResponse('success', 'Found User', response);
  }
}
