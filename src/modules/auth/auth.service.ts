import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { createHash, randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private tokenExpiresInTime: number;
  constructor(
    @InjectRepository(User) private readonly usersRespository: Repository<User>,
    private readonly bcryptService: BcryptService,
    @InjectRepository(PersonalAccessToken)
    private readonly accessTokenRepository: Repository<PersonalAccessToken>,
    private readonly configService: ConfigService,
  ) {
    this.tokenExpiresInTime = Number(
      this.configService.get('TOKEN_EXPIRE_IN_MINUTES'),
    );
  }

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
    const token = await this.generateToken(user, 'Login token');
    const safeUser = instanceToInstance(user);
    return createResponse('success', 'Login Successfully', {
      user: safeUser,
      token,
    });
  }
  async logout(bearerToken: string) {
    if (!bearerToken) throw new UnauthorizedException('Invalid Token');
    const hashedToken = createHash('sha256').update(bearerToken).digest('hex');
    const tokenRecord = await this.accessTokenRepository.findOneBy({
      token: hashedToken,
    });
    if (!tokenRecord) throw new NotFoundException('Token not found');
    await this.accessTokenRepository.softDelete(tokenRecord.id);
    return createResponse('success', 'Logout Successfully');
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRespository.findOneBy({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const isMatch = await this.bcryptService.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');
    return user;
  }

  async validateToken(bearerToken: string) {
    if (!bearerToken) throw new UnauthorizedException();

    const hashedToken = createHash('sha256').update(bearerToken).digest('hex');

    const tokenRecord = await this.accessTokenRepository.findOne({
      where: { token: hashedToken },
      relations: ['user'],
    });
    if (!tokenRecord) throw new UnauthorizedException();

    const tokenExpiration = new Date();

    tokenExpiration.setMinutes(
      tokenExpiration.getMinutes() - this.tokenExpiresInTime,
    );
    if (
      tokenRecord.last_used_at &&
      tokenRecord.last_used_at < tokenExpiration
    ) {
      await this.accessTokenRepository.delete(tokenRecord.id);
      throw new UnauthorizedException('Token expired');
    }
    tokenRecord.last_used_at = new Date();
    await this.accessTokenRepository.save(tokenRecord);

    return tokenRecord.user;
  }

  private async generateToken(
    user: User,
    tokenName = 'Login Token',
  ): Promise<string> {
    const plainToken = randomBytes(40).toString('hex');
    const hashedToken = createHash('sha256').update(plainToken).digest('hex');

    const accessToken = this.accessTokenRepository.create({
      user_id: user.id,
      name: tokenName,
      token: hashedToken,
      role: user.role,
      last_used_at: new Date(),
    });
    try {
      await this.accessTokenRepository.save(accessToken);
      return plainToken;
    } catch {
      throw new InternalServerErrorException('Failed to generate access token');
    }
  }
}
