import { webpack } from 'next/dist/compiled/webpack/webpack';
export declare const ampFirstEntryNamesMap: WeakMap<webpack.compilation.Compilation, string[]>;
export declare class DropClientPage implements webpack.Plugin {
    ampPages: Set<unknown>;
    apply(compiler: webpack.Compiler): void;
}
