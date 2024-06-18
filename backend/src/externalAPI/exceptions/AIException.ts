import { Logger } from '@nestjs/common';

export class AIException extends Error {
  constructor(ai_model: string, context: string, message: string) {
    super(`${ai_model} ${context},  ${message}`);
    Logger.log(`${ai_model} request failed, >${message}<`, context);
  }
}
