import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { PersonalAccessToken } from './entities/personal-access-token-entity';
import { SignUpDto } from './dto/signUp-dto';
import { ApiRResponse, createResponse } from 'src/shared/utils/response.util';
import { BcryptService } from './hashing/bcrypt.service';
import { instanceToInstance } from 'class-transformer';
import { SignInDto } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRespository: Repository<User>,
    private readonly bcryptService: BcryptService,
    @InjectRepository(PersonalAccessToken)
    private readonly accessTokenRepository: Repository<PersonalAccessToken>,
  ) {}

  async register(signUpDto: SignUpDto): Promise<ApiRResponse<User>> {
    const isExisting = await this.usersRespository.exists({
      where: { email: signUpDto.email },
    });
    if (isExisting) throw new ConflictException('Email already exist');

    const user = this.usersRespository.create({
      name: signUpDto.name,
      email: signUpDto.email,
      password: await this.bcryptService.hash(signUpDto.password),
      role: signUpDto.role,
    });
    const savedUser = await this.usersRespository.save(user);
    const transformUser = instanceToInstance(savedUser); // exluded the password
    return createResponse(
      'success',
      'User registered successfully',
      transformUser,
    );
  }

  async login(sigInDto: SignInDto) {
    const user = await this.validateUser(sigInDto.email, sigInDto.password);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRespository.findOneBy({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const isMatch = await this.bcryptService.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');
    return user;
  }
}
