import { PluginObj, types as BabelTypes } from 'next/dist/compiled/babel/core';
export default function nextPageConfig({ types: t, }: {
    types: typeof BabelTypes;
}): PluginObj;
