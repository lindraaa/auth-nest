import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Post as PostEntity } from './entities/post.entity';

@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<PostEntity>> {
    return this.postService.findAll(query);
  }

  @Get('byUser/:id')
  findAllPost(@Param('id') user_id: number) {
    return this.postService.findAllPost(user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
