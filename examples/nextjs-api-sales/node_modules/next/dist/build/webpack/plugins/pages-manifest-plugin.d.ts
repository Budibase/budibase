import { webpack } from 'next/dist/compiled/webpack/webpack';
export declare type PagesManifest = {
    [page: string]: string;
};
export default class PagesManifestPlugin implements webpack.Plugin {
    serverless: boolean;
    dev: boolean;
    constructor({ serverless, dev }: {
        serverless: boolean;
        dev: boolean;
    });
    createAssets(compilation: any, assets: any): void;
    apply(compiler: webpack.Compiler): void;
}
