import { getRouteRegex } from './route-regex';
export declare function getRouteMatcher(routeRegex: ReturnType<typeof getRouteRegex>): (pathname: string | null | undefined) => false | {
    [paramName: string]: string | string[];
};
