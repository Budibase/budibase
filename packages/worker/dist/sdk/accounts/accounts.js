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
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyMetadata = exports.getMetadata = exports.saveMetadata = exports.formatAccountMetadataId = void 0;
const backend_core_1 = require("@budibase/backend-core");
const formatAccountMetadataId = (accountId) => {
    return `${backend_core_1.DocumentType.ACCOUNT_METADATA}${backend_core_1.SEPARATOR}${accountId}`;
};
exports.formatAccountMetadataId = formatAccountMetadataId;
const saveMetadata = (metadata) => __awaiter(void 0, void 0, void 0, function* () {
    return backend_core_1.db.doWithDB(backend_core_1.StaticDatabases.PLATFORM_INFO.name, (db) => __awaiter(void 0, void 0, void 0, function* () {
        const existing = yield (0, exports.getMetadata)(metadata._id);
        if (existing) {
            metadata._rev = existing._rev;
        }
        const res = yield db.put(metadata);
        metadata._rev = res.rev;
        return metadata;
    }));
});
exports.saveMetadata = saveMetadata;
const getMetadata = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    return backend_core_1.db.doWithDB(backend_core_1.StaticDatabases.PLATFORM_INFO.name, (db) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.get(accountId);
        }
        catch (e) {
            if (e.status === 404) {
                // do nothing
                return;
            }
            else {
                throw e;
            }
        }
    }));
});
exports.getMetadata = getMetadata;
const destroyMetadata = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    yield backend_core_1.db.doWithDB(backend_core_1.StaticDatabases.PLATFORM_INFO.name, (db) => __awaiter(void 0, void 0, void 0, function* () {
        const metadata = yield (0, exports.getMetadata)(accountId);
        if (!metadata) {
            throw new backend_core_1.HTTPError(`id=${accountId} does not exist`, 404);
        }
        yield db.remove(accountId, metadata._rev);
    }));
});
exports.destroyMetadata = destroyMetadata;
