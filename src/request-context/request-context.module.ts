import { Module, Scope } from '@nestjs/common';
import { RequestContext } from './request-context';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestContextInterceptor } from './request-context.interceptor';

@Module({
  providers: [
    {
      provide: RequestContext,
      useClass: RequestContext,
      scope: Scope.REQUEST,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
      scope: Scope.REQUEST,
    },
  ],
  exports: [RequestContext],
})
export class RequestContextModule {}
