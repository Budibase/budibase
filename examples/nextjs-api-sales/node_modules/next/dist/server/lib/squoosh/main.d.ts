/// <reference types="node" />
declare type RotateOperation = {
    type: 'rotate';
    numRotations: number;
};
declare type ResizeOperation = {
    type: 'resize';
} & ({
    width: number;
    height?: never;
} | {
    height: number;
    width?: never;
});
export declare type Operation = RotateOperation | ResizeOperation;
export declare type Encoding = 'jpeg' | 'png' | 'webp' | 'avif';
export declare function processBuffer(buffer: Buffer, operations: Operation[], encoding: Encoding, quality: number): Promise<Buffer>;
export declare function decodeBuffer(buffer: Buffer): Promise<import("./image_data").default>;
export {};
