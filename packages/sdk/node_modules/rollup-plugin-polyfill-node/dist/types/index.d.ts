import type { Plugin } from "rollup";
import { RollupInjectOptions } from "@rollup/plugin-inject";
export interface NodePolyfillsOptions {
    baseDir?: string;
    sourceMap?: RollupInjectOptions['sourceMap'];
    include?: Array<string | RegExp> | string | RegExp | null;
    exclude?: Array<string | RegExp> | string | RegExp | null;
}
export default function (opts?: NodePolyfillsOptions): Plugin;
