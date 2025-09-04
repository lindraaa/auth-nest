import { Role } from 'src/modules/auth/enums/role.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function UsersSeeder(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  console.log('Seeding Users...');

  const users = [
    {
      name: 'SUPERADMIN',
      email: 'SUPERADMIN',
      role: Role.Admin,
      password: await bcrypt.hash('SUPERADMIN', 10),
    },
    {
      name: 'User',
      email: 'user@gmail.com',
      role: Role.User,
      password: await bcrypt.hash('user123', 10),
    },
    {
      name: 'test',
      email: 'test123@gmail.com',
      role: Role.User,
      password: await bcrypt.hash('test123', 10),
    },
  ];

  for (const user of users) {
    const exist = await userRepository.findOne({
      where: { email: user.email },
      withDeleted: true,
    });
    if (!exist) {
      await userRepository.save(user);
      console.log(`✅ User "${user.email}" created`);
    } else {
      console.log(`⚠️  User "${user.email}" already exists`);
    }
  }

  console.log('Users seeding finished');
}
