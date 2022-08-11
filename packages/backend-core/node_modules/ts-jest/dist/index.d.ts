import { TsJestTransformer } from './ts-jest-transformer';
export * from './constants';
export * from './compiler';
export * from './config';
export * from './presets/create-jest-preset';
export * from './utils';
export * from './raw-compiler-options';
export * from './ts-jest-transformer';
export * from './types';
declare const _default: {
    createTransformer: () => TsJestTransformer;
};
export default _default;
