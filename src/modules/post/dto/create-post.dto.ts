import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The title of the post' })
  @IsNotEmpty({ message: 'The title is required' })
  title: string;

  @ApiProperty({ description: 'The content of the spost' })
  @IsNotEmpty({ message: 'The content is required' })
  content: string;

  // @ApiProperty({ description: 'Posts by user' })
  // @IsNotEmpty({ message: 'The user id is required' })
  // user_id: number;
}
