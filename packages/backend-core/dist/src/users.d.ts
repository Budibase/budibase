export function getGlobalUserByEmail(email: string): Promise<object | null>;
export function searchGlobalUsersByApp(appId: any, opts: any): Promise<any[]>;
export function getGlobalUserByAppPage(appId: any, user: any): string | undefined;
export function searchGlobalUsersByEmail(email: any, opts: any): Promise<any[]>;
