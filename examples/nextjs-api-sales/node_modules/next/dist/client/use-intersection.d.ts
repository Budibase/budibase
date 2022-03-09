/// <reference types="react" />
declare type UseIntersectionObserverInit = Pick<IntersectionObserverInit, 'rootMargin' | 'root'>;
declare type UseIntersection = {
    disabled?: boolean;
} & UseIntersectionObserverInit & {
    rootRef?: React.RefObject<HTMLElement> | null;
};
export declare function useIntersection<T extends Element>({ rootRef, rootMargin, disabled, }: UseIntersection): [(element: T | null) => void, boolean];
export {};
