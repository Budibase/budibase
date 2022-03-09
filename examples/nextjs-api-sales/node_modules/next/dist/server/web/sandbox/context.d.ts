/// <reference types="node" />
import type { Context } from 'vm';
/**
 * For a given path a context, this function checks if there is any module
 * context that contains the path with an older content and, if that's the
 * case, removes the context from the cache.
 */
export declare function clearModuleContext(path: string, content: Buffer | string): void;
/**
 * For a given module name this function will create a context for the
 * runtime. It returns a function where we can provide a module path and
 * run in within the context. It may or may not use a cache depending on
 * the parameters.
 */
export declare function getModuleContext(options: {
    module: string;
    onWarning: (warn: Error) => void;
    useCache: boolean;
    env: string[];
}): {
    context: Context;
    runInContext: (paramPath: string) => void;
};
