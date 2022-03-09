/// <reference types="node" />
import ImageData from './image_data';
export declare function decodeBuffer(_buffer: Buffer | Uint8Array): Promise<ImageData>;
export declare function rotate(image: ImageData, numRotations: number): Promise<ImageData>;
declare type ResizeOpts = {
    image: ImageData;
} & ({
    width: number;
    height?: never;
} | {
    height: number;
    width?: never;
});
export declare function resize({ image, width, height }: ResizeOpts): Promise<ImageData>;
export declare function encodeJpeg(image: ImageData, { quality }: {
    quality: number;
}): Promise<Buffer | Uint8Array>;
export declare function encodeWebp(image: ImageData, { quality }: {
    quality: number;
}): Promise<Buffer | Uint8Array>;
export declare function encodeAvif(image: ImageData, { quality }: {
    quality: number;
}): Promise<Buffer | Uint8Array>;
export declare function encodePng(image: ImageData): Promise<Buffer | Uint8Array>;
export {};
