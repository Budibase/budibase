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
const { getGlobalDB } = require("@budibase/backend-core/tenancy");
const { getGlobalUserParams } = require("@budibase/backend-core/db");
exports.checkAnyUserExists = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = getGlobalDB();
        const users = yield db.allDocs(getGlobalUserParams(null, {
            include_docs: true,
            limit: 1,
        }));
        return users && users.rows.length >= 1;
    }
    catch (err) {
        throw new Error("Unable to retrieve user list");
    }
});
