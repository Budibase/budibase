import { SyncOpts } from 'resolve';
export declare const interfaceVersion = 2;
export declare type TsResolverOptions = SyncOpts & {
    alwaysTryTypes?: boolean;
    /**
     * @deprecated use `project` instead
     */
    directory?: string[] | string;
    project?: string[] | string;
    extensions?: string[];
    packageFilter?: (pkg: Record<string, string>) => Record<string, string>;
};
/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @param {TsResolverOptions} options
 */
export declare function resolve(source: string, file: string, options: TsResolverOptions | null): {
    found: boolean;
    path?: string | null;
};
