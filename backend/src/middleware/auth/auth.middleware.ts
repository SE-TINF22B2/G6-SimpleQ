import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Session } from '@ory/client';
import { Request } from 'express';
import allowedRequests from './allowed';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: any, next: () => void) {
    let result: { data: Session } | null = null;
    try {
            result = await global.ory.toSession({
        cookie: req.header('cookie'),
      });
      if (result) {
                if (result.data?.identity?.id) {
                    await this.authService.checkUser(result.data as unknown as Session);
          //@ts-ignore
          req.userId = result.data.identity.id;

        }
      }
    } catch (e) {
      if (allowedRequests.some((a) => req.baseUrl.includes(a))) {
        next();
        return;
      }
      throw new UnauthorizedException('You are not logged in!');
    }
    if (result || allowedRequests.some((a) => req.baseUrl.includes(a))) {
      next();
    } else {
      throw new UnauthorizedException('You are not logged in');
    }
  }
}
