import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { isInstance } from 'class-validator';

@Injectable()
export class AppService {
  FooIsUUID(userId: string): boolean {
    const regexCheckUUID: RegExp =
      /^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$/;
    if (!isInstance(userId, String)) {
      throw new InternalServerErrorException('userID is no String');
    }
    return regexCheckUUID.test(userId);
  }

  getUserId(req: any): string {
    const userId: string = req.headers.cookie.id;
    if (userId === null) {
      throw new ForbiddenException();
    }
    if (!this.FooIsUUID(userId)) {
      throw new InternalServerErrorException();
    }
    return userId;
  }
}
