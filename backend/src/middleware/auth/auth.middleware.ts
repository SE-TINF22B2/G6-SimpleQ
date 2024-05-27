import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Session } from '@ory/client';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    let result: { data: Session } | null = null;
    try {
      result = await global.ory.toSession({
        cookie: req.header('cookie'),
      });
      console.log(result);
      if (result) {
        if (result.data?.identity?.id) {
          await this.authService.checkUser(result.data as unknown as Session);
          req.userId = result.data.identity.id;
          console.log(req);
        }
      }
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('You are not logged in!');
    }
    if (result) {
      next();
    } else {
      throw new UnauthorizedException('You are not logged in');
    }
  }
}
