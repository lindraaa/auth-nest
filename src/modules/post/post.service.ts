import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { ApiRResponse, createResponse } from 'src/shared/utils/response.util';
import { instanceToInstance } from 'class-transformer';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { RequestContext } from 'src/request-context/request-context';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly requestContext: RequestContext,
  ) {}
  async findAll(query: PaginateQuery): Promise<ApiRResponse<Paginated<Post>>> {
    const response = await paginate(query, this.postRepository, {
      sortableColumns: ['title'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 10,
      searchableColumns: ['title', 'content'],
    });
    return createResponse('success', 'list of Posts', response);
  }
  async create(createPostDto: CreatePostDto): Promise<ApiRResponse<Post>> {
    // const user = await this.usersRepository.findOneBy({
    //   id: createPostDto.user_id,
    // });
    // if (!user) throw new NotFoundException('User not Found');
    const userId = this.requestContext.getUserId();
    // console.log(userId);
    if (!userId) throw new UnauthorizedException('User not authenticated');
    const post = await this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      user_id: userId,
    });
    const savePost = await this.postRepository.save(post);
    const response = instanceToInstance(savePost);
    return createResponse('success', 'Post created succesffully', response);
  }
  //find all post by user id
  async findAllPost(user_id: number): Promise<ApiRResponse<User>> {
    const postByUser = await this.usersRepository.findOne({
      where: { id: user_id },
      relations: ['posts'],
    });

    if (!postByUser) throw new NotFoundException('User not found ');
    const respone = instanceToInstance(postByUser);
    return createResponse(
      'success',
      `List of Post by User #${postByUser?.id}`,
      respone,
    );
  }
  //find post by id
  async findOne(id: number): Promise<ApiRResponse<Post>> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) throw new NotFoundException('Post not found');

    return createResponse('success', 'Post found', instanceToInstance(post));
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<ApiRResponse<Post | null>> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    const userId = this.requestContext.getUserId();
    if (!userId) throw new UnauthorizedException('User not authenticated');
    const updateData = {
      ...updatePostDto,
      updated_by: userId,
    };
    const data = await this.postRepository.merge(post, updateData);
    await this.postRepository.save(data);
    return createResponse('success', 'Update Post Succeffully', data);
  }

  async remove(id: number): Promise<ApiRResponse<void>> {
    const post = await this.postRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    await this.postRepository.softDelete(id);
    return createResponse('success', 'Delete Post Succeffully');
  }
}
