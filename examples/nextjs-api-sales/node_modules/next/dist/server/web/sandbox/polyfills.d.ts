import { Crypto as WebCrypto } from 'next/dist/compiled/@peculiar/webcrypto';
import { CryptoKey } from 'next/dist/compiled/@peculiar/webcrypto';
import { ReadableStream } from './readable-stream';
export declare function atob(b64Encoded: string): string;
export declare function btoa(str: string): string;
export { CryptoKey, ReadableStream };
export declare class Crypto extends WebCrypto {
    randomUUID: any;
}
