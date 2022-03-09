import React from 'react';
import { NextComponentType, NextPageContext } from '../shared/lib/utils';
import { NextRouter } from './router';
export declare type WithRouterProps = {
    router: NextRouter;
};
export declare type ExcludeRouterProps<P> = Pick<P, Exclude<keyof P, keyof WithRouterProps>>;
export default function withRouter<P extends WithRouterProps, C = NextPageContext>(ComposedComponent: NextComponentType<C, any, P>): React.ComponentType<ExcludeRouterProps<P>>;
