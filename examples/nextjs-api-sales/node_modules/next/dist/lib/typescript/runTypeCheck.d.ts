export interface TypeCheckResult {
    hasWarnings: boolean;
    warnings?: string[];
    inputFilesCount: number;
    totalFilesCount: number;
    incremental: boolean;
}
export declare function runTypeCheck(ts: typeof import('typescript'), baseDir: string, tsConfigPath: string, cacheDir?: string): Promise<TypeCheckResult>;
