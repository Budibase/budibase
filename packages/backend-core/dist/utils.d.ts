declare const _exports: {
    hash: (data: any) => Promise<any>;
    compare: (data: any, encrypted: any) => Promise<any>;
    newid: () => string;
    getAppIdFromCtx: (ctx: object) => string | undefined;
    openJwt: (token: any) => object;
    getCookie: (ctx: object, name: string) => any;
    setCookie: (ctx: object, value: string | object, name?: string, opts?: object) => void;
    clearCookie: (ctx: any, name: any) => void;
    isClient: (ctx: object) => boolean;
    getBuildersCount: () => Promise<number>;
    platformLogout: ({ ctx, userId, keepActiveSession }: {
        ctx: any;
        userId: any;
        keepActiveSession: any;
    }) => Promise<void>;
    timeout: (timeMs: any) => Promise<any>;
};
export = _exports;
