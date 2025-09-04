import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import seeds from './seeds';
import { User } from 'src/modules/users/entities/user.entity';
import { PersonalAccessToken } from 'src/modules/auth/entities/personal-access-token-entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Upload } from 'src/modules/upload/entities/upload.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, PersonalAccessToken, Post, Upload],
  migrations: [__dirname + '/src/database/migrations/*{.ts,.js}'],
  synchronize: false,
});

export async function runSeeder() {
  await AppDataSource.initialize();
  for (const seeder of seeds) {
    await seeder(AppDataSource);
  }
  console.log('All seeders executed');
  await AppDataSource.destroy();
  //yarn seed all
}

runSeeder();
