import { NextBabelLoaderOptions, NextJsLoaderContext } from './types';
declare type BabelConfig = any;
export default function getConfig(this: NextJsLoaderContext, { source, target, loaderOptions, filename, inputSourceMap, }: {
    source: string;
    loaderOptions: NextBabelLoaderOptions;
    target: string;
    filename: string;
    inputSourceMap?: object | null;
}): BabelConfig;
export {};
