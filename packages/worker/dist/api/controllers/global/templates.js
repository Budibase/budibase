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
const { generateTemplateID } = require("@budibase/backend-core/db");
const { TemplateMetadata, TemplateBindings, GLOBAL_OWNER, } = require("../../../constants");
const { getTemplates } = require("../../../constants/templates");
const { getGlobalDB } = require("@budibase/backend-core/tenancy");
exports.save = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    let template = ctx.request.body;
    if (!template.ownerId) {
        template.ownerId = GLOBAL_OWNER;
    }
    if (!template._id) {
        template._id = generateTemplateID(template.ownerId);
    }
    const response = yield db.put(template);
    ctx.body = Object.assign(Object.assign({}, template), { _rev: response.rev });
});
exports.definitions = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const bindings = {};
    const info = {};
    for (let template of TemplateMetadata.email) {
        bindings[template.purpose] = template.bindings;
        info[template.purpose] = {
            name: template.name,
            description: template.description,
            category: template.category,
        };
    }
    ctx.body = {
        info,
        bindings: Object.assign(Object.assign({}, bindings), { common: Object.values(TemplateBindings) }),
    };
});
exports.fetch = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield getTemplates();
});
exports.fetchByType = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield getTemplates({
        type: ctx.params.type,
    });
});
exports.fetchByOwner = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield getTemplates({
        ownerId: ctx.params.ownerId,
    });
});
exports.find = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield getTemplates({
        id: ctx.params.id,
    });
});
exports.destroy = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    yield db.remove(ctx.params.id, ctx.params.rev);
    ctx.message = `Template ${ctx.params.id} deleted.`;
    ctx.status = 200;
});
