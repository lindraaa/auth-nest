import { Injectable, Scope } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
//Scope.REQUEST means NestJS creates a new copy of the class for every incoming request, so data stays separate and safe for each user.
export class RequestContext {
  private _user: User | null = null;
  setUser(user: User) {
    this._user = user;
  }
  getUser(): User | null {
    return this._user;
  }
  getUserId(): number | null {
    return this._user?.id || null;
  }
}
