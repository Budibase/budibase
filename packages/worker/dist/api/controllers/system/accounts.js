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
exports.destroy = exports.save = void 0;
const sdk_1 = require("../../../sdk");
const save = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const account = ctx.request.body;
    let metadata = {
        _id: sdk_1.accounts.formatAccountMetadataId(account.accountId),
        email: account.email,
    };
    metadata = yield sdk_1.accounts.saveMetadata(metadata);
    ctx.body = metadata;
    ctx.status = 200;
});
exports.save = save;
const destroy = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const accountId = sdk_1.accounts.formatAccountMetadataId(ctx.params.accountId);
    yield sdk_1.accounts.destroyMetadata(accountId);
    ctx.status = 204;
});
exports.destroy = destroy;
