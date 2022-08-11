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
exports.firstStartup = exports.downgraded = exports.upgraded = exports.versionChecked = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
function versionChecked(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            currentVersion: version,
        };
        yield (0, events_1.publishEvent)(types_1.Event.INSTALLATION_VERSION_CHECKED, properties);
    });
}
exports.versionChecked = versionChecked;
function upgraded(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            from,
            to,
        };
        yield (0, events_1.publishEvent)(types_1.Event.INSTALLATION_VERSION_UPGRADED, properties);
    });
}
exports.upgraded = upgraded;
function downgraded(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            from,
            to,
        };
        yield (0, events_1.publishEvent)(types_1.Event.INSTALLATION_VERSION_DOWNGRADED, properties);
    });
}
exports.downgraded = downgraded;
function firstStartup() {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {};
        yield (0, events_1.publishEvent)(types_1.Event.INSTALLATION_FIRST_STARTUP, properties);
    });
}
exports.firstStartup = firstStartup;
//# sourceMappingURL=installation.js.map