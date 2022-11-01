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
exports.systemRestored = void 0;
const environment_1 = __importDefault(require("../../../environment"));
const backend_core_1 = require("@budibase/backend-core");
function systemRestored(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!environment_1.default.SELF_HOSTED) {
            ctx.throw(405, "This operation is not allowed in cloud.");
        }
        yield backend_core_1.cache.bustCache(backend_core_1.cache.CacheKeys.CHECKLIST);
        ctx.body = {
            message: "System prepared after restore.",
        };
    });
}
exports.systemRestored = systemRestored;
