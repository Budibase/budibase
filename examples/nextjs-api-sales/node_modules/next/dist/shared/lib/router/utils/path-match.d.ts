import * as pathToRegexp from 'next/dist/compiled/path-to-regexp';
export { pathToRegexp };
export declare const matcherOptions: pathToRegexp.TokensToRegexpOptions & pathToRegexp.ParseOptions;
export declare const customRouteMatcherOptions: pathToRegexp.TokensToRegexpOptions & pathToRegexp.ParseOptions;
declare const _default: (customRoute?: boolean) => (path: string, regexModifier?: ((regex: string) => string) | undefined) => (pathname: string | null | undefined, params?: any) => any;
export default _default;
