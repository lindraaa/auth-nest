import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Post as PostEntity } from './entities/post.entity';
import { ApiRResponse } from 'src/shared/utils/response.util';
import { User } from '../users/entities/user.entity';
import { TokenAuthGuard } from '../auth/guards/token-auth.guard';
import { OwnershipGuard } from './guards/ownership/ownership.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageValidationPipe } from '../upload/image-validation/image-validation.pipe';
import { storage } from 'src/config/storage.config';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @UseGuards(TokenAuthGuard)
  @Get()
  findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<ApiRResponse<Paginated<PostEntity>>> {
    return this.postService.findAll(query);
  }

  // @UseGuards(TokenAuthGuard)
  @Get('byUser/:id')
  findAllPost(
    @Param('id', ParseIntPipe) user_id: number,
  ): Promise<ApiRResponse<User>> {
    return this.postService.findAllPost(user_id);
  }

  // @UseGuards(TokenAuthGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiRResponse<PostEntity>> {
    return this.postService.findOne(id);
  }
  // @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('image', 10, { storage }))
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles(ImageValidationPipe) images?: Array<Express.Multer.File>,
  ): Promise<ApiRResponse<PostEntity>> {
    console.log(createPostDto, images);
    return this.postService.create(createPostDto, images);
  }
  @UseGuards(OwnershipGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('image', 10, { storage }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles(ImageValidationPipe) images?: Array<Express.Multer.File>,
  ): Promise<ApiRResponse<PostEntity | null>> {
    return this.postService.update(id, updatePostDto, images);
  }
  @UseGuards(OwnershipGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ApiRResponse<void>> {
    return this.postService.remove(id);
  }
}
