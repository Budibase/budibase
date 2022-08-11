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
const { getWorkspaceParams, generateWorkspaceID, } = require("@budibase/backend-core/db");
const { getGlobalDB } = require("@budibase/backend-core/tenancy");
exports.save = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        const workspaceDoc = ctx.request.body;
        // workspace does not exist yet
        if (!workspaceDoc._id) {
            workspaceDoc._id = generateWorkspaceID();
        }
        try {
            const response = yield db.put(workspaceDoc);
            ctx.body = {
                _id: response.id,
                _rev: response.rev,
            };
        }
        catch (err) {
            ctx.throw(err.status, err);
        }
    });
};
exports.fetch = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        const response = yield db.allDocs(getWorkspaceParams(undefined, {
            include_docs: true,
        }));
        ctx.body = response.rows.map(row => row.doc);
    });
};
exports.find = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        try {
            ctx.body = yield db.get(ctx.params.id);
        }
        catch (err) {
            ctx.throw(err.status, err);
        }
    });
};
exports.destroy = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        const { id, rev } = ctx.params;
        try {
            yield db.remove(id, rev);
            ctx.body = { message: "Workspace deleted successfully" };
        }
        catch (err) {
            ctx.throw(err.status, err);
        }
    });
};
