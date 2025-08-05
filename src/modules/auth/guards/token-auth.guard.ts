import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const request = context.switchToHttp().getRequest<Request>();
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed token');
    }
    // console.log(authHeader);
    const token = authHeader.split(' ')[1];
    // console.log(token);
    const user = await this.authService.validateToken(token);
    if (!user) throw new UnauthorizedException('Invalid or expired token');

    request.user = user;
    return true;
  }
}
