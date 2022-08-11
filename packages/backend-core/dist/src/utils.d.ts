export function getAppIdFromCtx(ctx: object): string | undefined;
export function openJwt(token: any): object;
export function getCookie(ctx: object, name: string): any;
export function setCookie(ctx: object, value: string | object, name?: string, opts?: object): void;
export function clearCookie(ctx: any, name: any): void;
export function isClient(ctx: object): boolean;
export function getBuildersCount(): Promise<number>;
export function platformLogout({ ctx, userId, keepActiveSession }: {
    ctx: any;
    userId: any;
    keepActiveSession: any;
}): Promise<void>;
export function timeout(timeMs: any): Promise<any>;
