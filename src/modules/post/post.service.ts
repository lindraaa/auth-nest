import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { ApiRResponse, createResponse } from 'src/shared/utils/response.util';
import { instanceToInstance } from 'class-transformer';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}
  async findAll(query: PaginateQuery): Promise<Paginated<Post>> {
    return paginate(query, this.postRepository, {
      sortableColumns: ['title'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 10,
      searchableColumns: ['title', 'content'],
    });
  }
  async create(createPostDto: CreatePostDto): Promise<ApiRResponse<Post>> {
    const user = await this.usersRepository.findOneBy({
      id: createPostDto.user_id,
    });
    if (!user) throw new NotFoundException('User not Found');
    const post = await this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      user: user,
    });
    const savePost = await this.postRepository.save(post);
    const response = instanceToInstance(savePost);
    return createResponse('success', 'Post created succesffully', response);
  }
  //find all post by user id
  async findAllPost(user_id: number) {
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
  async findOne(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    return createResponse('success', 'Post found', post);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
