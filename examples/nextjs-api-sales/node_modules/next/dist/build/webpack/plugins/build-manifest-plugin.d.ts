import { webpack } from 'next/dist/compiled/webpack/webpack';
import { CustomRoutes } from '../../../lib/load-custom-routes';
export declare type ClientBuildManifest = Record<string, string[]>;
export default class BuildManifestPlugin {
    private buildId;
    private rewrites;
    private isDevFallback;
    private exportRuntime;
    constructor(options: {
        buildId: string;
        rewrites: CustomRoutes['rewrites'];
        isDevFallback?: boolean;
        exportRuntime?: boolean;
    });
    createAssets(compiler: any, compilation: any, assets: any): any;
    apply(compiler: webpack.Compiler): void;
}
