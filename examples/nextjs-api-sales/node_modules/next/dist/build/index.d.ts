import { __ApiPreviewProps } from '../server/api-utils';
export declare type SsgRoute = {
    initialRevalidateSeconds: number | false;
    srcRoute: string | null;
    dataRoute: string;
};
export declare type DynamicSsgRoute = {
    routeRegex: string;
    fallback: string | null | false;
    dataRoute: string;
    dataRouteRegex: string;
};
export declare type PrerenderManifest = {
    version: 3;
    routes: {
        [route: string]: SsgRoute;
    };
    dynamicRoutes: {
        [route: string]: DynamicSsgRoute;
    };
    notFoundRoutes: string[];
    preview: __ApiPreviewProps;
};
export default function build(dir: string, conf?: null, reactProductionProfiling?: boolean, debugOutput?: boolean, runLint?: boolean): Promise<void>;
