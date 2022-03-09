/// <reference types="node" />
import React from 'react';
import { UrlObject } from 'url';
declare type Url = string | UrlObject;
export declare type LinkProps = {
    href: Url;
    as?: Url;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
};
declare function Link(props: React.PropsWithChildren<LinkProps>): React.DetailedReactHTMLElement<{
    onMouseEnter?: React.MouseEventHandler<Element> | undefined;
    onClick: React.MouseEventHandler;
    href?: string | undefined;
    ref?: any;
}, HTMLElement>;
export default Link;
