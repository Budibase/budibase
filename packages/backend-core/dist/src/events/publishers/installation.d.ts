export declare function versionChecked(version: string): Promise<void>;
export declare function upgraded(from: string, to: string): Promise<void>;
export declare function downgraded(from: string, to: string): Promise<void>;
export declare function firstStartup(): Promise<void>;
