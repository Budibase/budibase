import type { webpack5 } from 'next/dist/compiled/webpack/webpack';
declare type CssMinimizerPluginOptions = {
    postcssOptions: {
        map: false | {
            prev?: string | false;
            inline: boolean;
            annotation: boolean;
        };
    };
};
export declare class CssMinimizerPlugin {
    __next_css_remove: boolean;
    private options;
    constructor(options: CssMinimizerPluginOptions);
    optimizeAsset(file: string, asset: any): Promise<import("webpack-sources1").RawSource | import("webpack-sources1").SourceMapSource>;
    apply(compiler: webpack5.Compiler): void;
}
export {};
