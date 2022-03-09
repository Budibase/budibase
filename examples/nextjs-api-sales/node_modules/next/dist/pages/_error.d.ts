import React from 'react';
import { NextPageContext } from '../shared/lib/utils';
export declare type ErrorProps = {
    statusCode: number;
    title?: string;
};
declare function _getInitialProps({ res, err, }: NextPageContext): Promise<ErrorProps> | ErrorProps;
/**
 * `Error` component used for handling errors.
 */
export default class Error<P = {}> extends React.Component<P & ErrorProps> {
    static displayName: string;
    static getInitialProps: typeof _getInitialProps;
    static origGetInitialProps: typeof _getInitialProps;
    render(): JSX.Element;
}
export {};
