import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import databaseConfig from 'src/config/database.config';
@Module({
  imports: [
    // ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     DB_HOST: Joi.required(),
    //     DB_USERNAME: Joi.required(),
    //     DB_PASSWORD: Joi.required(),
    //     DB_NAME: Joi.required(),
    //   }),
    // }),
    ConfigModule.forRoot({ load: [databaseConfig] }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
