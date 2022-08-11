declare namespace c {
  interface CookieJar {
    getCookieString(currentUrl: string, cb: (err: any, cookies: string) => void): void;
    setCookie(cookieString: string, currentUrl: string, cb: (err: any) => void, opts: { ignoreError: boolean }): void;
  }
}

declare function c(fetch: Function, jar?: c.CookieJar, ignoreError?: boolean): Function;

export = c;
