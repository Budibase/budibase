export function getAppMetadata(appId: string): object;
export function invalidateAppMetadata(appId: string, newMetadata?: object | undefined): Promise<void>;
