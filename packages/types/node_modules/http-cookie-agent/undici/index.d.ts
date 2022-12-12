import type { CookieJar } from 'tough-cookie';
import type { Agent, Client } from 'undici';

export interface CookieOptions {
  async_UNSTABLE?: true;
  jar: CookieJar;
}

export namespace CookieAgent {
  export interface Options extends Agent.Options {
    cookies?: CookieOptions | undefined;
  }
}

export class CookieAgent extends Agent {
  constructor(options?: CookieAgent.Options);
}

export namespace CookieClient {
  export interface Options extends Client.Options {
    cookies?: CookieOptions | undefined;
  }
}

export class CookieClient extends Client {
  constructor(url: string | URL, options?: CookieClient.Options);
}

export function createCookieClient<BaseClient extends Client = Client, BaseClientOptions = unknown>(
  BaseClientClass: new (origin: string | URL, options: BaseClientOptions) => BaseClient,
): new (origin: string | URL, options?: BaseClientOptions & { cookies?: CookieOptions | undefined }) => BaseClient;
