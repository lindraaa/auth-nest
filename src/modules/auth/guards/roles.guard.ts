import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(), // these methods extract both controller and method metadata at once,
    ]);
    // if (!roles) {
    //   console.log('No roles');
    //   return true;
    // }
    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    // console.log('request:', request);
    // console.log(user);
    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }
    console.log(roles);
    console.log(roles.includes(user.role));
    return true;
  }
}
