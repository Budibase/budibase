declare const INTERNALS: unique symbol;
declare abstract class BaseBody implements Body {
    abstract headers: Headers;
    [INTERNALS]: {
        bodyInit?: BodyInit;
        boundary?: string;
        disturbed: boolean;
        stream?: ReadableStream<Uint8Array> | null;
    };
    constructor(bodyInit?: BodyInit);
    get body(): ReadableStream<Uint8Array> | null;
    get bodyUsed(): boolean;
    _consume(): Promise<Uint8Array>;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    text(): Promise<string>;
    json(): Promise<any>;
}
export { BaseBody as Body };
export declare type BodyInit = null | string | Blob | BufferSource | FormData | URLSearchParams | ReadableStream<Uint8Array>;
export declare function extractContentType(instance: BaseBody): string | null;
export declare function cloneBody(instance: BaseBody): string | ArrayBuffer | ArrayBufferView | Blob | FormData | ReadableStream<Uint8Array> | null;
export declare function getInstanceBody(instance: BaseBody): BodyInit | undefined;
