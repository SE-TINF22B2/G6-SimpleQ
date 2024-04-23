import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    let result;
    try {
      result = await global.ory.toSession({
        cookie: req.header('cookie'),
      });
    } catch (e) {
      res.redirect(`${process.env.ORY_URL}/ui/login`);
    }
    if (result) {
      next();
    } else {
      res.redirect(`${process.env.ORY_URL}/ui/login`);
    }
  }
}
