import { CookieJar } from './';

declare function c(fetch: Function, jar?: CookieJar, ignoreError?: boolean): Function;

export = c;
