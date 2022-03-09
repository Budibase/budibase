import { PluginItem } from 'next/dist/compiled/babel/core';
declare type StyledJsxPlugin = [string, any] | string;
declare type StyledJsxBabelOptions = {
    plugins?: StyledJsxPlugin[];
    'babel-test'?: boolean;
} | undefined;
declare type NextBabelPresetOptions = {
    'preset-env'?: any;
    'preset-react'?: any;
    'class-properties'?: any;
    'transform-runtime'?: any;
    'styled-jsx'?: StyledJsxBabelOptions;
    'preset-typescript'?: any;
};
declare type BabelPreset = {
    presets?: PluginItem[] | null;
    plugins?: PluginItem[] | null;
    sourceType?: 'script' | 'module' | 'unambiguous';
    overrides?: Array<{
        test: RegExp;
    } & Omit<BabelPreset, 'overrides'>>;
};
declare const _default: (api: any, options?: NextBabelPresetOptions) => BabelPreset;
export default _default;
