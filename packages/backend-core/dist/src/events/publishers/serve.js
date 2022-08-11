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
exports.servedAppPreview = exports.servedApp = exports.servedBuilder = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
function servedBuilder(timezone) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            timezone,
        };
        yield (0, events_1.publishEvent)(types_1.Event.SERVED_BUILDER, properties);
    });
}
exports.servedBuilder = servedBuilder;
function servedApp(app, timezone) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appVersion: app.version,
            timezone,
        };
        yield (0, events_1.publishEvent)(types_1.Event.SERVED_APP, properties);
    });
}
exports.servedApp = servedApp;
function servedAppPreview(app, timezone) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            appId: app.appId,
            appVersion: app.version,
            timezone,
        };
        yield (0, events_1.publishEvent)(types_1.Event.SERVED_APP_PREVIEW, properties);
    });
}
exports.servedAppPreview = servedAppPreview;
//# sourceMappingURL=serve.js.map