export declare function getBoundary(): string;
export declare function formDataIterator(form: FormData, boundary: string): AsyncIterableIterator<Uint8Array>;
export declare function getFormDataLength(form: FormData, boundary: string): number;
