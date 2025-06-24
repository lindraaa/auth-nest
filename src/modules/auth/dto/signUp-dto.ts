import { IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/modules/users/entities/user.entity';

export class SignUpDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
