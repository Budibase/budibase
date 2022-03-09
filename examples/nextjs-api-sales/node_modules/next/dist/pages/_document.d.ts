import React, { Component, ReactNode } from 'react';
import { DocumentContext, DocumentInitialProps, DocumentProps, HtmlContext, HtmlProps } from '../shared/lib/utils';
export { DocumentContext, DocumentInitialProps, DocumentProps };
export declare type OriginProps = {
    nonce?: string;
    crossOrigin?: string;
};
declare type DocumentFiles = {
    sharedFiles: readonly string[];
    pageFiles: readonly string[];
    allFiles: readonly string[];
};
/**
 * `Document` component handles the initial `document` markup and renders only on the server side.
 * Commonly used for implementing server side rendering for `css-in-js` libraries.
 */
export default class Document<P = {}> extends Component<DocumentProps & P> {
    /**
     * `getInitialProps` hook returns the context object with the addition of `renderPage`.
     * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
     */
    static getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps>;
    render(): JSX.Element;
}
export declare function Html(props: React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>): JSX.Element;
export declare class Head extends Component<OriginProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>> {
    static contextType: React.Context<HtmlProps>;
    context: React.ContextType<typeof HtmlContext>;
    getCssLinks(files: DocumentFiles): JSX.Element[] | null;
    getPreloadDynamicChunks(): (JSX.Element | null)[];
    getPreloadMainLinks(files: DocumentFiles): JSX.Element[] | null;
    getDynamicChunks(files: DocumentFiles): (JSX.Element | null)[];
    getPreNextScripts(): JSX.Element[];
    getScripts(files: DocumentFiles): JSX.Element[];
    getPolyfillScripts(): JSX.Element[];
    handleDocumentScriptLoaderItems(children: React.ReactNode): ReactNode[];
    makeStylesheetInert(node: ReactNode): ReactNode[];
    render(): JSX.Element;
}
export declare function Main(): JSX.Element;
export declare class NextScript extends Component<OriginProps> {
    static contextType: React.Context<HtmlProps>;
    context: React.ContextType<typeof HtmlContext>;
    static safariNomoduleFix: string;
    getDynamicChunks(files: DocumentFiles): (JSX.Element | null)[];
    getPreNextScripts(): JSX.Element[];
    getScripts(files: DocumentFiles): JSX.Element[];
    getPolyfillScripts(): JSX.Element[];
    static getInlineScriptSource(context: Readonly<HtmlProps>): string;
    render(): JSX.Element;
}
