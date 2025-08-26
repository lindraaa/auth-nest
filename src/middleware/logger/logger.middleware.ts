import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const now = new Date().toISOString();
    const { method, originalUrl } = req;
    console.log(`[${now}] ${method} ${originalUrl}`);
    // console.log('Request:', {
    //   method: req.method,
    //   url: req.originalUrl,
    //   headers: req.headers,
    //   body: req.body,
    //   params: req.params,
    //   query: req.query,
    // });
    res.on('finish', () => {
      const status = res.statusCode;
      const statusMessage = status >= 400 ? '❌ Error ' : '✅ Success ';
      console.log(
        `[${now}] ${status} ${statusMessage} - ${method} ${originalUrl}`,
      );
    });

    next();
  }
}
