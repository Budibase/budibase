/**
 * INTERNAL, DO NOT USE. Code may change at any time.
 */
export interface Fragment {
    key: string | null;
    first: null;
    c: () => void;
    l: (nodes: any) => void;
    h: () => void;
    m: (target: HTMLElement, anchor: any) => void;
    p: (ctx: T$$['ctx'], dirty: T$$['dirty']) => void;
    r: () => void;
    f: () => void;
    a: () => void;
    i: (local: any) => void;
    o: (local: any) => void;
    d: (detaching: 0 | 1) => void;
}
export declare type FragmentFactory = (ctx: any) => Fragment;
export interface T$$ {
    dirty: number[];
    ctx: any[];
    bound: any;
    update: () => void;
    callbacks: any;
    after_update: any[];
    props: Record<string, 0 | string>;
    fragment: null | false | Fragment;
    not_equal: any;
    before_update: any[];
    context: Map<any, any>;
    on_mount: any[];
    on_destroy: any[];
    skip_bound: boolean;
    on_disconnect: any[];
    root: Element | ShadowRoot;
}
