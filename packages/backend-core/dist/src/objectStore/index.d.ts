/// <reference types="node" />
import AWS from "aws-sdk";
import fs from "fs";
export declare function sanitizeKey(input: any): any;
export declare function sanitizeBucket(input: any): any;
/**
 * Gets a connection to the object store using the S3 SDK.
 * @param {string} bucket the name of the bucket which blobs will be uploaded/retrieved from.
 * @return {Object} an S3 object store object, check S3 Nodejs SDK for usage.
 * @constructor
 */
export declare const ObjectStore: (bucket: any) => AWS.S3;
/**
 * Given an object store and a bucket name this will make sure the bucket exists,
 * if it does not exist then it will create it.
 */
export declare const makeSureBucketExists: (client: any, bucketName: any) => Promise<void>;
/**
 * Uploads the contents of a file given the required parameters, useful when
 * temp files in use (for example file uploaded as an attachment).
 */
export declare const upload: ({ bucket: bucketName, filename, path, type, metadata, }: any) => Promise<AWS.S3.ManagedUpload.SendData>;
/**
 * Similar to the upload function but can be used to send a file stream
 * through to the object store.
 */
export declare const streamUpload: (bucketName: any, filename: any, stream: any, extra?: {}) => Promise<AWS.S3.ManagedUpload.SendData>;
/**
 * retrieves the contents of a file from the object store, if it is a known content type it
 * will be converted, otherwise it will be returned as a buffer stream.
 */
export declare const retrieve: (bucketName: any, filepath: any) => Promise<any>;
/**
 * Same as retrieval function but puts to a temporary file.
 */
export declare const retrieveToTmp: (bucketName: any, filepath: any) => Promise<string>;
/**
 * Delete a single file.
 */
export declare const deleteFile: (bucketName: any, filepath: any) => Promise<AWS.Request<AWS.S3.DeleteObjectOutput, AWS.AWSError>>;
export declare const deleteFiles: (bucketName: any, filepaths: any) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.DeleteObjectsOutput, AWS.AWSError>>;
/**
 * Delete a path, including everything within.
 */
export declare const deleteFolder: (bucketName: any, folder: any) => Promise<any>;
export declare const uploadDirectory: (bucketName: any, localPath: any, bucketPath: any) => Promise<fs.Dirent[]>;
export declare const downloadTarball: (url: any, bucketName: any, path: any) => Promise<string>;
