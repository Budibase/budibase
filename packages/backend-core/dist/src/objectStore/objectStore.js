"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadTarball = exports.downloadTarballDirect = exports.uploadDirectory = exports.deleteFolder = exports.deleteFiles = exports.deleteFile = exports.retrieveDirectory = exports.retrieveToTmp = exports.listAllObjects = exports.retrieve = exports.streamUpload = exports.upload = exports.makeSureBucketExists = exports.ObjectStore = exports.sanitizeBucket = exports.sanitizeKey = void 0;
const sanitize = require("sanitize-s3-objectkey");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const stream_1 = __importDefault(require("stream"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const tar_fs_1 = __importDefault(require("tar-fs"));
const zlib = require("zlib");
const util_1 = require("util");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const environment_1 = __importDefault(require("../environment"));
const utils_1 = require("./utils");
const uuid_1 = require("uuid");
const db_1 = require("../db");
const streamPipeline = (0, util_1.promisify)(stream_1.default.pipeline);
// use this as a temporary store of buckets that are being created
const STATE = {
    bucketCreationPromises: {},
};
const CONTENT_TYPE_MAP = {
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    gz: "application/gzip",
};
const STRING_CONTENT_TYPES = [
    CONTENT_TYPE_MAP.html,
    CONTENT_TYPE_MAP.css,
    CONTENT_TYPE_MAP.js,
    CONTENT_TYPE_MAP.json,
];
// does normal sanitization and then swaps dev apps to apps
function sanitizeKey(input) {
    return sanitize(sanitizeBucket(input)).replace(/\\/g, "/");
}
exports.sanitizeKey = sanitizeKey;
// simply handles the dev app to app conversion
function sanitizeBucket(input) {
    return input.replace(new RegExp(db_1.APP_DEV_PREFIX, "g"), db_1.APP_PREFIX);
}
exports.sanitizeBucket = sanitizeBucket;
function publicPolicy(bucketName) {
    return {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: {
                    AWS: ["*"],
                },
                Action: "s3:GetObject",
                Resource: [`arn:aws:s3:::${bucketName}/*`],
            },
        ],
    };
}
const PUBLIC_BUCKETS = [
    utils_1.ObjectStoreBuckets.APPS,
    utils_1.ObjectStoreBuckets.GLOBAL,
    utils_1.ObjectStoreBuckets.PLUGINS,
];
/**
 * Gets a connection to the object store using the S3 SDK.
 * @param {string} bucket the name of the bucket which blobs will be uploaded/retrieved from.
 * @return {Object} an S3 object store object, check S3 Nodejs SDK for usage.
 * @constructor
 */
const ObjectStore = (bucket) => {
    const config = {
        s3ForcePathStyle: true,
        signatureVersion: "v4",
        apiVersion: "2006-03-01",
        accessKeyId: environment_1.default.MINIO_ACCESS_KEY,
        secretAccessKey: environment_1.default.MINIO_SECRET_KEY,
        region: environment_1.default.AWS_REGION,
    };
    if (bucket) {
        config.params = {
            Bucket: sanitizeBucket(bucket),
        };
    }
    if (environment_1.default.MINIO_URL) {
        config.endpoint = environment_1.default.MINIO_URL;
    }
    return new aws_sdk_1.default.S3(config);
};
exports.ObjectStore = ObjectStore;
/**
 * Given an object store and a bucket name this will make sure the bucket exists,
 * if it does not exist then it will create it.
 */
const makeSureBucketExists = (client, bucketName) => __awaiter(void 0, void 0, void 0, function* () {
    bucketName = sanitizeBucket(bucketName);
    try {
        yield client
            .headBucket({
            Bucket: bucketName,
        })
            .promise();
    }
    catch (err) {
        const promises = STATE.bucketCreationPromises;
        const doesntExist = err.statusCode === 404, noAccess = err.statusCode === 403;
        if (promises[bucketName]) {
            yield promises[bucketName];
        }
        else if (doesntExist || noAccess) {
            if (doesntExist) {
                // bucket doesn't exist create it
                promises[bucketName] = client
                    .createBucket({
                    Bucket: bucketName,
                })
                    .promise();
                yield promises[bucketName];
                delete promises[bucketName];
            }
            // public buckets are quite hidden in the system, make sure
            // no bucket is set accidentally
            if (PUBLIC_BUCKETS.includes(bucketName)) {
                yield client
                    .putBucketPolicy({
                    Bucket: bucketName,
                    Policy: JSON.stringify(publicPolicy(bucketName)),
                })
                    .promise();
            }
        }
        else {
            throw new Error("Unable to write to object store bucket.");
        }
    }
});
exports.makeSureBucketExists = makeSureBucketExists;
/**
 * Uploads the contents of a file given the required parameters, useful when
 * temp files in use (for example file uploaded as an attachment).
 */
const upload = ({ bucket: bucketName, filename, path, type, metadata, }) => __awaiter(void 0, void 0, void 0, function* () {
    const extension = filename.split(".").pop();
    const fileBytes = fs_1.default.readFileSync(path);
    const objectStore = (0, exports.ObjectStore)(bucketName);
    yield (0, exports.makeSureBucketExists)(objectStore, bucketName);
    let contentType = type;
    if (!contentType) {
        contentType = extension
            ? CONTENT_TYPE_MAP[extension.toLowerCase()]
            : CONTENT_TYPE_MAP.txt;
    }
    const config = {
        // windows file paths need to be converted to forward slashes for s3
        Key: sanitizeKey(filename),
        Body: fileBytes,
        ContentType: contentType,
    };
    if (metadata && typeof metadata === "object") {
        // remove any nullish keys from the metadata object, as these may be considered invalid
        for (let key of Object.keys(metadata)) {
            if (!metadata[key] || typeof metadata[key] !== "string") {
                delete metadata[key];
            }
        }
        config.Metadata = metadata;
    }
    return objectStore.upload(config).promise();
});
exports.upload = upload;
/**
 * Similar to the upload function but can be used to send a file stream
 * through to the object store.
 */
const streamUpload = (bucketName, filename, stream, extra = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const objectStore = (0, exports.ObjectStore)(bucketName);
    yield (0, exports.makeSureBucketExists)(objectStore, bucketName);
    // Set content type for certain known extensions
    if (filename === null || filename === void 0 ? void 0 : filename.endsWith(".js")) {
        extra = Object.assign(Object.assign({}, extra), { ContentType: "application/javascript" });
    }
    else if (filename === null || filename === void 0 ? void 0 : filename.endsWith(".svg")) {
        extra = Object.assign(Object.assign({}, extra), { ContentType: "image" });
    }
    const params = Object.assign({ Bucket: sanitizeBucket(bucketName), Key: sanitizeKey(filename), Body: stream }, extra);
    return objectStore.upload(params).promise();
});
exports.streamUpload = streamUpload;
/**
 * retrieves the contents of a file from the object store, if it is a known content type it
 * will be converted, otherwise it will be returned as a buffer stream.
 */
const retrieve = (bucketName, filepath) => __awaiter(void 0, void 0, void 0, function* () {
    const objectStore = (0, exports.ObjectStore)(bucketName);
    const params = {
        Bucket: sanitizeBucket(bucketName),
        Key: sanitizeKey(filepath),
    };
    const response = yield objectStore.getObject(params).promise();
    // currently these are all strings
    if (STRING_CONTENT_TYPES.includes(response.ContentType)) {
        return response.Body.toString("utf8");
    }
    else {
        return response.Body;
    }
});
exports.retrieve = retrieve;
const listAllObjects = (bucketName, path) => __awaiter(void 0, void 0, void 0, function* () {
    const objectStore = (0, exports.ObjectStore)(bucketName);
    const list = (params = {}) => {
        return objectStore
            .listObjectsV2(Object.assign(Object.assign({}, params), { Bucket: sanitizeBucket(bucketName), Prefix: sanitizeKey(path) }))
            .promise();
    };
    let isTruncated = false, token, objects = [];
    do {
        let params = {};
        if (token) {
            params.ContinuationToken = token;
        }
        const response = yield list(params);
        if (response.Contents) {
            objects = objects.concat(response.Contents);
        }
        isTruncated = !!response.IsTruncated;
    } while (isTruncated);
    return objects;
});
exports.listAllObjects = listAllObjects;
/**
 * Same as retrieval function but puts to a temporary file.
 */
const retrieveToTmp = (bucketName, filepath) => __awaiter(void 0, void 0, void 0, function* () {
    bucketName = sanitizeBucket(bucketName);
    filepath = sanitizeKey(filepath);
    const data = yield (0, exports.retrieve)(bucketName, filepath);
    const outputPath = (0, path_1.join)((0, utils_1.budibaseTempDir)(), (0, uuid_1.v4)());
    fs_1.default.writeFileSync(outputPath, data);
    return outputPath;
});
exports.retrieveToTmp = retrieveToTmp;
const retrieveDirectory = (bucketName, path) => __awaiter(void 0, void 0, void 0, function* () {
    let writePath = (0, path_1.join)((0, utils_1.budibaseTempDir)(), (0, uuid_1.v4)());
    fs_1.default.mkdirSync(writePath);
    const objects = yield (0, exports.listAllObjects)(bucketName, path);
    let fullObjects = yield Promise.all(objects.map(obj => (0, exports.retrieve)(bucketName, obj.Key)));
    let count = 0;
    for (let obj of objects) {
        const filename = obj.Key;
        const data = fullObjects[count++];
        const possiblePath = filename.split("/");
        if (possiblePath.length > 1) {
            const dirs = possiblePath.slice(0, possiblePath.length - 1);
            fs_1.default.mkdirSync((0, path_1.join)(writePath, ...dirs), { recursive: true });
        }
        fs_1.default.writeFileSync((0, path_1.join)(writePath, ...possiblePath), data);
    }
    return writePath;
});
exports.retrieveDirectory = retrieveDirectory;
/**
 * Delete a single file.
 */
const deleteFile = (bucketName, filepath) => __awaiter(void 0, void 0, void 0, function* () {
    const objectStore = (0, exports.ObjectStore)(bucketName);
    yield (0, exports.makeSureBucketExists)(objectStore, bucketName);
    const params = {
        Bucket: bucketName,
        Key: filepath,
    };
    return objectStore.deleteObject(params);
});
exports.deleteFile = deleteFile;
const deleteFiles = (bucketName, filepaths) => __awaiter(void 0, void 0, void 0, function* () {
    const objectStore = (0, exports.ObjectStore)(bucketName);
    yield (0, exports.makeSureBucketExists)(objectStore, bucketName);
    const params = {
        Bucket: bucketName,
        Delete: {
            Objects: filepaths.map((path) => ({ Key: path })),
        },
    };
    return objectStore.deleteObjects(params).promise();
});
exports.deleteFiles = deleteFiles;
/**
 * Delete a path, including everything within.
 */
const deleteFolder = (bucketName, folder) => __awaiter(void 0, void 0, void 0, function* () {
    bucketName = sanitizeBucket(bucketName);
    folder = sanitizeKey(folder);
    const client = (0, exports.ObjectStore)(bucketName);
    const listParams = {
        Bucket: bucketName,
        Prefix: folder,
    };
    let response = yield client.listObjects(listParams).promise();
    if (response.Contents.length === 0) {
        return;
    }
    const deleteParams = {
        Bucket: bucketName,
        Delete: {
            Objects: [],
        },
    };
    response.Contents.forEach((content) => {
        deleteParams.Delete.Objects.push({ Key: content.Key });
    });
    response = yield client.deleteObjects(deleteParams).promise();
    // can only empty 1000 items at once
    if (response.Deleted.length === 1000) {
        return (0, exports.deleteFolder)(bucketName, folder);
    }
});
exports.deleteFolder = deleteFolder;
const uploadDirectory = (bucketName, localPath, bucketPath) => __awaiter(void 0, void 0, void 0, function* () {
    bucketName = sanitizeBucket(bucketName);
    let uploads = [];
    const files = fs_1.default.readdirSync(localPath, { withFileTypes: true });
    for (let file of files) {
        const path = sanitizeKey((0, path_1.join)(bucketPath, file.name));
        const local = (0, path_1.join)(localPath, file.name);
        if (file.isDirectory()) {
            uploads.push((0, exports.uploadDirectory)(bucketName, local, path));
        }
        else {
            uploads.push((0, exports.streamUpload)(bucketName, path, fs_1.default.createReadStream(local)));
        }
    }
    yield Promise.all(uploads);
    return files;
});
exports.uploadDirectory = uploadDirectory;
const downloadTarballDirect = (url, path, headers = {}) => __awaiter(void 0, void 0, void 0, function* () {
    path = sanitizeKey(path);
    const response = yield (0, node_fetch_1.default)(url, { headers });
    if (!response.ok) {
        throw new Error(`unexpected response ${response.statusText}`);
    }
    yield streamPipeline(response.body, zlib.Unzip(), tar_fs_1.default.extract(path));
});
exports.downloadTarballDirect = downloadTarballDirect;
const downloadTarball = (url, bucketName, path) => __awaiter(void 0, void 0, void 0, function* () {
    bucketName = sanitizeBucket(bucketName);
    path = sanitizeKey(path);
    const response = yield (0, node_fetch_1.default)(url);
    if (!response.ok) {
        throw new Error(`unexpected response ${response.statusText}`);
    }
    const tmpPath = (0, path_1.join)((0, utils_1.budibaseTempDir)(), path);
    yield streamPipeline(response.body, zlib.Unzip(), tar_fs_1.default.extract(tmpPath));
    if (!environment_1.default.isTest() && environment_1.default.SELF_HOSTED) {
        yield (0, exports.uploadDirectory)(bucketName, tmpPath, path);
    }
    // return the temporary path incase there is a use for it
    return tmpPath;
});
exports.downloadTarball = downloadTarball;
//# sourceMappingURL=objectStore.js.map