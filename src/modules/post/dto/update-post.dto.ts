import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  delete_images?: number[];
}
