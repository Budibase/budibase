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
exports.exported = exports.reverted = exports.versionReverted = exports.versionUpdated = exports.templateImported = exports.fileImported = exports.unpublished = exports.published = exports.deleted = exports.updated = exports.created = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
const created = (app, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = {
        appId: app.appId,
        version: app.version,
    };
    yield (0, events_1.publishEvent)(types_1.Event.APP_CREATED, properties, timestamp);
});
exports.created = created;
function updated(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
            version: app.version,
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_UPDATED, properties);
    });
}
exports.updated = updated;
function deleted(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_DELETED, properties);
    });
}
exports.deleted = deleted;
function published(app, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_PUBLISHED, properties, timestamp);
    });
}
exports.published = published;
function unpublished(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_UNPUBLISHED, properties);
    });
}
exports.unpublished = unpublished;
function fileImported(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_FILE_IMPORTED, properties);
    });
}
exports.fileImported = fileImported;
function templateImported(app, templateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
            templateKey,
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_TEMPLATE_IMPORTED, properties);
    });
}
exports.templateImported = templateImported;
function versionUpdated(app, currentVersion, updatedToVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
            currentVersion,
            updatedToVersion,
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_VERSION_UPDATED, properties);
    });
}
exports.versionUpdated = versionUpdated;
function versionReverted(app, currentVersion, revertedToVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
            currentVersion,
            revertedToVersion,
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_VERSION_REVERTED, properties);
    });
}
exports.versionReverted = versionReverted;
function reverted(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_REVERTED, properties);
    });
}
exports.reverted = reverted;
function exported(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_EXPORTED, properties);
    });
}
exports.exported = exported;
//# sourceMappingURL=app.js.map