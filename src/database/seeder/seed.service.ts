import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { title } from 'process';
import { PersonalAccessToken } from 'src/modules/auth/entities/personal-access-token-entity';
import { Role } from 'src/modules/auth/enums/role.enum';
import { BcryptService } from 'src/modules/auth/hashing/bcrypt.service';
import { Post } from 'src/modules/post/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PersonalAccessToken)
    private readonly patRespository: Repository<PersonalAccessToken>,
    private readonly bcryptService: BcryptService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async run() {
    // Clear existing data
    await this.userRepository.query('DELETE FROM users');
    await this.userRepository.query('ALTER TABLE users AUTO_INCREMENT = 1');

    await this.patRespository.query('TRUNCATE TABLE personal_access_tokens');
    await this.postRepository.query('TRUNCATE TABLE post');

    // Seed new data
    const users = await this.userRepository.save([
      {
        name: 'Admin',
        email: 'admin123@gmail.com',
        role: Role.Admin,
        password: await this.bcryptService.hash('admin123'),
      },
      {
        name: 'User',
        email: 'user@gmail.com',
        role: Role.User,
        password: await this.bcryptService.hash('user123'),
      },
      {
        name: 'Test',
        email: 'test@gmail.com',
        role: Role.User,
        password: await this.bcryptService.hash('test123'),
      },
    ]);
    const posts = [
      {
        title: 'Post 1 ',
        content: 'The content',
        user: users[1],
      },
      {
        title: 'Post 2 ',
        content: 'The content',
        user: users[1],
      },
      {
        title: 'Post 3 ',
        content: 'The content',
        user: users[2],
      },
    ];

    await this.postRepository.save(posts);
  }
}
