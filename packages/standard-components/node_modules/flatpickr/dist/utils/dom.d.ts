export declare function toggleClass(elem: HTMLElement, className: string, bool: boolean): void;
export declare function createElement<T extends HTMLElement>(tag: keyof HTMLElementTagNameMap, className: string, content?: string): T;
export declare function clearNode(node: HTMLElement): void;
export declare function findParent(node: Element, condition: (n: Element) => boolean): Element | undefined;
export declare function createNumberInput(inputClassName: string, opts?: Record<string, any>): HTMLDivElement;
export declare function getEventTarget(event: Event): EventTarget | null;
