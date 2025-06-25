import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/modules/users/entities/user.entity';

export class SignUpDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsNotEmpty({ message: 'The name is required' })
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsNotEmpty({ message: 'The password is required' })
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'The role of the user' })
  @IsNotEmpty({ message: 'The role is required' })
  @IsEnum(Role)
  role: Role;
}
