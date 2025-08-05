import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from '../../post.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly postService: PostService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log('Ownership');
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const post_id = Number(request.params.id);
    // console.log(post_id);

    const post = await this.postService.findOne(post_id); //From the post service reuse
    if (!post) throw new NotFoundException('Post not found');

    if (user.role === 'admin') {
      return true;
    }
    if (post.data?.user_id !== user.id) {
      throw new ForbiddenException('You do not own this post');
    }

    return true;
  }
}
