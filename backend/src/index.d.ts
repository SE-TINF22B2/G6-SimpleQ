export type ory = typeof import('@ory/client');

declare global {
  namespace NodeJS {
    declare interface ProcessEnv {
      ORY_URL: string;
      APP_URL: string;
      NODE_ENV: string;
      DATABASE_URL: string;
    }
  }
}
