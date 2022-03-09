import { PluginObj, types as BabelTypes } from 'next/dist/compiled/babel/core';
export default function ({ types: t, }: {
    types: typeof BabelTypes;
}): PluginObj<any>;
