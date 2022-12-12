/// <reference types="node" />
import AWS from "aws-sdk";
import fs from "fs";
declare type UploadParams = {
    bucket: string;
    filename: string;
    path: string;
    type?: string;
    metadata?: {
        [key: string]: string | undefined;
    };
};
export declare function sanitizeKey(input: string): any;
export declare function sanitizeBucket(input: string): string;
/**
 * Gets a connection to the object store using the S3 SDK.
 * @param {string} bucket the name of the bucket which blobs will be uploaded/retrieved from.
 * @return {Object} an S3 object store object, check S3 Nodejs SDK for usage.
 * @constructor
 */
export declare const ObjectStore: (bucket: string) => AWS.S3;
/**
 * Given an object store and a bucket name this will make sure the bucket exists,
 * if it does not exist then it will create it.
 */
export declare const makeSureBucketExists: (client: any, bucketName: string) => Promise<void>;
/**
 * Uploads the contents of a file given the required parameters, useful when
 * temp files in use (for example file uploaded as an attachment).
 */
export declare const upload: ({ bucket: bucketName, filename, path, type, metadata, }: UploadParams) => Promise<AWS.S3.ManagedUpload.SendData>;
/**
 * Similar to the upload function but can be used to send a file stream
 * through to the object store.
 */
export declare const streamUpload: (bucketName: string, filename: string, stream: any, extra?: {}) => Promise<AWS.S3.ManagedUpload.SendData>;
/**
 * retrieves the contents of a file from the object store, if it is a known content type it
 * will be converted, otherwise it will be returned as a buffer stream.
 */
export declare const retrieve: (bucketName: string, filepath: string) => Promise<any>;
export declare const listAllObjects: (bucketName: string, path: string) => Promise<AWS.S3.Object[]>;
/**
 * Same as retrieval function but puts to a temporary file.
 */
export declare const retrieveToTmp: (bucketName: string, filepath: string) => Promise<string>;
export declare const retrieveDirectory: (bucketName: string, path: string) => Promise<string>;
/**
 * Delete a single file.
 */
export declare const deleteFile: (bucketName: string, filepath: string) => Promise<AWS.Request<AWS.S3.DeleteObjectOutput, AWS.AWSError>>;
export declare const deleteFiles: (bucketName: string, filepaths: string[]) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.DeleteObjectsOutput, AWS.AWSError>>;
/**
 * Delete a path, including everything within.
 */
export declare const deleteFolder: (bucketName: string, folder: string) => Promise<any>;
export declare const uploadDirectory: (bucketName: string, localPath: string, bucketPath: string) => Promise<fs.Dirent[]>;
export declare const downloadTarballDirect: (url: string, path: string, headers?: {}) => Promise<void>;
export declare const downloadTarball: (url: string, bucketName: string, path: string) => Promise<string>;
export {};
