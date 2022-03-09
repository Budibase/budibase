/// <reference types="node" />
import type { Context } from 'vm';
/**
 * Allows to require a series of dependencies provided by their path
 * into a provided module context. It fills and accepts a require
 * cache to ensure each module is loaded once.
 */
export declare function requireDependencies(params: {
    context: Context;
    requireCache: Map<string, any>;
    dependencies: {
        mapExports: {
            [key: string]: string;
        };
        path: string;
    }[];
}): void;
