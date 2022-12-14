import type http from 'node:http';
import type https from 'node:https';

import type { CookieJar } from 'tough-cookie';

export interface CookieOptions {
  async_UNSTABLE?: true;
  jar: CookieJar;
}

export type CookieAgentOptions = {
  cookies?: CookieOptions | undefined;
};

type CookieAgent<BaseAgent extends http.Agent> = BaseAgent;

export function createCookieAgent<
  BaseAgent extends http.Agent = http.Agent,
  BaseAgentOptions = unknown,
  BaseAgentConstructorRestParams extends unknown[] = unknown[],
>(
  BaseAgent: new (options: BaseAgentOptions, ...rest: BaseAgentConstructorRestParams) => BaseAgent,
): new (
  options: BaseAgentOptions & CookieAgentOptions,
  ...rest: BaseAgentConstructorRestParams
) => CookieAgent<BaseAgent>;

export const HttpCookieAgent: new (options: http.AgentOptions & CookieAgentOptions) => CookieAgent<http.Agent>;
export const HttpsCookieAgent: new (options: https.AgentOptions & CookieAgentOptions) => CookieAgent<https.Agent>;
export const MixedCookieAgent: new (
  options: http.AgentOptions & https.AgentOptions & CookieAgentOptions,
) => CookieAgent<https.Agent>;
