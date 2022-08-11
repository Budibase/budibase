import { CookieJar } from './';

declare function c<T extends Function>(fetch: T, jar?: CookieJar, ignoreError?: boolean): T;

export = c;
