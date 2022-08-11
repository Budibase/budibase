/// <reference types="node" />
declare const _exports: {
    ObjectStoreBuckets: {
        BACKUPS: string;
        APPS: string;
        TEMPLATES: string;
        GLOBAL: string;
        GLOBAL_CLOUD: string;
    };
    budibaseTempDir: () => string;
    sanitizeKey(input: any): any;
    sanitizeBucket(input: any): any;
    ObjectStore: (bucket: any) => AWS.S3;
    makeSureBucketExists: (client: any, bucketName: any) => Promise<void>;
    upload: ({ bucket: bucketName, filename, path, type, metadata, }: any) => Promise<AWS.S3.ManagedUpload.SendData>;
    streamUpload: (bucketName: any, filename: any, stream: any, extra?: {}) => Promise<AWS.S3.ManagedUpload.SendData>;
    retrieve: (bucketName: any, filepath: any) => Promise<any>;
    retrieveToTmp: (bucketName: any, filepath: any) => Promise<string>;
    deleteFile: (bucketName: any, filepath: any) => Promise<AWS.Request<AWS.S3.DeleteObjectOutput, AWS.AWSError>>;
    deleteFiles: (bucketName: any, filepaths: any) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.DeleteObjectsOutput, AWS.AWSError>>;
    deleteFolder: (bucketName: any, folder: any) => Promise<any>;
    uploadDirectory: (bucketName: any, localPath: any, bucketPath: any) => Promise<import("fs").Dirent[]>;
    downloadTarball: (url: any, bucketName: any, path: any) => Promise<string>;
};
export = _exports;
