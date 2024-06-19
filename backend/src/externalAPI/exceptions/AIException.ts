export class AIException extends Error {
  constructor(ai_model: string, message: string) {
    super(`${ai_model}, ${message}`);
  }
}
