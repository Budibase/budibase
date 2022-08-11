declare namespace c {
  interface CookieJar {
    getCookieString(currentUrl: string, cb: (err: any, cookies: string) => void): void;
    setCookie(cookieString: string, currentUrl: string, opts: { ignoreError: boolean }, cb: (err: any) => void): void;
  }
}

declare function c<T extends Function>(fetch: T, jar?: c.CookieJar, ignoreError?: boolean): T;

export = c;
