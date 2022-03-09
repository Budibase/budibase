import { webpack } from 'next/dist/compiled/webpack/webpack';
import { FontManifest } from '../../../server/font-utils';
export declare class FontStylesheetGatheringPlugin {
    compiler?: webpack.Compiler;
    gatheredStylesheets: Array<string>;
    manifestContent: FontManifest;
    isLikeServerless: boolean;
    constructor({ isLikeServerless }: {
        isLikeServerless: boolean;
    });
    private parserHandler;
    apply(compiler: webpack.Compiler): void;
}
