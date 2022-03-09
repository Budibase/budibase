"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processBuffer = processBuffer;
exports.decodeBuffer = decodeBuffer;
var _jestWorker = require("next/dist/compiled/jest-worker");
var path = _interopRequireWildcard(require("path"));
var _utils = require("../../../shared/lib/utils");
var _os = require("os");
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const getWorker = (0, _utils).execOnce(()=>new _jestWorker.Worker(path.resolve(__dirname, 'impl'), {
        enableWorkerThreads: true,
        // There will be at most 6 workers needed since each worker will take
        // at least 1 operation type.
        numWorkers: Math.max(1, Math.min((0, _os).cpus().length - 1, 6)),
        computeWorkerKey: (method)=>method
    })
);
async function processBuffer(buffer, operations, encoding, quality) {
    const worker = getWorker();
    let imageData = await worker.decodeBuffer(buffer);
    for (const operation of operations){
        if (operation.type === 'rotate') {
            imageData = await worker.rotate(imageData, operation.numRotations);
        } else if (operation.type === 'resize') {
            if (operation.width && imageData.width && imageData.width > operation.width) {
                imageData = await worker.resize({
                    image: imageData,
                    width: operation.width
                });
            } else if (operation.height && imageData.height && imageData.height > operation.height) {
                imageData = await worker.resize({
                    image: imageData,
                    height: operation.height
                });
            }
        }
    }
    switch(encoding){
        case 'jpeg':
            return Buffer.from(await worker.encodeJpeg(imageData, {
                quality
            }));
        case 'webp':
            return Buffer.from(await worker.encodeWebp(imageData, {
                quality
            }));
        case 'avif':
            const avifQuality = quality - 20;
            return Buffer.from(await worker.encodeAvif(imageData, {
                quality: Math.max(avifQuality, 0)
            }));
        case 'png':
            return Buffer.from(await worker.encodePng(imageData));
        default:
            throw Error(`Unsupported encoding format`);
    }
}
async function decodeBuffer(buffer) {
    const worker = getWorker();
    const imageData = await worker.decodeBuffer(buffer);
    return imageData;
}

//# sourceMappingURL=main.js.map