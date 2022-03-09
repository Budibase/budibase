import React from 'react';
import { AppContextType, AppInitialProps, AppPropsType, NextWebVitalsMetric } from '../shared/lib/utils';
import type { Router } from '../client/router';
export { AppInitialProps };
export { NextWebVitalsMetric };
export declare type AppContext = AppContextType<Router>;
export declare type AppProps<P = {}> = AppPropsType<Router, P>;
/**
 * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
 * This allows for keeping state between navigation, custom error handling, injecting additional data.
 */
declare function appGetInitialProps({ Component, ctx, }: AppContext): Promise<AppInitialProps>;
export default class App<P = {}, CP = {}, S = {}> extends React.Component<P & AppProps<CP>, S> {
    static origGetInitialProps: typeof appGetInitialProps;
    static getInitialProps: typeof appGetInitialProps;
    render(): JSX.Element;
}
