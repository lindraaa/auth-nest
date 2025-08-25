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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageValidationPipe } from '../upload/image-validation/image-validation.pipe';

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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, file.originalname);
        },
      }),
    }),
  )
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ): Promise<ApiRResponse<PostEntity>> {
    console.log(createPostDto, image);
    return this.postService.create(createPostDto, image);
  }
  @UseGuards(OwnershipGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ApiRResponse<PostEntity | null>> {
    return this.postService.update(id, updatePostDto);
  }
  @UseGuards(OwnershipGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ApiRResponse<void>> {
    return this.postService.remove(id);
  }
}
