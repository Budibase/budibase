/**
 * Recursively read directory
 * @param  {string[]=[]} arr This doesn't have to be provided, it's used for the recursion
 * @param  {string=dir`} rootDir Used to replace the initial path, only the relative path is left, it's faster than path.relative.
 * @returns Array holding all relative paths
 */
export declare function recursiveReadDirSync(dir: string, arr?: string[], rootDir?: string): string[];
