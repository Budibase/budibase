/**
 * Removes the trailing slash of a path if there is one. Preserves the root path `/`.
 */
export declare function removePathTrailingSlash(path: string): string;
/**
 * Normalizes the trailing slash of a path according to the `trailingSlash` option
 * in `next.config.js`.
 */
export declare const normalizePathTrailingSlash: (path: string) => string;
