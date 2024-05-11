import {
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  /**
   * This request is only for development purposes
   * It offers the client the possiblity to login to ory and get the cookie needed to send requests to this backend
   * Makes it easier to test the features, as the client dont have to copy the cookie from the frontend.
   */
  async getCookie(req: Request, res: Response) {
    if (process.env.NODE_ENV == 'dev') {
      try {
        const result = await global.ory.toSession({
          cookie: req.headers.cookie,
        });
        if (result) {
          return res.json({ cookie: result.config.headers.Cookie });
        }
      } catch (e) {
        if (e?.response?.data?.error?.code == 401) {
          return res.redirect(
            `${process.env.ORY_URL}/ui/login?return_to=${encodeURI('http://localhost:3000/cookie')}`,
          );
        }

        throw new ServiceUnavailableException(
          'The ory backend or tunnel is currently not available',
        );
      }
    } else {
      throw new ForbiddenException(
        'This request is only allowed for development purposes.',
      );
    }
  }
}
