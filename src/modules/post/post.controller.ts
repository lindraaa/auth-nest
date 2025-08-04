import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Post as PostEntity } from './entities/post.entity';
import { ApiRResponse } from 'src/shared/utils/response.util';
import { User } from '../users/entities/user.entity';
import { TokenAuthGuard } from '../auth/guards/token-auth.guard';

@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(TokenAuthGuard)
  @Get()
  findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<ApiRResponse<Paginated<PostEntity>>> {
    return this.postService.findAll(query);
  }

  @UseGuards(TokenAuthGuard)
  @Get('byUser/:id')
  findAllPost(@Param('id') user_id: number): Promise<ApiRResponse<User>> {
    return this.postService.findAllPost(user_id);
  }

  @UseGuards(TokenAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<ApiRResponse<PostEntity>> {
    return this.postService.findOne(id);
  }
  @UseGuards(TokenAuthGuard)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
  ): Promise<ApiRResponse<PostEntity>> {
    return this.postService.create(createPostDto);
  }
  @UseGuards(TokenAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ApiRResponse<PostEntity | null>> {
    return this.postService.update(id, updatePostDto);
  }
  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<ApiRResponse<void>> {
    return this.postService.remove(id);
  }
}
