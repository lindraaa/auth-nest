import { Exclude } from 'class-transformer';
import { PersonalAccessToken } from 'src/modules/auth/entities/personal-access-token-entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User, nullable: false })
  role: Role;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @Column({ type: 'int', nullable: true })
  created_by: number;

  @Exclude()
  @Column({ type: 'int', nullable: true })
  updated_by: number;

  @Exclude()
  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => PersonalAccessToken, (token) => token.user_id)
  tokens: PersonalAccessToken[];
}
