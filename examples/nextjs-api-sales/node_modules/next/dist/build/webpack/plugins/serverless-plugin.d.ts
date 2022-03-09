import { webpack } from 'next/dist/compiled/webpack/webpack';
/**
 * Makes sure there are no dynamic chunks when the target is serverless
 * The dynamic chunks are integrated back into their parent chunk
 * This is to make sure there is a single render bundle instead of that bundle importing dynamic chunks
 */
export declare class ServerlessPlugin {
    apply(compiler: webpack.Compiler): void;
}
