import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContext } from './request-context';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(
    @Inject(RequestContext)
    private readonly requestContext: RequestContext,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('From Interceptors');
    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    // console.log(request.user);
    if (user) {
      this.requestContext.setUser(user);
    }

    return next.handle();
  }
}
