interface Group {
    pos: number;
    repeat: boolean;
    optional: boolean;
}
export declare function getParametrizedRoute(route: string): {
    parameterizedRoute: string;
    namedParameterizedRoute: string;
    groups: {
        [groupName: string]: Group;
    };
    routeKeys: {
        [named: string]: string;
    };
} | {
    parameterizedRoute: string;
    groups: {
        [groupName: string]: Group;
    };
    namedParameterizedRoute?: undefined;
    routeKeys?: undefined;
};
export interface RouteRegex {
    groups: {
        [groupName: string]: Group;
    };
    namedRegex?: string;
    re: RegExp;
    routeKeys?: {
        [named: string]: string;
    };
}
export declare function getRouteRegex(normalizedRoute: string): RouteRegex;
export {};
