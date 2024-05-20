import {
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {UserService} from "../database/user/user.service";
import {Session} from "@ory/client";
import {User} from "@prisma/client";

@Injectable()
export class AuthService {

  constructor(private userService: UserService) {}

  /**
   * This method uses an ory session to
   * */
  async checkUser(session: Session) {
    const possibleUser : User | null = await this.userService.getUser(session?.identity?.id as string);
    if(!possibleUser) {
        const result = await this.userService.createUser(
            session.identity?.traits.username as string,
            false,
            false,
            new Date(),
            0,
            session.identity?.traits.email as string,
            session?.identity?.id as string,
        )
    }
  }

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
        if (e?.response?.data?.error?.code == 401 || e?.response.data.statusCode == 401) {
          return res.redirect(
            `${process.env.ORY_URL}/ui/login?return_to=${encodeURI(`${process.env.APP_URL}/cookie`)}`,
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
