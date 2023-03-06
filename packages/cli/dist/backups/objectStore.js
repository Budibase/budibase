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
exports.importObjects = exports.exportObjects = void 0;
const backend_core_1 = require("@budibase/backend-core");
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const utils_1 = require("./utils");
const utils_2 = require("../utils");
const { ObjectStoreBuckets, ObjectStore, retrieve, uploadDirectory, makeSureBucketExists, } = backend_core_1.objectStore;
const bucketList = Object.values(ObjectStoreBuckets);
function exportObjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const path = (0, path_1.join)(utils_1.TEMP_DIR, utils_1.MINIO_DIR);
        fs_1.default.mkdirSync(path);
        let fullList = [];
        let errorCount = 0;
        for (let bucket of bucketList) {
            const client = ObjectStore(bucket);
            try {
                yield client.headBucket().promise();
            }
            catch (err) {
                errorCount++;
                continue;
            }
            const list = (yield client.listObjectsV2().promise());
            fullList = fullList.concat(list.Contents.map(el => (Object.assign(Object.assign({}, el), { bucket }))));
        }
        if (errorCount === bucketList.length) {
            throw new Error("Unable to access MinIO/S3 - check environment config.");
        }
        const bar = (0, utils_2.progressBar)(fullList.length);
        let count = 0;
        for (let object of fullList) {
            const filename = object.Key;
            const data = yield retrieve(object.bucket, filename);
            const possiblePath = filename.split("/");
            if (possiblePath.length > 1) {
                const dirs = possiblePath.slice(0, possiblePath.length - 1);
                fs_1.default.mkdirSync((0, path_1.join)(path, object.bucket, ...dirs), { recursive: true });
            }
            fs_1.default.writeFileSync((0, path_1.join)(path, object.bucket, ...possiblePath), data);
            bar.update(++count);
        }
        bar.stop();
    });
}
exports.exportObjects = exportObjects;
function importObjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const path = (0, path_1.join)(utils_1.TEMP_DIR, utils_1.MINIO_DIR);
        const buckets = fs_1.default.readdirSync(path);
        let total = 0;
        buckets.forEach(bucket => {
            const files = fs_1.default.readdirSync((0, path_1.join)(path, bucket));
            total += files.length;
        });
        const bar = (0, utils_2.progressBar)(total);
        let count = 0;
        for (let bucket of buckets) {
            const client = ObjectStore(bucket);
            yield makeSureBucketExists(client, bucket);
            const files = yield uploadDirectory(bucket, (0, path_1.join)(path, bucket), "/");
            count += files.length;
            bar.update(count);
        }
        bar.stop();
    });
}
exports.importObjects = importObjects;
