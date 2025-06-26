import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsNotEmpty({ message: 'The password is required' })
  @MinLength(6)
  password: string;
}
