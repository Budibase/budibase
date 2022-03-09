import { NodePath, PluginObj, types as BabelTypes } from 'next/dist/compiled/babel/core';
export declare const EXPORT_NAME_GET_STATIC_PROPS = "getStaticProps";
export declare const EXPORT_NAME_GET_STATIC_PATHS = "getStaticPaths";
export declare const EXPORT_NAME_GET_SERVER_PROPS = "getServerSideProps";
declare type PluginState = {
    refs: Set<NodePath<BabelTypes.Identifier>>;
    isPrerender: boolean;
    isServerProps: boolean;
    done: boolean;
};
export default function nextTransformSsg({ types: t, }: {
    types: typeof BabelTypes;
}): PluginObj<PluginState>;
export {};
