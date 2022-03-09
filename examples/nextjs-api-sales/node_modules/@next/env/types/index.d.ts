export declare type Env = {
    [key: string]: string;
};
export declare type LoadedEnvFiles = Array<{
    path: string;
    contents: string;
}>;
declare type Log = {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
};
export declare function processEnv(loadedEnvFiles: LoadedEnvFiles, dir?: string, log?: Log): Env;
export declare function loadEnvConfig(dir: string, dev?: boolean, log?: Log): {
    combinedEnv: Env;
    loadedEnvFiles: LoadedEnvFiles;
};
export {};
